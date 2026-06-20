export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface StreamChatHandlers {
  onSources?: (sources: string[]) => void;
  onToken: (token: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
  signal?: AbortSignal;
}

export async function streamNexusChat(question: string, handlers: StreamChatHandlers) {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ question }),
    signal: handlers.signal,
  });

  if (!response.ok || !response.body) {
    throw new Error("NEXUS AI is unavailable right now.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const eventBlock of events) {
      const lines = eventBlock.split("\n");
      const event = lines.find((line) => line.startsWith("event: "))?.replace("event: ", "");
      const dataLine = lines.find((line) => line.startsWith("data: "))?.replace("data: ", "");

      if (!event || !dataLine) {
        continue;
      }

      const payload = JSON.parse(dataLine) as { content?: string; sources?: string[]; message?: string };

      if (event === "sources" && payload.sources) {
        handlers.onSources?.(payload.sources);
      }

      if (event === "token" && payload.content) {
        handlers.onToken(payload.content);
      }

      if (event === "error") {
        handlers.onError?.(payload.message ?? "NEXUS AI encountered an error.");
      }

      if (event === "done") {
        handlers.onDone?.();
      }
    }
  }
}

