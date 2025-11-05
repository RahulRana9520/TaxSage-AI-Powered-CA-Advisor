// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://taxsage-ca-advisor.vercel.app', // Your deployed Vercel backend
  ENDPOINTS: {
    AUTH: '/api/auth',
    CHAT: '/api/chat',
    ANALYTICS: '/api/analytics',
    ME: '/api/me',
  },
  TIMEOUT: 30000, // 30 seconds
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  IS_LOGGED_IN: 'isLoggedIn',
  CHAT_HISTORY: 'chat_history',
  ROADMAPS: 'taxsage_roadmaps',
  ANALYTICS: 'analytics',
  JOIN_DATE: 'join_date',
  SETTINGS: 'user_settings',
};

// App Colors
export const COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#8B5CF6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  GRAY: '#6B7280',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRADIENT: {
    MAIN: ['#1E1B4B', '#312E81', '#3730A3', '#1E40AF', '#1E3A8A'],
    CARD: ['#667eea', '#764ba2'],
    BUTTON: ['#3B82F6', '#8B5CF6'],
  },
};

// App Dimensions
export const DIMENSIONS = {
  PADDING: 20,
  BORDER_RADIUS: 12,
  CARD_RADIUS: 16,
  BUTTON_HEIGHT: 48,
};

// Text Sizes
export const TEXT_SIZES = {
  TITLE: 28,
  SUBTITLE: 20,
  BODY: 16,
  CAPTION: 14,
  SMALL: 12,
};