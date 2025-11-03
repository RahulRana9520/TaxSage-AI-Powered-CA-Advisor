import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors, gradients } from '../styles/globalStyles';

interface DashboardScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    totalRoadmaps: 3,
    completedTasks: 12,
    savings: 45000,
    goals: 2,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const quickActions = [
    {
      id: 1,
      title: 'CA Chat',
      subtitle: 'Get AI assistance',
      icon: 'chatbubbles',
      color: gradients.accent,
      onPress: () => navigation.navigate('Chat'),
    },
    {
      id: 2,
      title: 'View Roadmaps',
      subtitle: 'Check your plans',
      icon: 'map',
      color: gradients.secondary,
      onPress: () => navigation.navigate('Roadmap'),
    },
    {
      id: 3,
      title: 'Tax Calculator',
      subtitle: 'Calculate taxes',
      icon: 'calculator',
      color: ['#10b981', '#059669'] as const,
      onPress: () => Alert.alert('Coming Soon', 'Tax calculator feature will be available soon!'),
    },
    {
      id: 4,
      title: 'Analytics',
      subtitle: 'View insights',
      icon: 'analytics',
      color: ['#f59e0b', '#d97706'] as const,
      onPress: () => Alert.alert('Coming Soon', 'Analytics feature will be available soon!'),
    },
  ];

  return (
    <LinearGradient colors={gradients.primary} style={globalStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}!</Text>
            <Text style={styles.userName}>Welcome to TaxSage</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={40} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.statCard]}>
              <Ionicons name="map-outline" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{stats.totalRoadmaps}</Text>
              <Text style={styles.statLabel}>Roadmaps</Text>
            </LinearGradient>
            
            <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.statCard]}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
              <Text style={styles.statNumber}>{stats.completedTasks}</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.statsRow}>
            <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.statCard]}>
              <Ionicons name="wallet-outline" size={24} color={colors.warning} />
              <Text style={styles.statNumber}>₹{(stats.savings / 1000).toFixed(0)}K</Text>
              <Text style={styles.statLabel}>Savings</Text>
            </LinearGradient>
            
            <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.statCard]}>
              <Ionicons name="flag-outline" size={24} color={colors.secondary} />
              <Text style={styles.statNumber}>{stats.goals}</Text>
              <Text style={styles.statLabel}>Goals</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity key={action.id} onPress={action.onPress} style={styles.actionButton}>
                <LinearGradient colors={action.color} style={[globalStyles.glassMorphism, styles.actionCard]}>
                  <Ionicons name={action.icon as any} size={32} color={colors.text} />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.activityCard]}>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.activityText}>Car purchase roadmap created</Text>
              <Text style={styles.activityTime}>2 hrs ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="chatbubbles" size={20} color={colors.primary} />
              <Text style={styles.activityText}>Asked CA about tax savings</Text>
              <Text style={styles.activityTime}>5 hrs ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="calculator" size={20} color={colors.warning} />
              <Text style={styles.activityText}>Used income tax calculator</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 5,
  },
  profileButton: {
    padding: 5,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  actionCard: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  recentContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityCard: {
    padding: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 15,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});