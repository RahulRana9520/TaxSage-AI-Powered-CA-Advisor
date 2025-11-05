import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  async function checkLoginStatus() {
    try {
      // Check if user is logged in
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      const userData = await AsyncStorage.getItem('user');
      
      console.log('Login check - isLoggedIn:', loggedIn, 'userData:', userData);
      
      if (loggedIn === 'true' && userData) {
        setIsLoggedIn(true);
      }
      
      // Set join date if not exists
      const joinDate = await AsyncStorage.getItem('join_date');
      if (!joinDate) {
        await AsyncStorage.setItem('join_date', new Date().toISOString());
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading TaxSage...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNavigator initiallyLoggedIn={isLoggedIn} />
      <StatusBar style="light" backgroundColor="#1E1B4B" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1B4B',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
