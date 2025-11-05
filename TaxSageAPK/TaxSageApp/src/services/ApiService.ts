import { API_CONFIG } from '../constants';

export class ApiService {
  private static async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Authentication
  static async login(email: string, password: string): Promise<any> {
    const response = await this.makeRequest(`${API_CONFIG.ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  }

  static async signup(email: string, password: string, name: string): Promise<any> {
    const response = await this.makeRequest(`${API_CONFIG.ENDPOINTS.AUTH}/signup`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  }

  // Chat
  static async sendMessage(messages: any[]): Promise<any> {
    const response = await this.makeRequest(API_CONFIG.ENDPOINTS.CHAT, {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  }

  // Analytics
  static async getAnalytics(): Promise<any> {
    const response = await this.makeRequest(API_CONFIG.ENDPOINTS.ANALYTICS);

    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }

    return response.json();
  }

  // User Profile
  static async getProfile(): Promise<any> {
    const response = await this.makeRequest(API_CONFIG.ENDPOINTS.ME);

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }
}

// Utility functions for API responses
export const handleApiError = (error: any): string => {
  if (error.name === 'AbortError') {
    return 'Request timeout. Please check your connection.';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const isNetworkError = (error: any): boolean => {
  return error.name === 'TypeError' && error.message.includes('fetch');
};