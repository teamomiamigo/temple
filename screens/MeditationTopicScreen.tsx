import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type MeditationTopicScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, 'MeditationTopic'>;
};

export const MeditationTopicScreen = ({ navigation, route }: MeditationTopicScreenProps) => {
  const { topic } = route.params;

  const getMeditationsForTopic = (topicId: string) => {
    const meditationData: { [key: string]: any[] } = {
      '1': [ // Sleep
        {
          id: '1',
          title: 'Getting back to sleep',
          description: 'This session is designed to help you get back to sleep if you\'ve woken up in the middle of the night.',
          duration: '17 min',
          category: 'Meditation for sleep',
          illustration: '😴'
        },
        {
          id: '2',
          title: 'Deep sleep meditation',
          description: 'A guided meditation to help you fall into a deep, restful sleep.',
          duration: '25 min',
          category: 'Meditation for sleep',
          illustration: '🌙'
        },
        {
          id: '3',
          title: 'Sleep story: Forest walk',
          description: 'A calming story about walking through a peaceful forest at night.',
          duration: '30 min',
          category: 'Sleep stories',
          illustration: '🌲'
        },
        {
          id: '4',
          title: 'Ocean waves',
          description: 'Relaxing sounds of ocean waves to help you drift off.',
          duration: '45 min',
          category: 'Nature sounds',
          illustration: '🌊'
        }
      ],
      '2': [ // Students
        {
          id: '5',
          title: 'Study focus meditation',
          description: 'Improve your concentration and focus while studying.',
          duration: '15 min',
          category: 'Study focus',
          illustration: '📖'
        },
        {
          id: '6',
          title: 'Exam anxiety relief',
          description: 'Calm your nerves before important exams and tests.',
          duration: '10 min',
          category: 'Exam anxiety',
          illustration: '📝'
        },
        {
          id: '7',
          title: 'Learning mindfulness',
          description: 'Develop mindful awareness while learning new concepts.',
          duration: '20 min',
          category: 'Learning mindfulness',
          illustration: '🧠'
        }
      ],
      '3': [ // Life
        {
          id: '8',
          title: 'Life transitions',
          description: 'Navigate major life changes with mindfulness and grace.',
          duration: '22 min',
          category: 'Life transitions',
          illustration: '🔄'
        },
        {
          id: '9',
          title: 'Finding your purpose',
          description: 'Explore your life\'s purpose through mindful reflection.',
          duration: '18 min',
          category: 'Life purpose',
          illustration: '🎯'
        }
      ],
      '4': [ // Societal Crisis
        {
          id: '10',
          title: 'Crisis management',
          description: 'Stay centered during challenging times and uncertainty.',
          duration: '20 min',
          category: 'Crisis management',
          illustration: '🤝'
        },
        {
          id: '11',
          title: 'Community support',
          description: 'Build resilience and support others in your community.',
          duration: '25 min',
          category: 'Community support',
          illustration: '👥'
        }
      ],
      '5': [ // Getting Active
        {
          id: '12',
          title: 'Exercise mindfulness',
          description: 'Bring awareness to your physical activity and movement.',
          duration: '15 min',
          category: 'Exercise mindfulness',
          illustration: '🏃'
        },
        {
          id: '13',
          title: 'Active recovery',
          description: 'Mindful recovery after physical activity.',
          duration: '12 min',
          category: 'Active recovery',
          illustration: '🧘'
        }
      ],
      '6': [ // Friends of Medito
        {
          id: '14',
          title: 'Community session',
          description: 'Join a guided meditation with the community.',
          duration: '30 min',
          category: 'Community sessions',
          illustration: '👥'
        },
        {
          id: '15',
          title: 'Shared experiences',
          description: 'Connect with others through shared meditation experiences.',
          duration: '20 min',
          category: 'Shared experiences',
          illustration: '💫'
        }
      ]
    };

    return meditationData[topicId] || [];
  };

  const meditations = getMeditationsForTopic(topic.id);

  const getCategoryMeditations = (category: string) => {
    return meditations.filter(meditation => meditation.category === category);
  };

  const categories = [...new Set(meditations.map(m => m.category))];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{topic.title}</Text>
          <Text style={styles.headerSubtitle}>{topic.description}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>★</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((category, index) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {getCategoryMeditations(category).map((meditation) => (
              <TouchableOpacity 
                key={meditation.id}
                style={styles.meditationItem}
                onPress={() => navigation.navigate('MeditationPlayer', { meditation })}
              >
                <View style={styles.meditationIcon}>
                  <Text style={styles.meditationEmoji}>{meditation.illustration}</Text>
                </View>
                <View style={styles.meditationContent}>
                  <Text style={styles.meditationTitle}>{meditation.title}</Text>
                  <Text style={styles.meditationDescription}>{meditation.description}</Text>
                </View>
                <View style={styles.meditationDuration}>
                  <Text style={styles.durationText}>{meditation.duration}</Text>
                </View>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  actionIcon: {
    color: '#fff',
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  meditationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  meditationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  meditationEmoji: {
    fontSize: 24,
  },
  meditationContent: {
    flex: 1,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  meditationDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 18,
  },
  meditationDuration: {
    marginRight: 12,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  arrowIcon: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
