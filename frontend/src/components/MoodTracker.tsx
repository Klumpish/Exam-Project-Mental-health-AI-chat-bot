// this component allows users to log their daily mood
// users select a mood from 1(very bad) to 5 (very good)

import { saveMoodLog } from '@/services/moodService';
import { useState } from 'react';

interface MoodTrackerProps {
	onMoodLogged?: () => void;
}

interface moodOptiton {
	value: number;
	emoji: string;
	label: string;
}

export default function MoodTracker({ onMoodLogged }: MoodTrackerProps) {
	// state for selecting mood (1-5)
	const [selectedMood, setSelectedMood] = useState<number | null>(null);
	const [notes, setNotes] = useState<string>('');
	const [successMessage, setSuccessMessage] = useState<string>('');
	// state for saving status
	const [isSaving, setIsSaving] = useState<boolean>(false);

	// mood options with emojis
	const moodOptitons: moodOptiton[] = [
		{ value: 1, emoji: '😢', label: 'Very Bad' },
		{ value: 2, emoji: '😕', label: 'Bad' },
		{ value: 3, emoji: '😐', label: 'Okey' },
		{ value: 4, emoji: '🙂', label: 'Good' },
		{ value: 5, emoji: '😄', label: 'Great' },
	];

	// func to save mood to backend
	const handleSaveMood = async () => {
		if (!selectedMood) {
			alert('Please select a mood first');
			return;
		}

		try {
			setIsSaving(true);

			// save mood with notes (even if empty)
			await saveMoodLog(selectedMood, notes.trim() || undefined);

			setSuccessMessage('Mood Logged successfully');

			// reset selection
			setSelectedMood(null);
			setNotes('');

			//notify parent component
			if (onMoodLogged) {
				onMoodLogged();
			}

			//clearn success message
			setTimeout(() => setSuccessMessage(''), 4000);
		} catch (error) {
			console.error('Error saving mood:', error);
			alert('Failed to save mood. Please try again');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-lg p-6">
			<h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>

			{successMessage && (
				<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
					{successMessage}
				</div>
			)}
			{/* Mood selection buttons */}
			<div className="flex justify-between mb-6">
				{moodOptitons.map((mood) => (
					<button
						key={mood.value}
						onClick={() => setSelectedMood(mood.value)}
						className={`flex flex-col items-center p-4 rounded-lg transition-all ${
							selectedMood === mood.value
								? 'bg-blue-500 text-white scale-110'
								: 'bg-gray-100 hover:bg-gray-200'
						}`}>
						<span className="text-4xl mb-2">{mood.emoji}</span>
						<span className="text-sm">{mood.label}</span>
					</button>
				))}
			</div>

			{/* Optional notes */}
			{selectedMood && (
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Add a note (optional)
					</label>
					<textarea
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="What's contributing to your mood today?"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={3}
						maxLength={500}
					/>
					<p className="text-xs text-gray-500 mt-1">
						{notes.length}/500 characters
					</p>
				</div>
			)}

			{/* save button */}
			<button
				onClick={handleSaveMood}
				disabled={!selectedMood || isSaving}
				className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
				{isSaving ? (
					<>
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
						Saving...
					</>
				) : (
					'Log Mood'
				)}
			</button>
		</div>
	);
}
