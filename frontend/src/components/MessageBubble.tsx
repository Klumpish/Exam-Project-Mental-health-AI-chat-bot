// this component displays a single message in the chat
// it styles user messages differently from AI messages

type MessageBubbleType = {
	text: string;
	sender: string;
	timestamp: Date;
};
export default function MessageBubble({
	text,
	sender,
	timestamp,
}: MessageBubbleType) {
	// different styling for user vs AI msg
	const isUser = sender === 'user';

	// format timestamp
	const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
				<p className="text-sm">{text}</p>
				<p
					className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
					{formattedTime}
				</p>
			</div>
		</div>
	);
}
