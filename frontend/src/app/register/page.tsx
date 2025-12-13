'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// validation
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		setIsLoading(true);

		try {
			//TODO: in dev skip real registration for now
			const dummyToken = 'temp-token-' + Date.now();
			localStorage.setItem('authToken', dummyToken);

			//Redirect to chat
			router.push('/chat');
		} catch (err) {
			setError('Registration failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8 animate-fadeIn">
					{/* TODO: keep the icon or not?, i like it */}
					<h1 className="text-4xl font-bold text-[var(--text)] mb-2">
						{' '}
						🧠 Join Us
					</h1>
					<p className="text-[var(--muted)]">
						Create your account to get started
					</p>
				</div>

				{/* Registration Form */}
				<div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-lg p-8">
					<form
						onSubmit={handleRegister}
						className="space-y-6">
						{/* Name field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-[var(--text)] mb-2">
								Full Name
							</label>
							<input
								id="name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
								placeholder-[var(--muted)]"
								placeholder="Jenny Doe"
							/>
						</div>

						{/* Email field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-[var(--text)] mb-2">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
								placeholder-[var(--muted)]"
								placeholder="you@example.com"
							/>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-[var(--text)] mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
								placeholder-[var(--muted)]"
								placeholder="••••••••"
							/>
						</div>
						{/* Confirm Password Field */}
						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-[var(--text)] mb-2">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
								placeholder-[var(--muted)]"
								placeholder="••••••••"
							/>
						</div>
						{/* Error Message */}
						{error && (
							<div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
								{error}
							</div>
						)}

						{/* Temporary Notice */}
						<div className="bg-yellow-900/20 border border-yellow-800 text-yellow-200 px-4 py-3 rounded-lg text-md">
							ℹ️ <strong>Development Mode:</strong> Registration is simplified
							for testing
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-[var(--elevated)]
							disabled:text-[var(--muted)] disabled:cursor-not-allowed transition-colors">
							{isLoading ? 'Creating account...' : 'Create Account'}
						</button>
					</form>
					{/* Login Link */}
					<div className="mt-6 text-center">
						<p className="text-[var(--muted)]">
							Already have an account?{' '}
							<Link href="/login">
								<span className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors">
									Sign in
								</span>
							</Link>
						</p>
					</div>
				</div>
				{/* Back to Home */}
				<div className="text-center mt-6">
					<Link href="/">
						<span className="text-[var(--muted)] hover:text-[var(--text)] cursor-pointer transition-colors">
							← Back to home
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
