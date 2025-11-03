import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors, gradients } from '../styles/globalStyles';

interface Roadmap {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface RoadmapScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

export default function RoadmapScreen({ navigation }: RoadmapScreenProps) {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      const stored = await AsyncStorage.getItem('taxsage_roadmaps');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRoadmaps(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading roadmaps:', error);
      setRoadmaps([]);
    }
  };

  const formatDescription = (text: string) => {
    if (!text) return '';

    return text
      .replace(/[\uFFFD�]/g, '')
      .replace(/#{1,6}\s*/g, '')
      .replace(/🔴\s*🔴\s*Step\s*(\d+):/gi, '\n\n📌 Step $1:\n')
      .replace(/🔴\s*Step\s*(\d+):/gi, '\n\n📌 Step $1:\n')
      .replace(/Step\s*(\d+):/gi, '\n\n📌 Step $1:\n')
      .replace(/\s*🔸\s*/g, '\n• ')
      .replace(/\s*✅\s*/g, '\n• ')
      .replace(/\s*📍\s*/g, '\n• ')
      .replace(/\s*•\s*/g, '\n• ')
      .replace(/(Car Cost:|Recommended|Down Payment:|Loan Required:|Loan Tenure:|Action Items:|Monthly Income:|Savings:|Expenses:)/gi, '\n\n✅ $1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/---\s*/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const renderFormattedContent = (text: string) => {
    const lines = formatDescription(text).split('\n');
    
    return lines.map((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
        return <View key={index} style={{ height: 8 }} />;
      }
      
      if (trimmed.startsWith('📌 Step')) {
        return (
          <Text key={index} style={styles.stepHeader}>
            {trimmed}
          </Text>
        );
      }
      
      if (trimmed.startsWith('• ')) {
        return (
          <View key={index} style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{trimmed.substring(2)}</Text>
          </View>
        );
      }
      
      if (trimmed.startsWith('✅')) {
        return (
          <Text key={index} style={styles.sectionHeader}>
            {trimmed}
          </Text>
        );
      }
      
      if (trimmed) {
        return (
          <Text key={index} style={styles.regularText}>
            {trimmed}
          </Text>
        );
      }
      
      return null;
    });
  };

  const handleShare = async (roadmap: Roadmap) => {
    try {
      const content = `${roadmap.title}\n\nCreated: ${new Date(roadmap.createdAt).toLocaleDateString()}\n\n${formatDescription(roadmap.description)}`;
      
      await Share.share({
        message: content,
        title: roadmap.title,
      });
    } catch (error) {
      console.error('Error sharing roadmap:', error);
      Alert.alert('Error', 'Failed to share roadmap');
    }
  };

  const handleDelete = (roadmap: Roadmap) => {
    Alert.alert(
      'Delete Roadmap',
      `Are you sure you want to delete "${roadmap.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRoadmap(roadmap.id) },
      ]
    );
  };

  const deleteRoadmap = async (id: string) => {
    try {
      const updatedRoadmaps = roadmaps.filter(r => r.id !== id);
      setRoadmaps(updatedRoadmaps);
      await AsyncStorage.setItem('taxsage_roadmaps', JSON.stringify(updatedRoadmaps));
      
      if (selectedRoadmap?.id === id) {
        setSelectedRoadmap(null);
      }
      
      Alert.alert('Success', 'Roadmap deleted successfully');
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      Alert.alert('Error', 'Failed to delete roadmap');
    }
  };

  if (selectedRoadmap) {
    return (
      <LinearGradient colors={gradients.primary} style={globalStyles.container}>
        <View style={styles.selectedHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedRoadmap(null)}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.selectedTitle} numberOfLines={2}>
            {selectedRoadmap.title}
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleShare(selectedRoadmap)}
            >
              <Ionicons name="share-outline" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(selectedRoadmap)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.contentCard]}>
            <Text style={styles.createdDate}>
              Created: {new Date(selectedRoadmap.createdAt).toLocaleDateString()}
            </Text>
            <View style={styles.descriptionContainer}>
              {renderFormattedContent(selectedRoadmap.description)}
            </View>
          </LinearGradient>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.primary} style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={globalStyles.title}>📋 Financial Roadmaps</Text>
        <Text style={globalStyles.subtitle}>
          Your personalized financial journey plans created by TaxSage AI
        </Text>
      </View>

      {roadmaps.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.emptyCard]}>
            <Ionicons name="map-outline" size={60} color={colors.primary} />
            <Text style={styles.emptyTitle}>🚀 Get Started with Your Financial Journey</Text>
            <Text style={styles.emptyText}>
              No roadmaps yet. Visit the Chat section and ask the CA chatbot to create a personalized roadmap!
            </Text>
            <TouchableOpacity
              style={[globalStyles.button, styles.chatButton]}
              onPress={() => navigation.navigate('Chat')}
            >
              <LinearGradient colors={gradients.accent} style={styles.buttonGradient}>
                <Ionicons name="chatbubbles" size={20} color={colors.text} />
                <Text style={[globalStyles.buttonText, { marginLeft: 10 }]}>Go to Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <ScrollView style={styles.roadmapsList} showsVerticalScrollIndicator={false}>
          {roadmaps.map((roadmap) => (
            <TouchableOpacity
              key={roadmap.id}
              onPress={() => setSelectedRoadmap(roadmap)}
              style={styles.roadmapItem}
            >
              <LinearGradient colors={gradients.secondary} style={[globalStyles.glassMorphism, styles.roadmapCard]}>
                <View style={styles.cardHeader}>
                  <Ionicons name="map" size={24} color={colors.text} />
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleShare(roadmap);
                      }}
                      style={styles.cardActionButton}
                    >
                      <Ionicons name="share-outline" size={18} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(roadmap);
                      }}
                      style={styles.cardActionButton}
                    >
                      <Ionicons name="trash-outline" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.roadmapTitle} numberOfLines={2}>
                  {roadmap.title}
                </Text>
                
                <Text style={styles.roadmapDate}>
                  {new Date(roadmap.createdAt).toLocaleDateString()}
                </Text>
                
                <Text style={styles.roadmapPreview} numberOfLines={3}>
                  {formatDescription(roadmap.description).substring(0, 150)}...
                </Text>
                
                <View style={styles.cardFooter}>
                  <Text style={styles.viewMore}>Tap to view full roadmap</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  chatButton: {
    width: '100%',
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
  },
  roadmapsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roadmapItem: {
    marginBottom: 15,
  },
  roadmapCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardActions: {
    flexDirection: 'row',
  },
  cardActionButton: {
    padding: 8,
    marginLeft: 5,
  },
  roadmapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  roadmapDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roadmapPreview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewMore: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 15,
  },
  selectedTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    padding: 10,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentCard: {
    padding: 25,
    marginBottom: 20,
  },
  createdDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  descriptionContainer: {
    flex: 1,
  },
  stepHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.warning,
    marginTop: 20,
    marginBottom: 10,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: 15,
    marginBottom: 8,
  },
  regularText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
});