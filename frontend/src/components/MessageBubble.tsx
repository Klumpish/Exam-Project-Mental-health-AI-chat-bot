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
				className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
					isUser
						? 'bg-blue-600 text-white'
						: 'bg-[var(--elevated)] text-[var(--text)] border border-[var(--border)]'
				}`}>
				<p className="text-sm whitespace-pre-wrap">{text}</p>
				<p
					className={`text-xs mt-1 ${
						isUser ? 'text-blue-200' : 'text-[var(--muted)]'
					}`}>
					{formattedTime}
				</p>
			</div>
		</div>
	);
}
