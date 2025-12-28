'use client';

import MoodTracker from '@/components/MoodTracker';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  getMoodLogs,
  getMoodTrends,
  MoodLog,
  MoodTrends,
} from '@/services/moodService';
import { useEffect, useState } from 'react';

export default function MoodPage() {
  const [trends, setTrends] = useState<MoodTrends | null>(null);
  const [recentLogs, setRecentLogs] = useState<MoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadMoodData();
  }, [refreshKey]);

  const loadMoodData = async () => {
    try {
      setIsLoading(true);

      //load trends and recent logs
      const [trendsData, logsData] = await Promise.all([
        getMoodTrends(),
        getMoodLogs(),
      ]);

      setTrends(trendsData);
      setRecentLogs(logsData.slice(0, 7)); //last 7 days
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setIsLoading(false);
    }
  };

  //callback when mood is logged successfully
  const handleMoodLogged = () => {
    setRefreshKey((prev) => prev + 1); //trigger reload
  };

  // Get emoji for mood value
  const getMoodEmoji = (mood: number) => {
    const emojis: { [key: number]: string } = {
      1: '😢',
      2: '😕',
      3: '😐',
      4: '🙂',
      5: '😄',
    };
    return emojis[mood] || '😐';
  };

  //get color for mood value
  const getMoodColor = (mood: number) => {
    const colors: { [key: number]: string } = {
      1: 'bg-red-900/20 text-red-300 border-red-800',
      2: 'bg-orange-900/20 text-orange-300 border-orange-800',
      3: 'bg-yellow-900/20 text-yellow-300 border-yellow-800',
      4: 'bg-green-900/20 text-green-300 border-green-800',
      5: 'bg-blue-900/20 text-blue-300 border-blue-800',
    };
    return (
      colors[mood] ||
      'bg-[var(--elevated)] text-[var(--muted)] border-[var(--border)]'
    );
  };

  return (
    <ProtectedRoute>
      <>
        <div className=" min-h-screen bg-[var(--bg)] p-4">
          <Navigation />
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-6">
              Mood Tracker
            </h1>

            {/* Mood logger */}
            <MoodTracker onMoodLogged={handleMoodLogged} />

            {/* Mood Trends */}
            {isLoading ? (
              <div className="mt-8 bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-lg p-12">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-[var(--muted)]">
                      Loading your mood data...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Mood Trends Summary */}
                <div className="mt-8 bg-[var(--surface)] rounded-lg  border border-[var(--border)] shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[var(--text)] mb-4">
                    📊 Your Mood Trends
                  </h2>

                  {trends && trends.totalDays > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Average Mood */}
                      <div className="text-center p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                        <p className="text-sm text-[var(--muted)] mb-2">
                          Average Mood
                        </p>
                        <p className="text-4xl font-bold text-blue-400">
                          {trends.averageMood?.toFixed(1) || 'N/A'}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-2">
                          Last 30 days
                        </p>
                      </div>

                      {/* Total Days Logged */}
                      <div className="text-center p-4 bg-green-900/20 border border-green800 rounded-lg">
                        <p className="text-sm text-[var(--muted)] mb-2">
                          Days Logged
                        </p>
                        <p className="text-4xl font-bold text-green-400">
                          {trends.totalDays}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-2">
                          Keep it up! 🎉
                        </p>
                      </div>

                      {/* Current Streak */}
                      <div className="text-center p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
                        <p className="text-sm text-[var(--muted)] mb-2">
                          Consistency
                        </p>
                        <p className="text-4xl font-bold text-purple-400">
                          {Math.round((trends.totalDays / 30) * 100)}%
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-2">
                          Last 30 days
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--muted)]">
                      <p className="text-lg mb-2">📊 No mood data yet</p>
                      <p>Start tracking your mood above to see trends!</p>
                    </div>
                  )}
                </div>

                {/* Recent Mood Logs */}
                <div className="mt-8 bg-[var(--surface)] rounded-lg border border-[var(--border)] shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[var(--text)] mb-4">
                    📅 Recent Mood Logs
                  </h2>

                  {recentLogs.length > 0 ? (
                    <div className="space-y-3">
                      {recentLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg hover:border-blue-500 transition-all">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">
                              {getMoodEmoji(log.mood)}
                            </span>
                            <div>
                              <p className="font-medium text-[var(--text)]">
                                {new Date(log.date).toLocaleDateString(
                                  'en-US',
                                  {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                  }
                                )}
                              </p>
                              {log.note && (
                                <p className="text-sm text-[var(--muted)] mt-1">
                                  {/* #TODO: cant see notes */}
                                  {log.note}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getMoodColor(log.mood)}`}>
                            {log.mood}/5
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[var(--muted)]">
                      <p className="text-lg mb-2">📝 No mood logs yet</p>
                      <p>Log your first mood above!</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </ProtectedRoute>
  );
}
