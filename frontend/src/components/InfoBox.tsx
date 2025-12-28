interface ChatboxProps {
	icon: string;
	title: string;
	text: string;
}

export default function InfoBox({ icon, title, text }: ChatboxProps) {
	return (
		<div className="bg-[var(--surface)] p-6 rounded-lg border border-[var(--border)] hover:border-blue-500 transition-all shadow-md">
			<div className="text-4xl mb-4">{icon}</div>
			<h3 className="text-xl font-semibold mb-2 text-[var(--text)]">{title}</h3>
			<p className="text-[var(--muted)]">{text}</p>
		</div>
	);
}
