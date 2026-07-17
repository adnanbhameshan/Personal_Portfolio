import ReactMarkdown from "react-markdown";
import { FormEvent, useRef, useState } from "react";
import { AlertCircle, Bot, RotateCcw, Send, UserRound } from "lucide-react";
import { suggestedPrompts } from "../../constants/ai";
import { streamNexusChat } from "../../lib/api";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

interface NexusAIChatProps {
  compact?: boolean;
}

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Ask me about Adnan's projects, skills, career goals, AWS learning path, or which project best demonstrates his engineering judgment.",
};

export function NexusAIChat({ compact = false }: NexusAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastQuestionRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const submitQuestion = async (question: string) => {
    const trimmed = question.trim();

    if (!trimmed || isStreaming) {
      return;
    }

    const assistantId = crypto.randomUUID();
    lastQuestionRef.current = trimmed;
    setInput("");
    setError(null);
    setIsStreaming(true);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
      { id: assistantId, role: "assistant", content: "" },
    ]);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      await streamNexusChat(trimmed, {
        signal: abortController.signal,
        onSources: (sources) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId ? { ...message, sources } : message,
            ),
          );
        },
        onToken: (token) => {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + token }
                : message,
            ),
          );
        },
        onError: (message) => setError(message),
        onDone: () => setIsStreaming(false),
      });
    } catch (caughtError) {
      if (
        caughtError instanceof DOMException &&
        caughtError.name === "AbortError"
      ) {
        return;
      }
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "NEXUS AI encountered an error.",
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitQuestion(input);
  };

  const retry = () => {
    if (lastQuestionRef.current) {
      void submitQuestion(lastQuestionRef.current);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border-subtle p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md border border-ai/40 bg-[var(--ai-ghost)]">
            <Bot aria-hidden="true" className="h-5 w-5 text-ai" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">
              NEXUS AI
            </h2>
            <p className="text-sm text-text-secondary">
              Intelligent portfolio guide. No memory, no agents.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start"
            }
          >
            <div
              className={`max-w-[92%] rounded-lg border p-3 ${
                message.role === "user"
                  ? "border-primary/40 bg-[var(--accent-ghost)] text-text-primary"
                  : "border-border-mid bg-surface text-text-secondary"
              }`}
            >
              <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase text-text-tertiary">
                {message.role === "user" ? (
                  <UserRound className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
                {message.role === "user" ? "Visitor" : "NEXUS AI"}
              </div>
              <div className="prose prose-invert max-w-none text-sm">
                <ReactMarkdown>
                  {message.content || "Thinking..."}
                </ReactMarkdown>
              </div>
              {message.sources?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.sources.map((source) => (
                    <Badge key={source} variant="tag">
                      {source}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        {error ? (
          <div className="rounded-lg border border-amber/30 bg-[var(--amber-ghost)] p-3 text-sm text-amber">
            <div className="flex items-center gap-2">
              <AlertCircle aria-hidden="true" className="h-4 w-4" />
              {error}
            </div>
            <Button
              className="mt-3"
              size="sm"
              variant="outline"
              onClick={retry}
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border-subtle p-4">
        <div
          className={
            compact
              ? "mb-3 flex gap-2 overflow-x-auto pb-1"
              : "mb-3 flex flex-wrap gap-2"
          }
        >
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isStreaming}
              onClick={() => void submitQuestion(prompt)}
              className="shrink-0 rounded-md border border-border-mid bg-elevated px-3 py-2 text-left text-xs text-text-secondary transition hover:border-ai/60 hover:text-text-primary disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form className="flex gap-2" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="nexus-ai-input">
            Ask NEXUS AI
          </label>
          <input
            id="nexus-ai-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about Trackr, skills, AWS, or project decisions..."
            className="min-w-0 flex-1 rounded-md border border-border-mid bg-elevated px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-ai"
            disabled={isStreaming}
          />
          <Button
            type="submit"
            variant="ai"
            size="icon"
            disabled={isStreaming || input.trim().length === 0}
            aria-label="Send message"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
