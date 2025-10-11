// this service handles all journal related API calls to the backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * save a new journal entry
 * @param text  the journal entry text
 * @returns the saved journal entry
 */
export async function saveJournalEntry(text: string) {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/journal`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error saving journal entry:', error);
		throw error;
	}
}

/**
 * Get all journal entries for the current user
 * @returns array of journal entries
 */
export async function getJournalEntries() {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/journal`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching journal entries:', error);
		throw error;
	}
}

/**
 * Update an existing journal entry
 * @param id  the entry ID
 * @param text  the new text
 * @returns the updated entry
 */
export async function updateJournalEntry(id: number, text: string) {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/journal/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error updating journal entry:', error);
		throw error;
	}
}

/**
 * Delete a journal entry
 * @param id the entry ID to delete
 *
 */
export async function deleteJournalEntry(id: number) {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/journal/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error deleting journal entry:', error);
		throw error;
	}
}
