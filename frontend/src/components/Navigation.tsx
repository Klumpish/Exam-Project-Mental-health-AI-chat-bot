// Burger menu navigation component
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout, getCurrentUser, User } from '../services/authService';

export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		//Load current user on mount
		const currentUser = getCurrentUser();
		setUser(currentUser);
	}, []);

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	const isActive = (path: string) => {
		return pathname === path
			? 'bg-blue-600 text-white'
			: 'text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]';
	};

	return (
		<>
			{/* top navigation bar */}
			<nav className="bg-[var(--surface)] border-b border-[var(--border)]">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<Link href="/">
							<span className="text-2xl font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors">
								🧠 MindCare
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex items-center space-x-4">
							{/* User greeting */}
							{user && (
								<span className="text-[var(--muted)] text-lg">
									Hello,{' '}
									<span className="text-[var(--text)] font-medium">
										{user.name}
									</span>
								</span>
							)}
							<Link href="/chat">
								<span
									className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${isActive('/chat')}`}>
									💬 Chat
								</span>
							</Link>
							<Link href="/journal">
								<span
									className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${isActive('/journal')}`}>
									📓 Journal
								</span>
							</Link>
							<Link href="/mood">
								<span
									className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${isActive('/mood')}`}>
									😊 Mood
								</span>
							</Link>
							<button
								onClick={handleLogout}
								className="px-0 py-0 rounded-lg">
								<span className="px-4 py-2 rounded-lg cursor-pointer transition-colors text-red-400 hover:bg-red-900/20">
									🛑 Logout
								</span>
							</button>
						</div>

						{/* Mobile Burger Button */}
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="md:hidden p-2 rounded-lg hover:bg-[var(--elevated)] transition-colors text-[var(--text)]">
							{isOpen ? (
								// X icon when menu is open
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								// Hamburger icon when menu is closed
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="md:hidden bg-[var(--surface)] border-t border-[var(--border)]">
						<div className="px-4 py-2 space-y-2">
							{/* user greeting mobile */}
							{user && (
								<div className="px-4 py-2 text-[var(--muted)] text-m border-b border-[var(--border)] mb-2 ">
									Hello,{' '}
									<span className="text-[var(--text)] font-medium">
										{user.name}
									</span>
								</div>
							)}

							<Link href="/chat">
								<div
									className={`block px-4 py-3 rounded-lg cursor-pointer ${isActive('/chat')}`}
									onClick={() => setIsOpen(false)}>
									💬 Chat
								</div>
							</Link>
							<Link href="/journal">
								<div
									className={`block px-4 py-3 rounded-lg cursor-pointer ${isActive('/journal')}`}
									onClick={() => setIsOpen(false)}>
									📓 Journal
								</div>
							</Link>
							<Link href="/mood">
								<div
									className={`block px-4 py-3 rounded-lg cursor-pointer ${isActive('/mood')}`}
									onClick={() => setIsOpen(false)}>
									😊 Mood Tracker
								</div>
							</Link>
							<button
								onClick={() => {
									handleLogout();
									setIsOpen(false);
								}}
								className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg">
								Logout
							</button>
						</div>
					</div>
				)}
			</nav>
		</>
	);
}
