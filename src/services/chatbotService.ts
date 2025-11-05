import { supabase } from "./supabaseClient";

// Define the structure of a chunk of data we expect from the stream
interface StreamChunk {
	text?: string;
	done?: boolean;
	error?: string;
}

// Define the type for the callback function that the component will pass in
type OnChunkCallback = (chunk: StreamChunk) => void;

class ChatbotService {
	/**
	 * Calls the RAG backend and streams the response.
	 * @param query The user's question.
	 * @param onChunk A callback function that will be called for each chunk of data received.
	 * @param onError A callback function to handle fetch/network errors.
	 */
	async streamChat(
		query: string,
		onChunk: OnChunkCallback,
		onError: (error: Error) => void
	) {
		try {
			const {
				data: { session },
				error: sessionError,
			} = await supabase.auth.getSession();

			if (sessionError || !session) {
				throw new Error("You must be logged in to chat.");
			}

			const token = session.access_token;
			// Get the API URL from environment variables
			const API_URL =
				import.meta.env.VITE_API_URL || "http://localhost:5000";

			const response = await fetch(`${API_URL}/api/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ query }),
			});

			if (!response.ok) {
				throw new Error(
					`API error: ${response.status} ${response.statusText}`
				);
			}

			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error("Failed to get stream reader.");
			}

			const decoder = new TextDecoder();
			let buffer = "";

			// Read the stream
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					// Send a final 'done' chunk
					onChunk({ done: true });
					break;
				}

				// Add the new chunk to our buffer
				buffer += decoder.decode(value, { stream: true });

				// Process all complete "data: ..." lines
				const lines = buffer.split("\n\n");
				buffer = lines.pop() || ""; // Keep any incomplete line for the next chunk

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						const data = line.substring(6);
						try {
							const json: StreamChunk = JSON.parse(data);
							// Pass the parsed JSON chunk to the component's callback
							onChunk(json);
							if (json.done || json.error) {
								return; // Stream finished or errored
							}
						} catch (e) {
							console.error("Stream parse error:", e);
							// Pass an error chunk
							onChunk({ error: "Failed to parse stream data." });
						}
					}
				}
			}
		} catch (error: any) {
			console.error("Failed to send message:", error);
			onError(error);
		}
	}
}

const chatbotService = new ChatbotService();
export default chatbotService;
