import { FormEvent, useState } from "react";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";
import { API_BASE_URL } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "stored"; message: string }
  | { kind: "fallback"; message: string; email: string | null }
  | { kind: "error"; message: string };

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });

  const isSubmitting = submitState.kind === "submitting";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitState({ kind: "submitting" });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data) {
        setSubmitState({
          kind: "error",
          message:
            data?.detail?.[0]?.msg ??
            "Something went wrong sending your message. Please try again.",
        });
        return;
      }

      if (data.status === "stored") {
        setSubmitState({ kind: "stored", message: data.message });
        setName("");
        setEmail("");
        setMessage("");
        return;
      }

      setSubmitState({
        kind: "fallback",
        message: data.message,
        email: data.fallback_contact?.email ?? null,
      });
    } catch {
      setSubmitState({
        kind: "error",
        message: "Could not reach the server. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        label="Contact Center"
        title="A direct path for high-signal conversations."
        description="Messages are stored when a database is configured. If it isn't, you'll see a clear fallback instead of a silent failure."
      />
      <Card className="grid gap-4 p-5">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm text-text-secondary">
            Name
            <input
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              className="h-11 rounded-md border border-border-mid bg-elevated px-3 text-text-primary disabled:opacity-60"
            />
          </label>
          <label className="grid gap-2 text-sm text-text-secondary">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              className="h-11 rounded-md border border-border-mid bg-elevated px-3 text-text-primary disabled:opacity-60"
            />
          </label>
          <label className="grid gap-2 text-sm text-text-secondary">
            Message
            <textarea
              required
              minLength={10}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isSubmitting}
              className="min-h-32 rounded-md border border-border-mid bg-elevated px-3 py-3 text-text-primary disabled:opacity-60"
            />
          </label>
          <Button className="w-full sm:w-fit" type="submit" disabled={isSubmitting}>
            <Mail aria-hidden="true" className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {submitState.kind === "stored" ? (
          <div className="flex items-start gap-3 rounded-md border border-success/40 bg-[var(--status-ghost)] p-3 text-sm text-success">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitState.message}</p>
          </div>
        ) : null}

        {submitState.kind === "fallback" ? (
          <div className="flex items-start gap-3 rounded-md border border-amber/40 bg-[var(--amber-ghost)] p-3 text-sm text-amber">
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{submitState.message}</p>
              {submitState.email ? (
                <a className="mt-2 inline-block font-medium underline" href={`mailto:${submitState.email}`}>
                  {submitState.email}
                </a>
              ) : (
                <p className="mt-2 font-mono text-xs text-text-tertiary">
                  TODO_VERIFY: direct contact email not yet configured.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {submitState.kind === "error" ? (
          <div className="flex items-start gap-3 rounded-md border border-rose/40 bg-[var(--rose-ghost)] p-3 text-sm text-rose">
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitState.message}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
