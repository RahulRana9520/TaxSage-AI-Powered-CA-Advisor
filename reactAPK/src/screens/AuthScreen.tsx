import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors, gradients } from '../styles/globalStyles';

interface AuthScreenProps {
  navigation: any;
}

export default function AuthScreen({ navigation }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      // Simulate authentication
      setTimeout(() => {
        Alert.alert('Success', `${isSignUp ? 'Account created' : 'Logged in'} successfully!`, [
          { text: 'OK', onPress: () => navigation.replace('Main') }
        ]);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    }
  };

  return (
    <LinearGradient colors={gradients.primary} style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Ionicons name="calculator" size={60} color={colors.primary} />
            <Text style={styles.title}>TaxSage</Text>
            <Text style={styles.subtitle}>AI-Powered CA Advisor</Text>
          </View>

          <View style={[globalStyles.glassMorphism, styles.formContainer]}>
            <Text style={styles.formTitle}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>
            
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[globalStyles.input, styles.input]}
                placeholder="Email Address"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[globalStyles.input, styles.input]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[globalStyles.button, styles.authButton]}
              onPress={handleAuth}
            >
              <LinearGradient
                colors={gradients.accent}
                style={styles.gradientButton}
                start={[0, 0]}
                end={[1, 0]}
              >
                <Text style={globalStyles.buttonText}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.switchButton}>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.guestButton} onPress={() => navigation.replace('Main')}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  formContainer: {
    padding: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    zIndex: 1,
  },
  input: {
    paddingLeft: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    top: 18,
  },
  authButton: {
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  switchButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  guestButton: {
    alignItems: 'center',
    padding: 10,
  },
  guestText: {
    color: colors.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});