import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const Feature = ({ icon, title, description, delay }: {
    icon: string;
    title: string;
    description: string;
    delay: number;
  }) => (
    <View style={[styles.featureCard, { opacity: 1 }]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.3)']}
        style={styles.featureGradient}
      >
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </LinearGradient>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#3730A3', '#1E40AF', '#1E3A8A']}
      style={styles.container}
    >
      {/* Navigation Header */}
      <View style={styles.navContainer}>
        <View style={styles.navLeft}>
          <Ionicons name="briefcase" size={28} color="#FFFFFF" />
          <Text style={styles.logo}>TaxSage</Text>
        </View>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.navButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Your Smart Tax & Financial Assistant
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Get personalized tax strategies, credit analysis, and financial planning powered by AI. 
            Maximize your savings and make informed decisions.
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>🚀 Start Free Analysis</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.secondaryButtonText}>📊 Check Credit Score</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <Feature
            icon="🎯"
            title="Smart Tax Planning"
            description="AI-powered strategies to maximize your tax savings with sections 80C, 80D, HRA, and more."
            delay={0}
          />
          <Feature
            icon="📈"
            title="Credit Score Analysis"
            description="Upload your credit report for personalized loan eligibility and improvement recommendations."
            delay={200}
          />
          <Feature
            icon="💡"
            title="Financial Insights"
            description="Get expert advice on investments, budgeting, and wealth building strategies."
            delay={400}
          />
        </View>

        {/* Final CTA */}
        <View style={styles.ctaCard}>
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.3)']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaTitle}>Ready to Optimize Your Finances?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of users who have saved money with TaxSage
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => navigation.navigate('Login')}
            >
              <LinearGradient
                colors={['#3B82F6', '#1E40AF']}
                style={styles.buttonGradient}
              >
                <Text style={styles.ctaButtonText}>🎉 Get Started Today - It's Free!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  heroSection: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: width < 380 ? 28 : 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: width < 380 ? 36 : 42,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 50,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  featuresGrid: {
    gap: 20,
    marginBottom: 40,
  },
  featureCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  featureGradient: {
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 40,
  },
  ctaGradient: {
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
  },
  ctaTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
