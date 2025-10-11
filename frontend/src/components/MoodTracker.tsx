// this component allows users to log their daily mood
// users select a mood from 1(very bad) to 5 (very good)

import { useState } from 'react';

export default function MoodTracker() {
	// state for selecting mood (1-5)
	// TODO checkback if
	const [selectedMood, setSelectedMood] = useState<number | null>(null);

	// state for saving status
	const [isSaving, setIsSaving] = useState(false);

	// mood options with emojis
	// TODO find better emojis
	const moodOptitons = [
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

			// save mood to backend
			await saveMoodLog(selectedMood);

			alert('Mood Logged successfully');

			// reset selection
			setSelectedMood(null);
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

			{/* Mood selection buttons */}
			<div className="flex justify-between mb-6">
				{moodOptitons.map((mood) => (
					<button
						key={mood.value}
						onClick={() => setSelectedMood(mood.value)}
						className={`flex flex-col items-center p-4 rounded-lg transition-all ${selectedMood === mood.value ? 'bg-blue-500 text-white scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}>
						<span className="text-4xl mb-2">{mood.emoji}</span>
						<span className="text-sm">{mood.label}</span>
					</button>
				))}
			</div>

			{/* save button */}
			<button
				onClick={handleSaveMood}
				disabled={!selectedMood || isSaving}
				className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
				{isSaving ? 'Saving...' : 'Log Mood'}
			</button>
		</div>
	);
}
