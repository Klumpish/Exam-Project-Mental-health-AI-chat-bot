// this page allows users to write and save journal entries
// users can reflect on their thoughts and feelings
'use client';
import { getJournalEntries, saveJournalEntry } from '@/services/journalService';
import { useState, useEffect } from 'react';

type entry = {
	id: string;
	date: string | Date;
	text: string;
};

export default function JournalPage() {
	// state for the current journal entry being written
	const [entryText, setEntryText] = useState('');

	// state for all previous journal entries
	const [entries, setEntries] = useState<entry[]>([]);

	// state for laoding and saving status
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// load previous journal entries when page loads
	useEffect(() => {
		loadEntries();
	}, []);

	// function to load all journal entries from backend
	const loadEntries = async () => {
		try {
			setIsLoading(true);
			const data = await getJournalEntries();
			setEntries(data);
		} catch (error) {
			console.error('Error loading journal entries:', error);
		} finally {
			setIsLoading(false);
		}
	};

	//function to save a new journal entry
	const handleSaveEntry = async () => {
		// dont save empty entries
		if (entryText.trim() === '') {
			alert('Please write something before saving');
			return;
		}

		try {
			setIsSaving(true);

			// save entry to backend
			await saveJournalEntry(entryText);

			//clear the text area
			setEntryText('');

			//Reload entries to show the new one
			await loadEntries();

			// #TODO find better alert
			alert('Journal entry saved successfully');
		} catch (error) {
			console.error('Error saving entry:', error);
			alert('Failed to save entry. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-6">My Journal</h1>

				{/* new entry section */}
				<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">Write New Entry</h2>
					<textarea
						value={entryText}
						onChange={(e) => setEntryText(e.target.value)}
						placeholder="How are you feeling today? What's on your mind?"
						className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div className="flex justify-end mt-4">
						<button
							onClick={handleSaveEntry}
							disabled={isSaving}
							className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300">
							{isSaving ? 'Saving...' : 'Save Entry'}
						</button>
					</div>
				</div>

				{/* previous entries section */}
				<div>
					<h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
					{isLoading ? (
						<p className="text-gray-500">Loading entries...</p>
					) : entries.length === 0 ? (
						<p className="text-gray-500">
							No journal entries yet. Start writing above!
						</p>
					) : (
						<div className="space-y-4">
							{/* had to make entry a type */}
							{entries.map((entry) => (
								<div
									key={entry.id}
									className="bg-white rounded-lg shadow p-4">
									<p className="text-sm text-gray-500 mb-2">
										{new Date(entry.date).toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}
									</p>
									<p className="text-gray-800 whitespace-pre-wrap">
										{entry.text}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
