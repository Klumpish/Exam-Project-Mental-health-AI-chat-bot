'use client';
import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	//check if user is logged in
	useEffect(() => {
		const token = localStorage.getItem('authToken');
		setIsLoggedIn(!!token); //converts to true/false
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-600 to-white">
			{/* Header */}
			<header className="bg-pink-200 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
					<h1 className="text-2xl font-bold text-blue-600">
						Mental Health Support
					</h1>
					{!isLoggedIn ? (
						<div className="space-x-4">
							<Link href="/login">
								<button className="px-4 py-2 bg-white rounded-lg text-blue-600 hover:text-blue-800 cursor-pointer">
									Login
								</button>
							</Link>
							<Link href="/register">
								<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
									Sign Up
								</button>
							</Link>
						</div>
					) : (
						<button
							onClick={() => {
								localStorage.removeItem('authToken');
								setIsLoggedIn(false);
								router.push('/');
							}}
							className="px-4 py-2 text-red-600 hover:text-red-800">
							Logout
						</button>
					)}
				</div>
			</header>

			{/* Hero section */}
			<main className="max-w-7xl mx-auto px-4 py-16">
				<div className="text-center mb-12">
					<h2 className="text-5xl font-bold text-gray-900 mb-4">
						Your Mental Health Companion
					</h2>
					<p className="text-xl text-gray-600 mb-8">
						AI-powered support for your mental wellness journey
					</p>

					{/* Important disclaimer */}
					<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 max-w-2xl mx-auto">
						<p className="text-sm text-yellow-800">
							⚠️ <strong>Important:</strong> This is not a replacement for
							professional mental health care. If you&apos;re in crisis, please
							contact emergency services or a crisis hotline immediately.
						</p>
					</div>

					{isLoggedIn ? (
						<div className="flex justify-center gap-4">
							<Link href="/chat">
								<button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
									Start Chat
								</button>
							</Link>
						</div>
					) : (
						<Link href="/login">
							<button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
								Get Started
							</button>
						</Link>
					)}
				</div>

				{/* Features grid */}
				<div className="grid md:grid-cols-3 gap-8 mt-16">
					<div className="bg-white p-6 rounded-lg shadow-md">
						<div className="text-4xl mb-4">💬</div>
						<h3 className="text-xl font-semibold mb-2">AI Chat Support</h3>
						<p className="text-gray-600">
							Talk to our empathetic AI assistant anytime you need support
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-md">
						<div className="text-4xl mb-4">📓</div>
						<h3 className="text-xl font-semibold mb-2">Daily Journaling</h3>
						<p className="text-gray-600">
							Reflect on your thoughts and feelings with private journal entries
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-md">
						<div className="text-4xl mb-4">📊</div>
						<h3 className="text-xl font-semibold mb-2">Mood Tracking</h3>
						<p className="text-gray-600">
							Track your mood over time and identify patterns in your wellbeing
						</p>
					</div>
				</div>
				{/* Crisis Resources */}
				<div className="mt-16 bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
					<h3 className="text-xl font-bold text-red-900 mb-4">
						⚠️ Need Immediate Help?
					</h3>
					<ul className="space-y-2 text-red-800">
						<li>
							🇪🇺 Emergency Services (EU & Sweden): <strong>112</strong> — Dial
							for immediate help
						</li>
						<li>
							🇸🇪 Suicide Zero (Sweden): <strong>90 101 101</strong> or visit{' '}
							<a
								href="https://suicidezero.se"
								className="underline"
								target="_blank"
								rel="noopener noreferrer">
								suicidezero.se
							</a>
						</li>
						<li>
							🇬🇧 The Samaritans (UK & Ireland): Call <strong>116 123</strong> or
							visit{' '}
							<a
								href="https://www.samaritans.org"
								className="underline"
								target="_blank"
								rel="noopener noreferrer">
								samaritans.org
							</a>
						</li>
						<li>
							🌍 International:{' '}
							<a
								href="https://www.iasp.info/resources/Crisis_Centres/"
								className="underline"
								target="_blank"
								rel="noopener noreferrer">
								Find Your Local Hotline
							</a>
						</li>
					</ul>
					<p className="mt-4 text-red-900 font-medium">
						You don’t have to face this alone. Professional help is available
						24/7.
					</p>
				</div>
			</main>
			{/* Footer */}
			<footer className="bg-gray-100 mt-16 py-8">
				<div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
					<p>
						&copy; 2025 Mental Health Chatbot. Not a substitute for professional
						care.
					</p>
				</div>
			</footer>
		</div>
	);
}
