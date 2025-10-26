// Burger menu navigation component
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	const handleLogout = () => {
		localStorage.removeItem('authToken');
		router.push('/login');
	};

	const isActive = (path: string) => {
		return pathname === path
			? 'bg-blue-100 text-blue-700'
			: 'text-gray-700 hover:bg-gray-100';
	};

	return (
		<>
			{/* top navigation bar */}
			<nav className="bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<Link href="/">
							<span className="text-2xl font-bold text-blue-600 cursor-pointer">
								🧠 MindCare
							</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex space-x-4">
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
								className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
								Logout
							</button>
						</div>

						{/* Mobile Burger Button */}
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
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
					<div className="md:hidden bg-white border-t">
						<div className="px-4 py-2 space-y-2">
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
								className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
								Logout
							</button>
						</div>
					</div>
				)}
			</nav>
		</>
	);
}
