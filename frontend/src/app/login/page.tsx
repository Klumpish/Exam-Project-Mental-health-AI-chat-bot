// Simple login page
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/services/authService';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);

		try {
			// Call login API
			await login({ email, password });

			console.log('Login successful');
			// Redirect to home
			router.push('/');
		} catch (err: any) {
			console.error(' Login failed:', err);
			setError(err.message || 'Login failed. Please check your credentials.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8 animate-fadeIn">
					<h1 className="text-4xl font-bold text-[var(--text)] mb-2">
						🧠 Welcome Back
					</h1>
					<p className="text-[var(--muted)]">
						Sign in to continue your wellness journey
					</p>
				</div>

				{/* Login Form */}
				<div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-xl p-8">
					<form
						onSubmit={handleLogin}
						className="space-y-6">
						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm  font-medium text-[var(--text)] mb-2">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[var(--muted)]"
								placeholder="you@example.com"
								disabled={isLoading}
							/>
						</div>

						{/* Password Field */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm  font-medium text-[var(--text)] mb-2">
								Password
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-[var(--muted)]"
								placeholder="••••••••"
								disabled={isLoading}
							/>
						</div>

						{/* Error Message */}
						{error && (
							<div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
								{error}
							</div>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-[var(--elevated)]
							disabled:text-[var(--muted)]
							disabled:cursor-not-allowed transition-colors
							flex items-center justify-center gap-2">
							{isLoading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									Signing in...
								</>
							) : (
								'Sign In'
							)}
						</button>
					</form>

					{/* Register Link */}
					<div className="mt-6 text-center">
						<p className="text-[var(--muted)]">
							Don&apos;t have an account?{' '}
							<Link href="/register">
								<span className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer">
									Sign up
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
