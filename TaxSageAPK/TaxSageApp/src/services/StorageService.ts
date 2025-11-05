import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export class StorageService {
  // User Management
  static async setUser(user: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static async getUser(): Promise<any | null> {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  static async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Authentication Status
  static async setLoginStatus(isLoggedIn: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(isLoggedIn));
  }

  static async getLoginStatus(): Promise<boolean> {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return status ? JSON.parse(status) : false;
  }

  // Chat History
  static async saveChatHistory(messages: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
  }

  static async getChatHistory(): Promise<any[]> {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return history ? JSON.parse(history) : [];
  }

  static async clearChatHistory(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
  }

  // Roadmaps
  static async saveRoadmaps(roadmaps: any[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
  }

  static async getRoadmaps(): Promise<any[]> {
    const roadmaps = await AsyncStorage.getItem(STORAGE_KEYS.ROADMAPS);
    return roadmaps ? JSON.parse(roadmaps) : [];
  }

  static async addRoadmap(roadmap: any): Promise<void> {
    const roadmaps = await this.getRoadmaps();
    roadmaps.push(roadmap);
    await this.saveRoadmaps(roadmaps);
  }

  static async removeRoadmap(roadmapId: string): Promise<void> {
    const roadmaps = await this.getRoadmaps();
    const filtered = roadmaps.filter((r: any) => r.id !== roadmapId);
    await this.saveRoadmaps(filtered);
  }

  // Analytics
  static async saveAnalytics(analytics: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  }

  static async getAnalytics(): Promise<any> {
    const analytics = await AsyncStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return analytics ? JSON.parse(analytics) : null;
  }

  // Clear All Data
  static async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CHAT_HISTORY,
      STORAGE_KEYS.ROADMAPS,
      STORAGE_KEYS.ANALYTICS,
    ]);
  }

  // General Storage Operations
  static async setItem(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async getItem(key: string): Promise<any> {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  static async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}