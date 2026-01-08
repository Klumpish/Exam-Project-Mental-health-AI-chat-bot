'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import InfoBox from '../components/InfoBox';
import CrisisBox from '@/components/CrisisBox';
import { isAuthenticated, getCurrentUser, User } from '@/services/authService';
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //check if user is logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoggedIn(true);
    }
    // const token = localStorage.getItem('authToken');
    // setIsLoggedIn(!!token); //converts to true/false
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[var(--bg)]">
        {/* Header */}
        <header className="bg-[var(--surface)] border-b border-dark-border">
          <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">
              Mental Health Support
            </h1>
            {!user ? (
              <div className="space-x-4">
                <Link href="/login">
                  <button className="px-4 py-2  rounded-lg text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
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
              <div className="flex items-center gap-4">
                <span className="text-[var(--muted)]">
                  Welcome,{' '}
                  <span className="text-[var(--text)] font-medium">
                    {user.name}
                  </span>
                </span>
                {/* TODO: should i add a logout button here? */}
                <Link href="/chat">
                  <button className="px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    Go to Chat
                  </button>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Hero section */}
        <main className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-5xl font-bold text-[var(--text)]  mb-4">
              Your Mental Health Companion
            </h2>
            <p className="text-xl text-[var(--muted)] mb-8">
              AI-powered support for your mental wellness journey
            </p>

            {/* Important disclaimer */}
            <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-8 max-w-2xl mx-auto rounded">
              <p className="text-md text-yellow-200">
                ⚠️ <strong>Important:</strong> This is not a replacement for
                professional mental health care. If you&apos;re in crisis,
                please contact emergency services or a crisis hotline
                immediately.
              </p>
            </div>

            {isLoggedIn ? (
              <div className="flex justify-center gap-4">
                <Link href="/chat">
                  <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
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
              <Link href="/chat">
                  <InfoBox
                      icon="💬"
                      title="AI Chat Support"
                      text="Talk to our empathetic AI assistant anytime you need support"
                  />
              </Link>
              <Link href={"/journal"}>
                  <InfoBox
                      icon="📓"
                      title="Daily Journaling"
                      text="Reflect on your thoughts and feelings with private journal
								entries"
                  /></Link>
              <Link href={"/mood"}>
                  <InfoBox
                      icon="📊"
                      title="Mood Tracking"
                      text="Track your mood over time and identify patterns in your
								wellbeing"
                  /></Link>
          </div>
          {/* Crisis Resources */}
          <div className="mt-16 bg-red-900/20 rounded-lg border border-red-800 p-6 max-w-2xl mx-auto">
            <CrisisBox />
          </div>
        </main>
        {/* Footer */}
        <footer className="bg-[var(--surface)] mt-16 py-8 border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 text-center text-[var(--muted)]">
            <p>
              &copy; 2025 Mental Health Chatbot. Not a substitute for
              professional care.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
