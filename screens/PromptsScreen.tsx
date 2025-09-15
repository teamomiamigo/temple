import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PromptsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const PromptsScreen = ({ navigation }: PromptsScreenProps) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'my-prompts'>('gallery');

  const recommendedPrompts = [
    {
      id: '1',
      text: 'What am I grateful for today?',
      category: 'Gratitude',
      icon: '❤️',
    },
    {
      id: '2',
      text: 'What did I learn about myself today?',
      category: 'Reflection',
      icon: '🤔',
    },
    {
      id: '3',
      text: 'How did I show kindness today?',
      category: 'Kindness',
      icon: '🤝',
    },
    {
      id: '4',
      text: 'What made me smile today?',
      category: 'Joy',
      icon: '😊',
    },
  ];

  const promptPacks = [
    {
      id: '1',
      name: 'Gratitude',
      icon: '❤️',
      description: 'Focus on appreciation and thankfulness',
    },
    {
      id: '2',
      name: 'Reflection',
      icon: '🤔',
      description: 'Deep thinking and self-discovery',
    },
    {
      id: '3',
      name: 'Mindfulness',
      icon: '🧘',
      description: 'Present moment awareness',
    },
    {
      id: '4',
      name: 'Growth',
      icon: '🌱',
      description: 'Personal development and learning',
    },
    {
      id: '5',
      name: 'Relationships',
      icon: '👥',
      description: 'Connections with others',
    },
    {
      id: '6',
      name: 'Goals',
      icon: '🎯',
      description: 'Aspirations and achievements',
    },
  ];

  const handlePromptSelect = (prompt: any) => {
    // Navigate to journal entry with the selected prompt
    navigation.navigate('JournalEntry', { prompt });
  };

  const handlePromptPackSelect = (pack: any) => {
    // Navigate to pack details or show prompts from that pack
    console.log('Selected pack:', pack);
  };

  const handleShuffle = () => {
    // Shuffle recommended prompts
    console.log('Shuffling prompts');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Prompts</Text>
          
          <View style={styles.tabBar}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'gallery' && styles.tabActive]}
              onPress={() => setActiveTab('gallery')}
            >
              <Text style={[styles.tabText, activeTab === 'gallery' && styles.tabTextActive]}>
                Gallery
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'my-prompts' && styles.tabActive]}
              onPress={() => setActiveTab('my-prompts')}
            >
              <Text style={[styles.tabText, activeTab === 'my-prompts' && styles.tabTextActive]}>
                My Prompts
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'gallery' ? (
          <>
            {/* Recommended Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommended</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.promptsScroll}
                contentContainerStyle={styles.promptsScrollContent}
              >
                {recommendedPrompts.map((prompt) => (
                  <TouchableOpacity 
                    key={prompt.id} 
                    style={styles.promptCard}
                    onPress={() => handlePromptSelect(prompt)}
                  >
                    <View style={styles.promptCardHeader}>
                      <TouchableOpacity style={styles.shuffleButton} onPress={handleShuffle}>
                        <Text style={styles.shuffleIcon}>🔄</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.promptText}>{prompt.text}</Text>
                    
                    <View style={styles.promptFooter}>
                      <View style={styles.promptCategory}>
                        <Text style={styles.promptCategoryIcon}>{prompt.icon}</Text>
                        <Text style={styles.promptCategoryText}>{prompt.category}</Text>
                      </View>
                      <Text style={styles.promptArrow}>›</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Prompt Packs Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prompt Packs</Text>
              
              <View style={styles.packsList}>
                {promptPacks.map((pack) => (
                  <TouchableOpacity 
                    key={pack.id} 
                    style={styles.packItem}
                    onPress={() => handlePromptPackSelect(pack)}
                  >
                    <View style={styles.packIcon}>
                      <Text style={styles.packIconText}>{pack.icon}</Text>
                    </View>
                    
                    <View style={styles.packContent}>
                      <Text style={styles.packName}>{pack.name}</Text>
                      <Text style={styles.packDescription}>{pack.description}</Text>
                    </View>
                    
                    <Text style={styles.packArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* My Prompts Tab */
          <View style={styles.section}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>My Prompts</Text>
              <Text style={styles.emptyStateSubtitle}>
                Create and save your own custom prompts here
              </Text>
              <TouchableOpacity style={styles.createPromptButton}>
                <Text style={styles.createPromptButtonText}>Create Prompt</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('MindMain')}
        >
          <Text style={styles.bottomNavIcon}>📖</Text>
          <Text style={styles.bottomNavLabel}>Journals</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.bottomNavItem, styles.bottomNavItemActive]}>
          <Text style={[styles.bottomNavIcon, styles.bottomNavIconActive]}>❓</Text>
          <Text style={[styles.bottomNavLabel, styles.bottomNavLabelActive]}>Prompts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <Text style={styles.bottomNavIcon}>⋯</Text>
          <Text style={styles.bottomNavLabel}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  promptsScroll: {
    marginHorizontal: -20,
  },
  promptsScrollContent: {
    paddingHorizontal: 20,
  },
  promptCard: {
    width: width * 0.8,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  promptCardHeader: {
    alignItems: 'flex-end',
  },
  shuffleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleIcon: {
    fontSize: 16,
    color: '#fff',
  },
  promptText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
  },
  promptFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promptCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  promptCategoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  promptCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  promptArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  packsList: {
    gap: 12,
  },
  packItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  packIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  packIconText: {
    fontSize: 24,
  },
  packContent: {
    flex: 1,
  },
  packName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  packDescription: {
    fontSize: 14,
    color: '#666',
  },
  packArrow: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createPromptButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  createPromptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
  },
  bottomNavItemActive: {
    // Active state styling
  },
  bottomNavIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  bottomNavIconActive: {
    // Active icon styling
  },
  bottomNavLabel: {
    fontSize: 12,
    color: '#666',
  },
  bottomNavLabelActive: {
    color: '#000',
    fontWeight: 'bold',
  },
});
