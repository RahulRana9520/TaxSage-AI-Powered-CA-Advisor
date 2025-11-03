import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, colors, gradients } from '../styles/globalStyles';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatScreenProps {
  navigation: any;
}

export default function ChatScreen({ navigation }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI-powered CA assistant. How can I help you with your financial planning today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Roadmap related responses
    if (lowerMessage.includes('roadmap') || lowerMessage.includes('plan') || lowerMessage.includes('car') || lowerMessage.includes('house') || lowerMessage.includes('buy')) {
      return `Great! I can help you create a personalized roadmap. Based on your query about "${userMessage}", here's a step-by-step plan:

📌 Step 1: Financial Assessment
• Analyze your current income and expenses
• Check your credit score
• Review your existing savings

📌 Step 2: Goal Planning  
• Set clear financial targets
• Determine timeline for your goal
• Calculate required monthly savings

📌 Step 3: Investment Strategy
• Explore suitable investment options
• Consider tax-saving instruments
• Plan for emergency funds

Would you like me to export this roadmap for you?`;
    }

    if (lowerMessage.includes('tax')) {
      return 'I can help you with tax planning! Here are some key areas:\n\n• Income Tax calculations\n• Tax-saving investments (80C, 80D)\n• Business tax planning\n• GST compliance\n• Capital gains optimization\n\nWhat specific tax matter would you like assistance with?';
    }

    if (lowerMessage.includes('investment')) {
      return 'Investment planning is crucial for financial growth. Consider these options:\n\n• Mutual Funds (SIP)\n• Fixed Deposits\n• PPF (Public Provident Fund)\n• ELSS (Tax-saving funds)\n• Real Estate\n• Stock Market\n\nWhat\'s your risk appetite and investment timeline?';
    }

    if (lowerMessage.includes('loan') || lowerMessage.includes('emi')) {
      return 'For loan planning, I recommend:\n\n• Check your credit score (750+ ideal)\n• Calculate EMI affordability (40% of income max)\n• Compare interest rates\n• Consider loan tenure impact\n• Plan for down payment\n\nWhat type of loan are you considering?';
    }

    // Default responses
    const responses = [
      'That\'s an interesting financial question! Could you provide more details so I can give you specific advice?',
      'As your CA assistant, I\'d be happy to help. Can you tell me more about your financial goals?',
      'I can assist with tax planning, investments, loans, and creating financial roadmaps. What would you like to explore?',
      'Let me help you with that! Could you share more context about your financial situation?',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, true);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateBotResponse(userMessage);
      addMessage(response, false);
      setIsTyping(false);

      // Check if this is a roadmap response and show export option
      if (response.includes('📌 Step')) {
        setTimeout(() => {
          Alert.alert(
            'Export Roadmap',
            'Would you like to export this roadmap to your Roadmaps section?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Export', 
                onPress: () => {
                  saveRoadmap(userMessage, response);
                  Alert.alert('Success', 'Roadmap exported successfully!');
                }
              },
            ]
          );
        }, 1000);
      }
    }, 1500);
  };

  const saveRoadmap = async (title: string, description: string) => {
    try {
      const roadmap = {
        id: Date.now().toString(),
        title: `Roadmap: ${title}`,
        description,
        createdAt: new Date().toISOString(),
      };

      const existingRoadmaps = await AsyncStorage.getItem('taxsage_roadmaps');
      const roadmaps = existingRoadmaps ? JSON.parse(existingRoadmaps) : [];
      roadmaps.push(roadmap);
      
      await AsyncStorage.setItem('taxsage_roadmaps', JSON.stringify(roadmaps));
    } catch (error) {
      console.error('Error saving roadmap:', error);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        globalStyles.chatBubble,
        message.isUser ? globalStyles.userBubble : globalStyles.botBubble,
      ]}
    >
      <Text style={globalStyles.messageText}>{message.text}</Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={gradients.primary} style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.header]}>
          <View style={styles.headerContent}>
            <Ionicons name="chatbubbles" size={24} color={colors.primary} />
            <Text style={styles.headerTitle}>CA Assistant</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[globalStyles.chatBubble, globalStyles.botBubble]}>
              <Text style={styles.typingText}>CA Assistant is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <LinearGradient colors={gradients.card} style={[globalStyles.glassMorphism, styles.inputContainer]}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about taxes, investments, loans..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <LinearGradient colors={gradients.accent} style={styles.sendGradient}>
              <Ionicons name="send" size={20} color={colors.text} />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  timestamp: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  typingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 20,
    padding: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingVertical: 5,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});