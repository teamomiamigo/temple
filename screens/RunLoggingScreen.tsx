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

type RunLoggingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const RunLoggingScreen = ({ navigation }: RunLoggingScreenProps) => {
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [pace, setPace] = useState('');
  const [notes, setNotes] = useState('');

  const handleSaveRun = () => {
    // Save run logic here
    console.log('Saving run:', { distance, duration, pace, notes });
    navigation.goBack();
  };

  const calculatePace = () => {
    if (distance && duration) {
      const distanceNum = parseFloat(distance);
      const durationNum = parseFloat(duration);
      if (distanceNum > 0 && durationNum > 0) {
        const paceValue = durationNum / distanceNum;
        setPace(paceValue.toFixed(2));
      }
    }
  };

  React.useEffect(() => {
    calculatePace();
  }, [distance, duration]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Log Run</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Distance Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="5.2"
              placeholderTextColor="#666"
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
            />
            <Text style={styles.inputUnit}>km</Text>
          </View>
        </View>

        {/* Duration Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="25"
              placeholderTextColor="#666"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
            <Text style={styles.inputUnit}>minutes</Text>
          </View>
        </View>

        {/* Pace Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pace</Text>
          <View style={styles.paceContainer}>
            <Text style={styles.paceValue}>{pace || '0.00'}</Text>
            <Text style={styles.paceUnit}>min/km</Text>
          </View>
        </View>

        {/* Run Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Run Type</Text>
          <View style={styles.runTypesGrid}>
            <TouchableOpacity style={styles.runTypeCard}>
              <Text style={styles.runTypeEmoji}>🏃</Text>
              <Text style={styles.runTypeTitle}>Easy Run</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.runTypeCard}>
              <Text style={styles.runTypeEmoji}>⚡</Text>
              <Text style={styles.runTypeTitle}>Tempo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.runTypeCard}>
              <Text style={styles.runTypeEmoji}>🔥</Text>
              <Text style={styles.runTypeTitle}>Intervals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.runTypeCard}>
              <Text style={styles.runTypeEmoji}>🏔️</Text>
              <Text style={styles.runTypeTitle}>Trail</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How did the run feel? Weather conditions?"
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
              <Text style={styles.statLabel}>Calories</Text>
              <Text style={styles.statValue}>
                ~{distance ? Math.round(parseFloat(distance) * 60) : 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Avg Speed</Text>
              <Text style={styles.statValue}>
                {distance && duration ? (parseFloat(distance) / (parseFloat(duration) / 60)).toFixed(1) : '0.0'} km/h
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRun}>
          <Text style={styles.saveButtonText}>Save Run</Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
  },
  input: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  inputUnit: {
    color: '#999',
    fontSize: 16,
    marginLeft: 8,
  },
  paceContainer: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  paceValue: {
    color: '#007AFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  paceUnit: {
    color: '#999',
    fontSize: 16,
    marginTop: 4,
  },
  runTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  runTypeCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    alignItems: 'center',
    marginBottom: 12,
  },
  runTypeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  runTypeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 16,
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
