import { ButtonLink } from "../components/ui/ButtonLink";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-void px-4 text-center">
      <div>
        <p className="font-mono text-sm text-ai">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Route not found</h1>
        <p className="mt-3 text-text-secondary">The requested NEXUS module is not available.</p>
        <ButtonLink className="mt-6" to="/dashboard">
          Return to Dashboard
        </ButtonLink>
      </div>
    </main>
  );
}
