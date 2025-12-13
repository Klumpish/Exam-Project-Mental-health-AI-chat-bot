// this component is for the input box where users type their msg
// it handles input field and send button

import { FC, useState } from 'react';

type Chatboxprops = {
	onSendMessage: (message: string) => Promise<void>;
	disabled?: boolean;
};

export default function Chatbox({ onSendMessage, disabled }: Chatboxprops) {
	// state to track what user is typing
	const [inputText, setInputText] = useState('');

	// send msg to parent component
	const submitMessage = () => {
		// no empty msg
		if (inputText.trim() === '') return;

		onSendMessage(inputText);
		// clear input box
		setInputText('');
	};

	// handle when user clicks send button
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		submitMessage();
	};

	// handle enter key press (without shift for new line)
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submitMessage();
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex gap-2">
			<textarea
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Type your message here..."
				disabled={disabled}
				className="flex-1 p-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[var(--muted)]
				disabled:opacity-50"
				rows={3}
			/>

			<button
				type="submit"
				disabled={disabled || inputText.trim() === ''}
				className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-[var(--elevated)] disabled:cursor-not-allowed transition-colors">
				Send
			</button>
		</form>
	);
}
