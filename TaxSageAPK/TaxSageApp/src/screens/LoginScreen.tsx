import React, { useState } from 'react';import React, { useState } from 'react';

import {import {

  View,  View,

  Text,  Text,

  TextInput,  TextInput,

  TouchableOpacity,  TouchableOpacity,

  StyleSheet,  StyleSheet,

  Alert,  Alert,

  ScrollView,  ScrollView,

  KeyboardAvoidingView,  KeyboardAvoidingView,

  Platform,  Platform,

  ActivityIndicator,} from 'react-native';

} from 'react-native';import { LinearGradient } from 'expo-linear-gradient';

import { LinearGradient } from 'expo-linear-gradient';import AsyncStorage from '@react-native-async-storage/async-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';import { Ionicons } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';import { API_CONFIG } from '../constants';

import { API_CONFIG } from '../constants';

interface LoginScreenProps {

interface LoginScreenProps {  navigation: any;

  navigation: any;}

}

const API_BASE_URL = API_CONFIG.BASE_URL;

export default function LoginScreen({ navigation }: LoginScreenProps) {

  const [mode, setMode] = useState<'login' | 'signup'>('signup');export default function LoginScreen({ navigation }: LoginScreenProps) {

  const [email, setEmail] = useState('');  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [password, setPassword] = useState('');  const [email, setEmail] = useState('');

  const [name, setName] = useState('');  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);  const [name, setName] = useState('');

  const [showPassword, setShowPassword] = useState(false);  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit() {  const [passwordStrength, setPasswordStrength] = useState<'' | 'Weak' | 'Medium' | 'Strong'>('');

    if (!email || !password) {

      Alert.alert('Error', 'Please fill in all fields');  function isAllowedEmail(email: string): boolean {

      return;    const allowedDomains = ['gmail.com', 'gmai.com', 'joho.com'];

    }    const specialEmail = 'rahul015january@gmail.com';

    if (email === specialEmail) return true;

    if (mode === 'signup' && !name) {    const match = email.match(/^([\w.-]+)@([\w.-]+)$/);

      Alert.alert('Error', 'Please enter your name');    if (!match) return false;

      return;    const domain = match[2].toLowerCase();

    }    return allowedDomains.includes(domain);

  }

    setLoading(true);

  function getPasswordStrength(pw: string): '' | 'Weak' | 'Medium' | 'Strong' {

    try {    if (!pw) return '';

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/${mode}`, {    if (pw.length < 8) return 'Weak';

        method: 'POST',    let score = 0;

        headers: {    if (/[A-Z]/.test(pw)) score++;

          'Content-Type': 'application/json',    if (/[a-z]/.test(pw)) score++;

        },    if (/[0-9]/.test(pw)) score++;

        body: JSON.stringify({ email, password, name }),    if (/[^A-Za-z0-9]/.test(pw)) score++;

      });    if (score >= 3 && pw.length >= 12) return 'Strong';

    if (score >= 2) return 'Medium';

      if (!response.ok) {    return 'Weak';

        const errorData = await response.json().catch(() => ({}));  }

        throw new Error(errorData.error || 'Authentication failed');

      }  async function handleSubmit() {

    if (!isAllowedEmail(email)) {

      const data = await response.json();      Alert.alert('Invalid Email', 'Only authentic gmail.com, gmai.com, joho.com emails are allowed, or \'rahul015january@gmail.com\'.');

            return;

      // Store session    }

      await AsyncStorage.setItem('isLoggedIn', 'true');    if (password.length < 8) {

      await AsyncStorage.setItem('user', JSON.stringify(data));      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');

      return;

      // Check if user has completed onboarding    }

      const meResponse = await fetch(`${API_CONFIG.BASE_URL}/api/me`, {

        credentials: 'include',    setLoading(true);

      });    

          try {

      if (meResponse.ok) {      const response = await fetch(`${API_BASE_URL}/api/auth/${mode}`, {

        const meData = await meResponse.json();        method: 'POST',

        if (meData?.profile?.fullName) {        headers: {

          // User has completed onboarding, go to dashboard          'Content-Type': 'application/json',

          navigation.replace('Dashboard');        },

        } else {        body: JSON.stringify({ email, password, name }),

          // User needs onboarding      });

          navigation.replace('Onboarding');

        }      if (!response.ok) {

      } else {        const errorData = await response.json().catch(() => ({}));

        // If can't check, go to onboarding to be safe        throw new Error(errorData.error || 'Authentication failed');

        navigation.replace('Onboarding');      }

      }

    } catch (error: any) {      const data = await response.json();

      console.error('Auth error:', error);      

      Alert.alert('Authentication Error', error.message || 'Something went wrong');      // Store user data

    } finally {      await AsyncStorage.setItem('user', JSON.stringify(data));

      setLoading(false);      await AsyncStorage.setItem('isLoggedIn', 'true');

    }      

  }      // Navigate to main app

      navigation.replace('Main');

  return (    } catch (error: any) {

    <LinearGradient      Alert.alert('Authentication Error', error.message);

      colors={['#1E1B4B', '#312E81', '#3730A3', '#1E40AF', '#1E3A8A']}    } finally {

      style={styles.container}      setLoading(false);

    >    }

      <KeyboardAvoidingView  }

        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

        style={styles.keyboardView}  const getStrengthColor = () => {

      >    switch (passwordStrength) {

        <ScrollView contentContainerStyle={styles.scrollContent}>      case 'Strong': return '#22C55E';

          {/* Logo */}      case 'Medium': return '#EAB308';

          <View style={styles.logoContainer}>      case 'Weak': return '#EF4444';

            <View style={styles.logoCircle}>      default: return '#9CA3AF';

              <Ionicons name="briefcase" size={36} color="#FFFFFF" />    }

            </View>  };

            <Text style={styles.logoText}>TaxSage</Text>

            <Text style={styles.logoSubtext}>AI-Powered CA Advisor</Text>  return (

          </View>    <LinearGradient

      colors={['#1E1B4B', '#312E81', '#3730A3']}

          {/* Glass Card */}      style={styles.container}

          <View style={styles.card}>    >

            <View style={styles.cardHeader}>      <KeyboardAvoidingView

              <Text style={styles.cardTitle}>        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

                {mode === 'signup' ? 'Create your account' : 'Welcome back'}        style={styles.keyboardView}

              </Text>      >

              <Text style={styles.cardDescription}>        <ScrollView contentContainerStyle={styles.scrollContent}>

                {mode === 'signup' ? 'Sign up to use your CA Chatbot' : 'Sign in to continue'}          <View style={styles.logoContainer}>

              </Text>            <Text style={styles.logoText}>TaxSage</Text>

            </View>            <Text style={styles.subtitle}>AI-Powered CA Advisor</Text>

          </View>

            <View style={styles.form}>

              {mode === 'signup' && (          <View style={styles.formContainer}>

                <View style={styles.inputGroup}>            <Text style={styles.title}>

                  <Text style={styles.label}>Full name</Text>              {mode === 'login' ? 'Welcome back' : 'Create your account'}

                  <TextInput            </Text>

                    style={styles.input}            <Text style={styles.description}>

                    value={name}              Sign {mode === 'login' ? 'in' : 'up'} to use your CA Chatbot

                    onChangeText={setName}            </Text>

                    placeholder="Enter your full name"

                    placeholderTextColor="rgba(255,255,255,0.5)"            {mode === 'signup' && (

                  />              <View style={styles.inputContainer}>

                </View>                <Text style={styles.label}>Full name</Text>

              )}                <TextInput

                  style={styles.input}

              <View style={styles.inputGroup}>                  value={name}

                <Text style={styles.label}>Email</Text>                  onChangeText={setName}

                <TextInput                  placeholder="Enter your full name"

                  style={styles.input}                  placeholderTextColor="#9CA3AF"

                  value={email}                />

                  onChangeText={setEmail}              </View>

                  placeholder="Enter your email"            )}

                  placeholderTextColor="rgba(255,255,255,0.5)"

                  keyboardType="email-address"            <View style={styles.inputContainer}>

                  autoCapitalize="none"              <Text style={styles.label}>Email</Text>

                  autoComplete="email"              <TextInput

                />                style={styles.input}

              </View>                value={email}

                onChangeText={setEmail}

              <View style={styles.inputGroup}>                placeholder="Enter your email"

                <Text style={styles.label}>Password</Text>                placeholderTextColor="#9CA3AF"

                <View style={styles.passwordContainer}>                keyboardType="email-address"

                  <TextInput                autoCapitalize="none"

                    style={[styles.input, styles.passwordInput]}              />

                    value={password}            </View>

                    onChangeText={setPassword}

                    placeholder="Enter your password"            <View style={styles.inputContainer}>

                    placeholderTextColor="rgba(255,255,255,0.5)"              <Text style={styles.label}>Password</Text>

                    secureTextEntry={!showPassword}              <View style={styles.passwordContainer}>

                    autoCapitalize="none"                <TextInput

                  />                  style={[styles.input, styles.passwordInput]}

                  <TouchableOpacity                  value={password}

                    style={styles.eyeIcon}                  onChangeText={(text) => {

                    onPress={() => setShowPassword(!showPassword)}                    setPassword(text);

                  >                    setPasswordStrength(getPasswordStrength(text));

                    <Ionicons                  }}

                      name={showPassword ? 'eye-off' : 'eye'}                  placeholder="Enter your password"

                      size={24}                  placeholderTextColor="#9CA3AF"

                      color="rgba(255,255,255,0.7)"                  secureTextEntry={!showPassword}

                    />                />

                  </TouchableOpacity>                <TouchableOpacity

                </View>                  style={styles.eyeIcon}

              </View>                  onPress={() => setShowPassword(!showPassword)}

                >

              <TouchableOpacity                  <Ionicons

                style={[styles.submitButton, loading && styles.submitButtonDisabled]}                    name={showPassword ? 'eye-off' : 'eye'}

                onPress={handleSubmit}                    size={24}

                disabled={loading}                    color="#9CA3AF"

              >                  />

                <LinearGradient                </TouchableOpacity>

                  colors={['#10B981', '#059669']}                {password && (

                  style={styles.submitGradient}                  <View style={[styles.strengthBadge, { borderColor: getStrengthColor() }]}>

                >                    <Text style={[styles.strengthText, { color: getStrengthColor() }]}>

                  {loading ? (                      {passwordStrength}

                    <ActivityIndicator color="#FFFFFF" />                    </Text>

                  ) : (                  </View>

                    <Text style={styles.submitButtonText}>                )}

                      {mode === 'signup' ? 'Sign up' : 'Sign in'}              </View>

                    </Text>            </View>

                  )}

                </LinearGradient>            <TouchableOpacity

              </TouchableOpacity>              style={[styles.submitButton, loading && styles.submitButtonDisabled]}

              onPress={handleSubmit}

              <TouchableOpacity              disabled={loading}

                style={styles.switchModeButton}            >

                onPress={() => setMode(mode === 'signup' ? 'login' : 'signup')}              <Text style={styles.submitButtonText}>

              >                {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Sign up'}

                <Text style={styles.switchModeText}>              </Text>

                  {mode === 'signup'            </TouchableOpacity>

                    ? 'Have an account? Sign in'

                    : 'New here? Create an account'}            <TouchableOpacity

                </Text>              style={styles.switchModeButton}

              </TouchableOpacity>              onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}

            </View>            >

          </View>              <Text style={styles.switchModeText}>

                {mode === 'login' ? 'New here? Create an account' : 'Have an account? Sign in'}

          {/* Back to Home */}              </Text>

          <TouchableOpacity            </TouchableOpacity>

            style={styles.backButton}          </View>

            onPress={() => navigation.navigate('Home')}        </ScrollView>

          >      </KeyboardAvoidingView>

            <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.8)" />    </LinearGradient>

            <Text style={styles.backButtonText}>Back to Home</Text>  );

          </TouchableOpacity>}

        </ScrollView>

      </KeyboardAvoidingView>const styles = StyleSheet.create({

    </LinearGradient>  container: {

  );    flex: 1,

}  },

  keyboardView: {

const styles = StyleSheet.create({    flex: 1,

  container: {  },

    flex: 1,  scrollContent: {

  },    flexGrow: 1,

  keyboardView: {    justifyContent: 'center',

    flex: 1,    padding: 20,

  },  },

  scrollContent: {  logoContainer: {

    flexGrow: 1,    alignItems: 'center',

    justifyContent: 'center',    marginBottom: 40,

    padding: 20,  },

    paddingTop: 60,  logoText: {

  },    fontSize: 48,

  logoContainer: {    fontWeight: 'bold',

    alignItems: 'center',    color: '#FFFFFF',

    marginBottom: 40,    textShadowColor: 'rgba(0,0,0,0.3)',

  },    textShadowOffset: { width: 2, height: 2 },

  logoCircle: {    textShadowRadius: 4,

    width: 72,  },

    height: 72,  subtitle: {

    borderRadius: 36,    fontSize: 16,

    backgroundColor: 'rgba(59, 130, 246, 0.3)',    color: 'rgba(255,255,255,0.8)',

    borderWidth: 1,    marginTop: 8,

    borderColor: 'rgba(59, 130, 246, 0.5)',  },

    justifyContent: 'center',  formContainer: {

    alignItems: 'center',    backgroundColor: 'rgba(255,255,255,0.15)',

    marginBottom: 16,    borderRadius: 20,

  },    padding: 30,

  logoText: {    borderWidth: 1,

    fontSize: 32,    borderColor: 'rgba(255,255,255,0.2)',

    fontWeight: '700',  },

    color: '#FFFFFF',  title: {

    marginBottom: 8,    fontSize: 24,

  },    fontWeight: 'bold',

  logoSubtext: {    color: '#FFFFFF',

    fontSize: 16,    textAlign: 'center',

    color: 'rgba(255,255,255,0.8)',    marginBottom: 8,

  },  },

  card: {  description: {

    backgroundColor: 'rgba(0,0,0,0.25)',    fontSize: 16,

    backdropFilter: 'blur(25px)',    color: 'rgba(255,255,255,0.8)',

    borderRadius: 24,    textAlign: 'center',

    borderWidth: 1,    marginBottom: 30,

    borderColor: 'rgba(255,255,255,0.15)',  },

    padding: 24,  inputContainer: {

    marginBottom: 24,    marginBottom: 20,

  },  },

  cardHeader: {  label: {

    marginBottom: 24,    fontSize: 16,

  },    fontWeight: '600',

  cardTitle: {    color: '#FFFFFF',

    fontSize: 24,    marginBottom: 8,

    fontWeight: '700',  },

    color: '#FFFFFF',  input: {

    textAlign: 'center',    backgroundColor: 'rgba(255,255,255,0.2)',

    marginBottom: 8,    borderRadius: 12,

  },    padding: 16,

  cardDescription: {    fontSize: 16,

    fontSize: 16,    color: '#FFFFFF',

    color: 'rgba(255,255,255,0.8)',    borderWidth: 1,

    textAlign: 'center',    borderColor: 'rgba(255,255,255,0.3)',

  },  },

  form: {  passwordContainer: {

    gap: 20,    position: 'relative',

  },  },

  inputGroup: {  passwordInput: {

    gap: 8,    paddingRight: 120,

  },  },

  label: {  eyeIcon: {

    fontSize: 16,    position: 'absolute',

    fontWeight: '600',    right: 16,

    color: '#FFFFFF',    top: 16,

  },  },

  input: {  strengthBadge: {

    backgroundColor: 'rgba(255,255,255,0.15)',    position: 'absolute',

    borderRadius: 12,    right: 56,

    padding: 16,    top: 12,

    fontSize: 16,    paddingHorizontal: 8,

    color: '#FFFFFF',    paddingVertical: 4,

    borderWidth: 1,    borderRadius: 12,

    borderColor: 'rgba(255,255,255,0.2)',    borderWidth: 1,

  },    backgroundColor: 'rgba(255,255,255,0.1)',

  passwordContainer: {  },

    position: 'relative',  strengthText: {

  },    fontSize: 12,

  passwordInput: {    fontWeight: 'bold',

    paddingRight: 56,    textTransform: 'uppercase',

  },  },

  eyeIcon: {  submitButton: {

    position: 'absolute',    backgroundColor: '#3B82F6',

    right: 16,    borderRadius: 12,

    top: 16,    padding: 16,

  },    alignItems: 'center',

  submitButton: {    marginTop: 20,

    borderRadius: 12,  },

    overflow: 'hidden',  submitButtonDisabled: {

    marginTop: 8,    opacity: 0.6,

  },  },

  submitGradient: {  submitButtonText: {

    padding: 16,    fontSize: 18,

    alignItems: 'center',    fontWeight: 'bold',

  },    color: '#FFFFFF',

  submitButtonDisabled: {  },

    opacity: 0.6,  switchModeButton: {

  },    alignItems: 'center',

  submitButtonText: {    marginTop: 20,

    fontSize: 18,  },

    fontWeight: '700',  switchModeText: {

    color: '#FFFFFF',    fontSize: 16,

  },    color: 'rgba(255,255,255,0.8)',

  switchModeButton: {    textDecorationLine: 'underline',

    alignItems: 'center',  },

    paddingVertical: 8,});
  },
  switchModeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'underline',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
});
