// this should be the main chat page where users interact with the AI
// should handle sending msg, receiving responses and displaying the conversation
'use client';
import Chatbox from '@/components/Chatbox';
import MessageBubble from '@/components/MessageBubble';
import Navigation from '@/components/Navigation';
import { getChatHistory, sendMessageToAI } from '@/services/chatService';
import { error, timeStamp } from 'console';
import { useState, useEffect, useRef } from 'react';

export default function ChatPage() {
	// type for message objects
	type Message = {
		text: string;
		sender: string;
		timestamp: Date;
	};

	// state to store all msg in convo
	const [messages, setMessages] = useState<Message[]>([]);

	// state to track if we are waiting for AI response
	const [isLoading, setIsLoading] = useState(false);

	const [isLoadingHistory, setIsLoadingHistory] = useState(true);

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

	// func to load previous chat history
	const loadChatHistory = async () => {
		try {
			setIsLoadingHistory(true);
			console.log('Loading chat history...');

			const history = await getChatHistory();

			//backend format to frontend format
			const formattedMessages: Message[] = history.map((msg: Message) => ({
				text: msg.text,
				sender: msg.sender,
				timestamp: new Date(msg.timestamp),
			}));

			setMessages(formattedMessages);
			console.log(`loaded ${formattedMessages.length} messages`);
		} catch (error) {
			console.error('Error loading chat history: ', error);
			//dont show error to user, just start with empty chat
		} finally {
			setIsLoadingHistory(false);
		}
	};

	//func that handles user sending msg
	const handleSendMessage = async (messageText: string) => {
		// add user msg to chat
		const userMessage = {
			text: messageText,
			sender: 'user',
			timestamp: new Date(),
		};

		setMessages([...messages, userMessage]);
		setIsLoading(true);

		try {
			// send msg to backend and wait for AI response
			const aiResponse = await sendMessageToAI(messageText);

			// add AI's response to chat

			const aiMessage = {
				text: aiResponse.text,
				sender: 'ai',
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, aiMessage]);
		} catch (error) {
			console.error('Error getting AI response:', error);
			// show error msg to user
			const errorMessage = {
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
			<div className="min-h-screen bg-gray-50  p-4">
				<Navigation />
				<div className="max-w-4xl mx-auto">
					<div className="flex justify-between items-center mb-4">
						<h1 className="text-3xl font-bold md-4">Chat with AI Support</h1>
						{/* Clear History Button */}
						{messages.length > 0 && (
							<button
								onClick={() => {
									if (confirm('Are you sure you want to clear this chat?')) {
										setMessages([]);
									}
								}}
								className="text-sm text-red-600 hover:text-red-800">
								Clear Chat
							</button>
						)}
					</div>

					{/* Disclaimer msg important! */}
					{/* #TODO check the ' in "if you're" */}
					<div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
						<p className="text-sm">
							This Chatbot is not a replacement for professional mental health
							support. If you&apos;re in crisis, please contact emergency
							services or a crisis hotline.
						</p>
					</div>

					{/* msg container */}
					<div className="bg-white rounded-lg shadow-lg p-4 h-96 overflow-y-auto mb-4">
						{isLoadingHistory ? (
							// Loading state
							<div className="flex items-center justify-center h-full">
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
									<p className="text-gray-500">Loading chat history...</p>
								</div>
							</div>
						) : messages.length === 0 ? (
							// Empty state
							<div className="flex items-center justify-center h-full">
								<div className="text-center text-gray-500">
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
										<div className="bg-gray-200 rounded-lg px-4 py-3">
											<div className="flex space-x-2">
												<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
												<div
													className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
													style={{ animationDelay: '0.1s' }}></div>
												<div
													className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
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
