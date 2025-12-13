// this should be the main chat page where users interact with the AI
// should handle sending msg, receiving responses and displaying the conversation
'use client';
import Chatbox from '@/components/Chatbox';
import MessageBubble from '@/components/MessageBubble';
import Navigation from '@/components/Navigation';
import {
	ChatMessage,
	getChatHistory,
	sendMessageToAI,
} from '@/services/chatService';
import { error, timeStamp } from 'console';
import { useState, useEffect, useRef } from 'react';

type Message = {
	text: string;
	sender: 'user' | 'ai';
	timestamp: Date;
};
export default function ChatPage() {
	// state to store all msg in convo
	const [messages, setMessages] = useState<Message[]>([]);

	// state to track if we are waiting for AI response
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingHistory, setIsLoadingHistory] = useState(true);
	const [historyError, setHistoryError] = useState<string | null>(null);

	// reference to scroll to bottom of chat when new msg arrive
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// func to scroll to the bottom of the chat
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// scroll to bottom w/e msg change
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		loadChatHistory();
	}, []);

	// func to load previous chat history
	const loadChatHistory = async () => {
		try {
			setIsLoadingHistory(true);
			setHistoryError(null);
			console.log('Loading chat history...');
			const history = await getChatHistory();

			//backend format to frontend format
			const formattedMessages: Message[] = history.map((msg: ChatMessage) => ({
				text: msg.text,
				sender: msg.sender,
				timestamp: new Date(msg.timestamp),
			}));

			setMessages(formattedMessages);
			console.log(`loaded ${formattedMessages.length} messages`);
		} catch (error) {
			console.error('Error loading chat history: ', error);
			setHistoryError(
				'Failed to load chat hisotry. Starting with a fresh chat.'
			);
			//start with empty chat
			setMessages([]);
		} finally {
			setIsLoadingHistory(false);
		}
	};

	//func that handles user sending msg
	const handleSendMessage = async (messageText: string) => {
		// add user msg to chat
		const userMessage: Message = {
			text: messageText,
			sender: 'user',
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			// send msg to backend and wait for AI response
			const aiResponse = await sendMessageToAI(messageText);

			// add AI's response to chat

			const aiMessage: Message = {
				text: aiResponse.text,
				sender: 'ai',
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error('Error getting AI response:', error);
			// show error msg to user
			const errorMessage: Message = {
				text: 'Sorry, I had trouble connecting, Please try again.',
				sender: 'ai',
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="min-h-screen bg-[var(--bg)]  p-4">
				<Navigation />
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-4">
						<h1 className="text-3xl font-bold md-4 text-[var(--text)]">
							Chat with AI Support
						</h1>
						{/* Clear History Button */}
						{messages.length > 0 && (
							<button
								onClick={() => {
									if (confirm('Are you sure you want to clear this chat?')) {
										setMessages([]);
									}
								}}
								className="text-sm text-red-400 hover:text-red-300 transition-colors">
								Clear Chat
							</button>
						)}
					</div>

					{/* Disclaimer msg important! */}
					{/* #TODO check the ' in "if you're" */}
					<div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-4 rounded">
						<p className="text-md text-blue-200">
							This Chatbot is not a replacement for professional mental health
							support. If you&apos;re in crisis, please contact emergency
							services or a crisis hotline.
						</p>
					</div>
					{/* History error warning */}
					{historyError && (
						<div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-4 rounded">
							<p className="text-sm text-yellow-200">⚠️ {historyError}</p>
						</div>
					)}

					{/* msg container */}
					<div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4 h-96 overflow-y-auto mb-4">
						{isLoadingHistory ? (
							// Loading state
							<div className="flex items-center justify-center h-full">
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
									<p className="text-[var(--muted)]">Loading chat history...</p>
									<button
										onClick={() => {
											setIsLoadingHistory(false);
											setMessages([]);
										}}
										className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline">
										Skip and start fresh
									</button>
								</div>
							</div>
						) : messages.length === 0 ? (
							// Empty state
							<div className="flex items-center justify-center h-full">
								<div className="text-center text-[var(--muted)]">
									<p className="text-lg mb-2">👋 Welcome!</p>
									<p>Start a conversation by typing a message below.</p>
								</div>
							</div>
						) : (
							// Messages
							<>
								{messages.map((message, index) => (
									<MessageBubble
										key={index}
										text={message.text}
										sender={message.sender}
										timestamp={message.timestamp}
									/>
								))}

								{/* Loading indicator while AI is thinking */}
								{isLoading && (
									<div className="flex mb-4">
										<div className="bg-[var(--elevated)] rounded-lg px-4 py-3">
											<div className="flex space-x-2">
												<div className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce"></div>
												<div
													className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce"
													style={{ animationDelay: '0.1s' }}></div>
												<div
													className="w-2 h-2 bg-[var(--muted)] rounded-full animate-bounce"
													style={{ animationDelay: '0.2s' }}></div>
											</div>
										</div>
									</div>
								)}

								<div ref={messagesEndRef} />
							</>
						)}
					</div>

					{/* box for typing msg */}
					<Chatbox
						onSendMessage={handleSendMessage}
						disabled={isLoading || isLoadingHistory}
					/>
				</div>
			</div>
		</>
	);
}
