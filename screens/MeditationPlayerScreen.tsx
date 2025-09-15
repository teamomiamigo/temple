import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type MeditationPlayerScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, 'MeditationPlayer'>;
};

export const MeditationPlayerScreen = ({ navigation, route }: MeditationPlayerScreenProps) => {
  const { meditation } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState('Will');

  const speakers = ['Will', 'Sarah', 'David', 'Emma'];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
    console.log(isPlaying ? 'Pausing meditation' : 'Playing meditation');
  };

  const handleSpeakerChange = () => {
    // TODO: Implement speaker selection modal
    console.log('Change speaker');
  };

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
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>★</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>{meditation.illustration}</Text>
          </View>
        </View>

        {/* Meditation Info */}
        <View style={styles.meditationInfo}>
          <Text style={styles.meditationTitle}>{meditation.title}</Text>
          <Text style={styles.meditationDescription}>{meditation.description}</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* Speaker Selection */}
          <TouchableOpacity style={styles.controlCard} onPress={handleSpeakerChange}>
            <View style={styles.controlIcon}>
              <Text style={styles.controlEmoji}>👤</Text>
            </View>
            <View style={styles.controlContent}>
              <Text style={styles.controlLabel}>Speaker</Text>
              <Text style={styles.controlValue}>{selectedSpeaker}</Text>
            </View>
            <Text style={styles.controlArrow}>⌄</Text>
          </TouchableOpacity>

          {/* Duration */}
          <View style={styles.controlCard}>
            <View style={styles.controlIcon}>
              <Text style={styles.controlEmoji}>⏱️</Text>
            </View>
            <View style={styles.controlContent}>
              <Text style={styles.controlLabel}>Duration</Text>
              <Text style={styles.controlValue}>{meditation.duration}</Text>
            </View>
          </View>
        </View>

        {/* Play Button */}
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>
            {isPlaying 
              ? 'Meditation is playing...' 
              : 'Tap play to begin your meditation session'
            }
          </Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>↗</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>★</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
  illustrationContainer: {
    width: width - 40,
    height: height * 0.35,
    marginBottom: 32,
  },
  illustration: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  meditationInfo: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  meditationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  meditationDescription: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  controlsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  controlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  controlIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  controlEmoji: {
    fontSize: 20,
  },
  controlContent: {
    flex: 1,
  },
  controlLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  controlValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  controlArrow: {
    color: '#666',
    fontSize: 16,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    fontSize: 32,
    marginLeft: 4, // Slight adjustment for play icon centering
  },
  additionalInfo: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    padding: 12,
  },
  navIcon: {
    color: '#fff',
    fontSize: 20,
  },
});
