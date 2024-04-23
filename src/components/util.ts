import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Message, Metadata } from "@/types/chat";

export const handleApiRequest = (
  question: string,
  userId: string,
  onMessage: (message: Message) => void,
  onMetadata: (metadata: Metadata[]) => void,
  onError: (error: string) => void,
  onComplete: () => void
) => {
  fetchEventSource(process.env.CHAT_API_URL || "/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, userId }),
    onmessage(event) {
      if (event.data === "DONE") {
        onComplete();
      } else if (event.event === "metadata") {
        // Parse and handle metadata
        const metadata: Metadata[] = JSON.parse(event.data);
        onMetadata(metadata);
      } else {
        // Handle LLM response
        const message: Message = {
          type: "apiMessage",
          message: event.data,
        };
        onMessage(message);
      }
    },
    onerror(error) {
      onError("An error occurred while fetching the data. Please try again.");
      console.error("Streaming error", error);
    },
    openWhenHidden: true, // Keep the connection open even when the page is in the background
  });
};