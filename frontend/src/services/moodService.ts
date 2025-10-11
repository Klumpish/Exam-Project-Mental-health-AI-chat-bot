// this service handles all mood tracking API calls to the backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Save a mood log for today
 * @param mood  rating from 1-5
 * @param notes  Optional notes about the mood
 * @returns the saved mood log
 */
export async function saveMoodLog(mood: number, notes?: string) {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/mood`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: JSON.stringify({ mood, notes }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error saving mood log:', error);
		throw error;
	}
}

/**
 * Get all mood logs for the current user
 * @returns Array of mood logs
 */
export async function getMoodLogs() {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/mood`, {
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
		console.error('Error fetching mood logs:', error);
		throw error;
	}
}

/**
 * Get mood trends for the last 30 days
 * @returns Trend data including average mood and distribution
 */
export async function getMoodTrends() {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/mood/trends`, {
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
		console.error('Error fetching mood trends:', error);
		throw error;
	}
}

/**
 * check if user has logged mood today
 * @returns Today's mood log if it exists
 */

export async function getTodaysMood() {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/mood/today`, {
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
		console.error("Error fetching today's mood:", error);
		throw error;
	}
}
