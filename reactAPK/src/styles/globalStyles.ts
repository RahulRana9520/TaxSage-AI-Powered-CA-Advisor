import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  background: '#1e1b4b',
  surface: 'rgba(255, 255, 255, 0.1)',
  surfaceLight: 'rgba(255, 255, 255, 0.15)',
  text: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const gradients = {
  primary: ['#1e1b4b', '#312e81', '#3730a3', '#1e40af', '#1e3a8a'] as const,
  secondary: ['#667eea', '#764ba2'] as const,
  accent: ['#3b82f6', '#8b5cf6'] as const,
  card: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientContainer: {
    flex: 1,
    padding: 20,
  },
  glassMorphism: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 15,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  userBubble: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  stepHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.warning,
    marginTop: 20,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    paddingLeft: 20,
  },
  exportButton: {
    backgroundColor: colors.success,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
});

export const animations = {
  fadeIn: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
  fadeOut: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
};

export default globalStyles;