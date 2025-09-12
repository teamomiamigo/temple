import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TempleScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const TempleScreen = ({ navigation }: TempleScreenProps) => {
  const [dailyProgress] = useState(11); // Mock progress

  const dailyQuotes = [
    {
      text: "Sometimes the most important thing in a whole day is the rest we take between two deep breaths.",
      author: "Etty Hillesum"
    },
    {
      text: "The present moment is the only time over which we have dominion.",
      author: "Thích Nhất Hạnh"
    },
    {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha"
    },
    {
      text: "Mindfulness is about being fully awake in our lives.",
      author: "Jon Kabat-Zinn"
    },
    {
      text: "The mind is everything. What you think you become.",
      author: "Buddha"
    }
  ];

  const meditationTopics = [
    {
      id: '1',
      title: 'Sleep',
      description: 'Get a peaceful night\'s rest',
      color: '#4A90E2',
      illustration: '🌙',
      categories: ['Meditation for sleep', 'Sleep stories', 'Meditative music', 'Nature sounds']
    },
    {
      id: '2',
      title: 'Students',
      description: 'Bring mindfulness to your studies',
      color: '#F5A623',
      illustration: '📚',
      categories: ['Study focus', 'Exam anxiety', 'Learning mindfulness', 'Academic stress']
    },
    {
      id: '3',
      title: 'Life',
      description: 'Navigate life\'s journey with mindfulness',
      color: '#7ED321',
      illustration: '🌱',
      categories: ['Life transitions', 'Personal growth', 'Life purpose', 'Daily mindfulness']
    },
    {
      id: '4',
      title: 'Societal Crisis',
      description: 'Coping in times of crisis',
      color: '#D0021B',
      illustration: '🤝',
      categories: ['Crisis management', 'Community support', 'Resilience building', 'Social anxiety']
    },
    {
      id: '5',
      title: 'Getting Active',
      description: 'Mindful Steps Toward a Fitter You',
      color: '#50E3C2',
      illustration: '🏃',
      categories: ['Exercise mindfulness', 'Sports meditation', 'Active recovery', 'Movement awareness']
    },
    {
      id: '6',
      title: 'Friends of Medito',
      description: 'Community-guided meditations',
      color: '#BD10E0',
      illustration: '👥',
      categories: ['Community sessions', 'Group meditation', 'Shared experiences', 'Social mindfulness']
    }
  ];

  // Get random daily quote
  const getDailyQuote = () => {
    const today = new Date().getDate();
    return dailyQuotes[today % dailyQuotes.length];
  };

  const currentQuote = getDailyQuote();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{dailyProgress}%</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Quote Section */}
        <View style={styles.quoteSection}>
          <Text style={styles.quoteTitle}>Daily Quote</Text>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {currentQuote.author}</Text>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured</Text>
          
          {/* Main Featured Tile */}
          <TouchableOpacity 
            style={styles.featuredTile}
            onPress={() => navigation.navigate('MeditationTopic', { topic: meditationTopics[1] })}
          >
            <View style={styles.tileIllustration}>
              <Text style={styles.tileEmoji}>{meditationTopics[1].illustration}</Text>
            </View>
            <View style={styles.tileContent}>
              <Text style={styles.tileTitle}>{meditationTopics[1].title}</Text>
              <Text style={styles.tileDescription}>{meditationTopics[1].description}</Text>
              <TouchableOpacity style={styles.exploreButton}>
                <Text style={styles.exploreButtonText}>Explore Pack</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Meditation Topics Grid */}
        <View style={styles.topicsSection}>
          <Text style={styles.sectionTitle}>Meditation Topics</Text>
          <View style={styles.topicsGrid}>
            {meditationTopics.map((topic) => (
              <TouchableOpacity 
                key={topic.id}
                style={[styles.topicTile, { backgroundColor: topic.color }]}
                onPress={() => navigation.navigate('MeditationTopic', { topic })}
              >
                <View style={styles.topicIllustration}>
                  <Text style={styles.topicEmoji}>{topic.illustration}</Text>
                </View>
                <View style={styles.topicContent}>
                  <Text style={styles.topicTitle}>{topic.title}</Text>
                  <Text style={styles.topicDescription}>{topic.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const tileWidth = (width - 48) / 2; // 2 columns with padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quoteSection: {
    marginBottom: 32,
  },
  quoteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  quoteCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginBottom: 12,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  shareButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuredSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  featuredTile: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tileIllustration: {
    height: 120,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileEmoji: {
    fontSize: 48,
  },
  tileContent: {
    padding: 20,
  },
  tileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tileDescription: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  exploreButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  topicsSection: {
    marginBottom: 32,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicTile: {
    width: tileWidth,
    height: 160,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  topicIllustration: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicEmoji: {
    fontSize: 32,
  },
  topicContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'center',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
  },
});