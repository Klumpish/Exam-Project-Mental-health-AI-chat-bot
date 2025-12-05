// this page allows users to write and save journal entries
// users can reflect on their thoughts and feelings
'use client';
import Navigation from '@/components/Navigation';
import {
	deleteJournalEntry,
	getJournalEntries,
	saveJournalEntry,
} from '@/services/journalService';
import { useState, useEffect } from 'react';

type entry = {
	id: number;
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

	const [error, setError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// load previous journal entries when page loads
	useEffect(() => {
		loadEntries();
	}, []);

	// auto-clear success message after 3 seconds
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(''), 4000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	// func to load all journal entries from backend
	const loadEntries = async () => {
		try {
			setIsLoading(true);
			setError('');
			const data = await getJournalEntries();
			setEntries(data);
		} catch (error) {
			console.error('Error loading journal entries:', error);
			setError('Failed to load journal entries. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	//func to save a new journal entry
	const handleSaveEntry = async () => {
		// dont save empty entries
		if (entryText.trim() === '') {
			setError('Please write something before saving');
			return;
		}

		try {
			setIsSaving(true);
			setError('');

			// save entry to backend
			await saveJournalEntry(entryText);

			//clear the text area
			setEntryText('');

			//Reload entries to show the new one
			await loadEntries();

			setSuccessMessage('Journal entry saved successfully');
		} catch (error) {
			console.error('Error saving entry:', error);
			setError('Failed to save entry. Please try again.');
		} finally {
			setIsSaving(false);
		}
	};
	//delete an entry
	const handleDeleteEntry = async (id: number) => {
		if (!confirm('Are you sure you want to delete this entry?')) {
			return;
		}

		try {
			await deleteJournalEntry(id);
			setSuccessMessage('Entry deleted Successfully');
			await loadEntries();
		} catch (error) {
			console.error('Error deleting entry:', error);
			setError('Failed to delete entry. Please try again.');
		}
	};

	return (
		<>
			<div className="min-h-screen bg-gray-50 p-4">
				<Navigation />

				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold my-6">My Journal</h1>
					{/* Success Message */}
					{successMessage && (
						<div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
							{successMessage}
						</div>
					)}
					{/* Error message */}
					{error && (
						<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
							{error}
						</div>
					)}

					{/* new entry section */}
					<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
						<h2 className="text-xl font-semibold mb-4">Write New Entry</h2>
						<p className="text-sm text-gray-600 mb-4">
							{new Date().toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
						<textarea
							value={entryText}
							onChange={(e) => {
								setEntryText(e.target.value);
								setError(''); // clear error when user types
							}}
							placeholder="How are you feeling today? What's on your mind?"
							className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<div className="flex justify-between items-center mt-4">
							<p className="text-sm text-gray-500">
								{entryText.length} characters
							</p>
							<button
								onClick={handleSaveEntry}
								disabled={isSaving || entryText.trim() === ''}
								className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300">
								{isSaving ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										Saving...
									</>
								) : (
									'Save Entry'
								)}
							</button>
						</div>
					</div>

					{/* previous entries section */}
					<div>
						<h2 className="text-xl font-semibold mb-4">Previous Entries</h2>
						{isLoading ? (
							//loading state
							<div className="flex items-center justify-center py-12">
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
									<p className="text-gray-500">Loading entries...</p>
								</div>
							</div>
						) : entries.length === 0 ? (
							//Empty state
							<div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
								<p className="text-lg mb-2">No journal entries yet</p>
								<p>Start writing above to create your first entry!</p>
							</div>
						) : (
							//entries list
							<div className="space-y-4">
								{entries.map((entry) => (
									<div
										key={entry.id}
										className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
										<div className="flex justify-between items-start mb-3">
											<p className="text-sm text-gray-500 mb-2">
												{new Date(entry.date).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</p>
											<button
												onClick={() => handleDeleteEntry(entry.id)}
												className="text-red-500 hover:text-red-700 text-sm">
												{' '}
												🗑️ Delete
											</button>
										</div>
										<p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
											{entry.text}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
