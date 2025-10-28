// this should be the main chat page where users interact with the AI
// should handle sending msg, receiving responses and displaying the conversation
'use client';
import Chatbox from '@/components/Chatbox';
import MessageBubble from '@/components/MessageBubble';
import Navigation from '@/components/Navigation';
import { sendMessageToAI } from '@/services/chatService';
import { timeStamp } from 'console';
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
			<Navigation />
			<div className="min-h-screen bg-gray-50  p-4">
				{/* <div className="min-h-screen bg-gray-50 p-4"> */}
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold md-4">Chat with AI Support</h1>

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
						{messages.map((message, index) => (
							<MessageBubble
								key={index}
								text={message.text}
								sender={message.sender}
								timestamp={message.timestamp}
							/>
						))}
						{isLoading && (
							<div className="text-gray-500-italic">AI is typing...</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* box for typing msg */}
					<Chatbox
						onSendMessage={handleSendMessage}
						disabled={isLoading}
					/>
				</div>
			</div>
		</>
	);
}
