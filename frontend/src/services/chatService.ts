// this service handles all communication with the backend API
// it sends msg and receives responses

// get backend URL from env variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// func to send a msg to the AI and get a response

export async function sendMessageToAI(messageText: string) {
	try {
		// get auth token from localStorage(if user is logged in)
		const token = localStorage.getItem('authToken');

		// send POST request to backend
		const response = await fetch(`${API_URL}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// include auth token if available
				...(token && { Authorization: `Bearer ${token}` }),
			},
			body: JSON.stringify({
				message: messageText,
				timestamp: new Date().toISOString(),
			}),
		});

		// check if request was successful
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		// parse and return the JSON response
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error in chatService:', error);
		throw error; //pass error up to be handled by component
	}
}

// function to fetch chat history
export async function getChatHistory() {
	try {
		const token = localStorage.getItem('authToken');

		const response = await fetch(`${API_URL}/api/chat/history`, {
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
		console.error('Error fetching chat history:', error);
		throw error;
	}
}
