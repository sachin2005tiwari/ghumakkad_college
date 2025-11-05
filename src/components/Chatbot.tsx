import React, { useEffect, useRef, useState } from "react";
import chatbotService from "../services/chatbotService";

// Define types for a chat message
interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

const Chatbot: React.FC = () => {
	// State for UI management
	const [isChatOpen, setIsChatOpen] = useState(false);

	// State for chat history
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			role: "assistant",
			content:
				"Hello! I'm Pixie, your travel assistant. Ask me anything about our destinations!",
		},
	]);

	// State for user input and simulated loading
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	// Ref to scroll to the bottom of the chat
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Scroll to bottom whenever messages update
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// --- UPDATED: Handle the streaming API call via the service ---
	const sendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessageContent = input.trim();
		const userMessage: ChatMessage = {
			role: "user",
			content: userMessageContent,
		};

		// 1. Add the user's message AND an empty bot message to the state
		setMessages((prev) => [
			...prev,
			userMessage,
			{ role: "assistant", content: "" }, // Empty placeholder for the stream
		]);

		setIsLoading(true);
		setInput("");

		// 2. Define the callbacks for the service
		const onChunk = (chunk: {
			text?: string;
			done?: boolean;
			error?: string;
		}) => {
			if (chunk.text) {
				// Append the new text chunk to the *last* message
				setMessages((prev) =>
					prev.map((msg, index) =>
						index === prev.length - 1
							? {
									...msg,
									content: msg.content + chunk.text,
							  }
							: msg
					)
				);
			}
			if (chunk.done) {
				setIsLoading(false); // Re-enable input
			}
			if (chunk.error) {
				// Set the last bot message to an error state
				setMessages((prev) =>
					prev.map((msg, index) =>
						index === prev.length - 1
							? {
									...msg,
									content: `Aiyoo! 😭 Something went wrong: ${chunk.error}`,
							  }
							: msg
					)
				);
				setIsLoading(false);
			}
		};

		const onError = (error: Error) => {
			// Handle network/fetch errors
			setMessages((prev) =>
				prev.map((msg, index) =>
					index === prev.length - 1
						? {
								...msg,
								content: `Aiyoo! 😭 Something went wrong: ${error.message}`,
						  }
						: msg
				)
			);
			setIsLoading(false); // Re-enable input
		};

		// 3. Call the service
		await chatbotService.streamChat(userMessageContent, onChunk, onError);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};

	return (
		<>
			{/* 1. Chat Window */}
			<div
				className={`fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl transition-transform duration-300 transform ${
					isChatOpen
						? "translate-y-0 opacity-100"
						: "translate-y-4 opacity-0 pointer-events-none"
				} flex flex-col z-50`}
			>
				<div className="bg-brand-secondary text-white p-3 rounded-t-lg flex justify-between items-center">
					<h3 className="font-bold">Pixie</h3>
					<button
						onClick={() => setIsChatOpen(false)}
						className="text-white hover:text-gray-300 text-xl font-bold"
					>
						&times;
					</button>
				</div>

				{/* Chat Messages Area */}
				<div className="flex-grow p-3 overflow-y-auto text-sm text-gray-700 space-y-3">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`flex ${
								msg.role === "user"
									? "justify-end"
									: "justify-start"
							}`}
						>
							<p
								className={`p-2 rounded-lg max-w-[85%] ${
									msg.role === "user"
										? "bg-brand-primary text-white"
										: "bg-gray-200 text-gray-700"
								}`}
							>
								{msg.content}
							</p>
						</div>
					))}
					{isLoading &&
						messages[messages.length - 1]?.role === "assistant" &&
						messages[messages.length - 1]?.content === "" && (
							<div className="flex justify-start">
								<p className="bg-gray-200 p-2 rounded-lg text-gray-500">
									Pixie is typing...
								</p>
							</div>
						)}
					<div ref={messagesEndRef} />
				</div>

				{/* Input Field with Send Button and Icon */}
				<div className="p-3 border-t flex">
					<input
						type="text"
						placeholder="Ask a question..."
						className="w-full p-2 border rounded-l-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={handleKeyPress}
                        disabled={isLoading}
						title="Send Message"
					/>
					<button
						onClick={sendMessage}
						className="bg-brand-secondary text-white p-2 rounded-r-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center"
						disabled={isLoading}
						title="Send Message"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
								transform="rotate(90 12 12)"
							/>
						</svg>
					</button>
				</div>
			</div>

			<button
				onClick={() => setIsChatOpen(!isChatOpen)}
				className="fixed bottom-4 right-4 bg-brand-primary text-white p-4 rounded-full shadow-xl hover:bg-brand-secondary transition duration-200 focus:outline-none focus:ring-4 focus:ring-brand-primary/50 z-50 flex items-center justify-center text-sm font-bold"
				title="Pixie Chatbot"
			>
				{/* Message Icon SVG */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.649A9.995 9.995 0 013 12C3 7.582 7.03 4 12 4s9 3.582 9 8z"
					/>
				</svg>
			</button>
		</>
	);
};

export default Chatbot;
