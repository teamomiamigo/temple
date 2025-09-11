import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type QuickWorkoutScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const QuickWorkoutScreen = ({ navigation }: QuickWorkoutScreenProps) => {
  const [workoutType, setWorkoutType] = useState<'strength' | 'cardio' | 'run' | 'other'>('strength');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const workoutTypes = [
    { id: 'strength', emoji: '🏋️', title: 'Strength Training', color: '#FF6B35' },
    { id: 'cardio', emoji: '❤️', title: 'Cardio', color: '#4ECDC4' },
    { id: 'run', emoji: '🏃', title: 'Running', color: '#45B7D1' },
    { id: 'other', emoji: '⚡', title: 'Other', color: '#96CEB4' },
  ];

  const handleSaveWorkout = () => {
    // Save workout logic here
    console.log('Saving workout:', { workoutType, duration, notes });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Quick Log</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Workout Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Type</Text>
          <View style={styles.workoutTypesGrid}>
            {workoutTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.workoutTypeCard,
                  workoutType === type.id && { backgroundColor: type.color },
                ]}
                onPress={() => setWorkoutType(type.id as any)}
              >
                <Text style={styles.workoutTypeEmoji}>{type.emoji}</Text>
                <Text style={[
                  styles.workoutTypeTitle,
                  workoutType === type.id && { color: '#fff' }
                ]}>
                  {type.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationContainer}>
            <TextInput
              style={styles.durationInput}
              placeholder="45"
              placeholderTextColor="#666"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            <Text style={styles.durationUnit}>minutes</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How did it feel? Any highlights?"
            placeholderTextColor="#666"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Calories Burned</Text>
              <Text style={styles.statValue}>~{duration ? Math.round(parseInt(duration) * 8) : 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Intensity</Text>
              <Text style={styles.statValue}>Moderate</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workoutTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workoutTypeCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  workoutTypeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  workoutTypeTitle: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
  },
  durationInput: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  durationUnit: {
    color: '#999',
    fontSize: 16,
    marginLeft: 8,
  },
  notesInput: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
