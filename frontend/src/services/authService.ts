// Authnetication service for handling login, register, and token management

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

//interfaces for auth data
export interface User {
	userId: number;
	email: string;
	name: string;
}

export interface AuthResponse {
	token: string;
	email: string;
	name: string;
	userId: number;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
	try {
		console.log(' Registering user:', data.email);

		const response = await fetch(`${API_URL}/api/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(responseData.error || 'Registration failed');
		}

		console.log(' Registration successful');

		//Store token and user data in localStorage
		localStorage.setItem('authToken', responseData.token);
		localStorage.setItem(
			'user',
			JSON.stringify({
				userId: responseData.userId,
				email: responseData.email,
				name: responseData.name,
			})
		);

		return responseData;
	} catch (error) {
		console.error(' Registration error:', error);
		throw error;
	}
}

/**
 * Login user
 */

export async function login(data: LoginRequest): Promise<AuthResponse> {
	try {
		console.log(' Logging in user:', data.email);

		const response = await fetch(`${API_URL}/api/auth/login`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(responseData.error || 'Login failed');
		}

		console.log(' Login successful');

		//Store token and user data in localStorage
		localStorage.setItem('authToken', responseData.token);
		localStorage.setItem(
			'user',
			JSON.stringify({
				userId: responseData.userId,
				email: responseData.email,
				name: responseData.name,
			})
		);

		return responseData;
	} catch (error) {
		console.log(' Login error:', error);
		throw error;
	}
}
/**
 * Logout user by clearing LocalStorage
 */
export function logout(): void {
	console.log(' Loggin out user');
	localStorage.removeItem('authToken');
	localStorage.removeItem('user');
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
	try {
		const userStr = localStorage.getItem('user');
		if (!userStr) return null;

		return JSON.parse(userStr);
	} catch (error) {
		console.error('Error getting current user:', error);
		return null;
	}
}

/**
 * Get auth token
 */

export function getAuthToken(): string | null {
	return localStorage.getItem('authToken');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
	const token = getAuthToken();
	return !!token; //the double !! applies NOT twice to convert to boolean
}

/**
 * Validate token with backend
 */
export async function validateToken(): Promise<boolean> {
	try {
		const token = getAuthToken();
		if (!token) return false;

		const response = await fetch(`${API_URL}/api/auth/validate`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await response.json();

		return data.valid === true;
	} catch (error) {
		console.error(' Token validation error:', error);
		return false;
	}
}
