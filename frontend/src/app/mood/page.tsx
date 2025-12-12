'use client';

import MoodTracker from '@/components/MoodTracker';
import Navigation from '@/components/Navigation';
import { getMoodLogs, getMoodTrends } from '@/services/moodService';
import { useEffect, useState } from 'react';

type TrendData = {
	averageMood?: number;
	totalDays: number;
};

export default function MoodPage() {
	const [trends, setTrends] = useState<TrendData | null>(null);
	const [recentLogs, setRecentLogs] = useState([]);
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
	type MoodLevel = 1 | 2 | 3 | 4 | 5;
	const emojis: Record<MoodLevel, string> = {
		1: '😢',
		2: '😕',
		3: '😐',
		4: '🙂',
		5: '😄',
	};
	const getMoodEmoji = (mood: MoodLevel): string => {
		return emojis[mood] || '😐';
	};

	//get color for mood value
	const colors: Record<MoodLevel, string> = {
		1: 'bg-red-100 text-red-800',
		2: 'bg-orange-100 text-orange-800',
		3: 'bg-yellow-100 text-yellow-800',
		4: 'bg-green-100 text-green-800',
		5: 'bg-blue-100 text-blue-800',
	};
	const getMoodColor = (mood: MoodLevel): string => {
		return colors[mood] || 'bg-gray-100 text-gray-800';
	};

	return (
		<>
			<div className=" min-h-screen bg-[var(--bg)] p-4">
				<Navigation />
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-6">Mood Tracker</h1>

					{/* Mood logger */}
					<MoodTracker onMoodLogged={handleMoodLogged} />

					{/* Mood Trends */}
					{isLoading ? (
						<div className="mt-8 bg-white rounded-lg shadow-lg p-12">
							<div className="flex items-center justify-center">
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
									<p className="text-gray-500">Loading your mood data...</p>
								</div>
							</div>
						</div>
					) : (
						<>
							{/* Mood Trends Summary */}
							<div className="mt-8 bg-white rounded-lg shadow-lg p-6">
								<h2 className="text-2xl font-bold mb-4">📊 Your Mood Trends</h2>

								{trends && trends.totalDays > 0 ? (
									<div className="grid md:grid-cols-3 gap-6">
										{/* Average Mood */}
										<div className="text-center p-4 bg-blue-50 rounded-lg">
											<p className="text-sm text-gray-600 mb-2">Average Mood</p>
											<p className="text-4xl font-bold text-blue-600">
												{trends.averageMood?.toFixed(1) || 'N/A'}
											</p>
											<p className="text-xs text-gray-500 mt-2">Last 30 days</p>
										</div>

										{/* Total Days Logged */}
										<div className="text-center p-4 bg-green-50 rounded-lg">
											<p className="text-sm text-gray-600 mb-2">Days Logged</p>
											<p className="text-4xl font-bold text-green-600">
												{trends.totalDays}
											</p>
											<p className="text-xs text-gray-500 mt-2">
												Keep it up! 🎉
											</p>
										</div>

										{/* Current Streak */}
										<div className="text-center p-4 bg-purple-50 rounded-lg">
											<p className="text-sm text-gray-600 mb-2">Consistency</p>
											<p className="text-4xl font-bold text-purple-600">
												{Math.round((trends.totalDays / 30) * 100)}%
											</p>
											<p className="text-xs text-gray-500 mt-2">Last 30 days</p>
										</div>
									</div>
								) : (
									<div className="text-center py-8 text-gray-500">
										<p className="text-lg mb-2">📊 No mood data yet</p>
										<p>Start tracking your mood above to see trends!</p>
									</div>
								)}
							</div>

							{/* Recent Mood Logs */}
							<div className="mt-8 bg-white rounded-lg shadow-lg p-6">
								<h2 className="text-2xl font-bold mb-4">📅 Recent Mood Logs</h2>

								{recentLogs.length > 0 ? (
									<div className="space-y-3">
										{recentLogs.map((log) => (
											<div
												key={log.id}
												className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
												<div className="flex items-center gap-4">
													<span className="text-3xl">
														{getMoodEmoji(log.mood)}
													</span>
													<div>
														<p className="font-medium">
															{new Date(log.date).toLocaleDateString('en-US', {
																weekday: 'long',
																month: 'short',
																day: 'numeric',
															})}
														</p>
														{log.notes && (
															<p className="text-sm text-gray-600 mt-1">
																{log.notes}
															</p>
														)}
													</div>
												</div>
												<span
													className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(log.mood)}`}>
													{log.mood}/5
												</span>
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-8 text-gray-500">
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
	);
}
