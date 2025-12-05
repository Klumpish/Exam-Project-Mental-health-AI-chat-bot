// this service handles all communication with the backend API
// it sends msg and receives responses

// get backend URL from env variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ChatMessage {
	id?: number;
	text: string;
	sender: 'user' | 'ai';
	timestamp: string;
	userId?: number;
}

export interface ChatResponse {
	text: string;
	timestamp: string;
}

/**
 * Send a message to the AI and get a response
 */
export async function sendMessageToAI(
	messageText: string
): Promise<ChatResponse> {
	try {
		// get auth token from localStorage(if user is logged in)
		const token = localStorage.getItem('authToken');

		console.log('sending msg to backend: ', messageText);

		// send POST request to backend
		const response = await fetch(`${API_URL}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: JSON.stringify({
				message: messageText,
				timestamp: new Date().toISOString(),
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('backend error: ', response.status, errorText);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// parse and return the JSON response
		const data = await response.json();
		console.log('received response from backend: ', data);

		return data;
	} catch (error) {
		console.error('Error in sendingMessageToAI:', error);
		throw error; //pass error up to be handled by component
	}
}

// function to fetch chat history
export async function getChatHistory(): Promise<ChatMessage[]> {
	try {
		const token = localStorage.getItem('authToken');

		console.log('fetching chat history from backend..');

		const response = await fetch(`${API_URL}/api/chat/history`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				...(token && { Authorization: `Bearer ${token}` }),
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				'Failed to fetch chat history: ',
				response.status,
				errorText
			);

			//if 404 or 500, return empty array instad of failing
			if (response.status === 404 || response.status === 500) {
				console.warn('No Chat hisotry found, starting fresh');
				return [];
			}
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		console.log('Received chat history: ', data);

		//validate that we get an array
		if (!Array.isArray(data)) {
			console.error('Expected array but got: ', typeof data);
			return [];
		}

		return data;
	} catch (error) {
		console.error('Error fetching chat history:', error);
		// returne empty array instead of throwing - this prevents infinite loading.
		return [];
	}
}
