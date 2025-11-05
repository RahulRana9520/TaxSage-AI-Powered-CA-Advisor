import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from './constants';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

const API_BASE_URL = API_CONFIG.BASE_URL;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    if (!email || !password || (mode === 'signup' && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const body = mode === 'login' 
        ? { email, password }
        : { name, email, password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userId', data.userId);
        navigation.replace('Main');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#60A5FA']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>🧾</Text>
            <Text style={styles.title}>TaxSage</Text>
            <Text style={styles.subtitle}>Your AI-Powered CA Advisor</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, mode === 'login' && styles.activeTab]}
                onPress={() => setMode('login')}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.activeTabText]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === 'signup' && styles.activeTab]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.activeTabText]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {mode === 'signup' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleAuth}
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#9CA3AF', '#6B7280'] : ['#3B82F6', '#1E40AF']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitText}>
                      {mode === 'login' ? 'Login' : 'Create Account'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                <Text style={styles.footerLink}>
                  {mode === 'login' ? 'Sign Up' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#E0E7FF' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  tabContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  tabText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  activeTabText: { color: '#1E40AF' },
  form: { marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', color: '#111827' },
  passwordContainer: { position: 'relative' },
  passwordInput: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, paddingRight: 50, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', color: '#111827' },
  eyeIcon: { position: 'absolute', right: 16, top: 16 },
  submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  submitButtonDisabled: { opacity: 0.7 },
  submitGradient: { paddingVertical: 16, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: '#6B7280' },
  footerLink: { fontSize: 14, color: '#3B82F6', fontWeight: '600' },
});
