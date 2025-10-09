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

	// handle when user clicks send button or press enter
	const handleSubmit = (e) => {
		// prevent refresh on page
		e.preventDefault();

		// dont send empty
		if (inputText.trim() === '') return;

		// send msg to parent component
		onSendMessage(inputText);

		// clear the input box
		setInputText('');
	};

	// handle enter eky press (without shift for new line)
	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex gap-2">
			<textarea
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				// #TODO might wanna use on keydown
				onKeyPress={handleKeyPress}
				placeholder="Type your message here..."
				disabled={disabled}
				className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
				rows={3}
			/>

			<button
				type="submit"
				disabled={disabled || inputText.trim() === ''}
				className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
				Send
			</button>
		</form>
	);
}
