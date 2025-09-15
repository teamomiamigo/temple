import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type JournalEntryScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const JournalEntryScreen = ({ navigation }: JournalEntryScreenProps) => {
  const [entryText, setEntryText] = useState('');
  const [showActionBar, setShowActionBar] = useState(false);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleSaveEntry = () => {
    // Save entry logic here
    console.log('Saving entry:', entryText);
    navigation.goBack();
  };

  const handleAddLocation = () => {
    // Add location logic here
    console.log('Adding location');
  };

  const handleAddPhoto = () => {
    // Add photo logic here
    console.log('Adding photo');
  };

  const handleAddTemplate = () => {
    // Add template logic here
    console.log('Adding template');
  };

  const handleAddSuggestion = () => {
    // Add suggestion logic here
    console.log('Adding suggestion');
  };

  const handleAddAudio = () => {
    // Add audio logic here
    console.log('Adding audio');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateTime}>{formattedDate}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerIcon}>⋯</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneButton} onPress={handleSaveEntry}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Entry Area */}
      <ScrollView style={styles.entryArea} contentContainerStyle={styles.entryContent}>
        <View style={styles.entryHeader}>
          <Text style={styles.journalLabel}>Journal</Text>
          <Text style={styles.journalDot}>•</Text>
          <TouchableOpacity onPress={handleAddLocation}>
            <Text style={styles.locationPrompt}>Add location?</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.textInput}
          placeholder="Start writing your thoughts..."
          placeholderTextColor="#999"
          value={entryText}
          onChangeText={setEntryText}
          multiline
          textAlignVertical="top"
          onFocus={() => setShowActionBar(true)}
          onBlur={() => setShowActionBar(false)}
        />
      </ScrollView>

      {/* Action Bar */}
      {showActionBar && (
        <View style={styles.actionBar}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionItem} onPress={handleAddPhoto}>
              <Text style={styles.actionIcon}>📷</Text>
              <Text style={styles.actionLabel}>Photos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleAddTemplate}>
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={styles.actionLabel}>Templates</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleAddSuggestion}>
              <Text style={styles.actionIcon}>💡</Text>
              <Text style={styles.actionLabel}>Suggestions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem} onPress={handleAddAudio}>
              <Text style={styles.actionIcon}>🎤</Text>
              <Text style={styles.actionLabel}>Audio</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreIcon}>⌄</Text>
            <Text style={styles.moreText}>More</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Keyboard Area */}
      <View style={styles.keyboardArea}>
        <View style={styles.predictiveText}>
          <TouchableOpacity style={styles.predictiveItem}>
            <Text style={styles.predictiveText}>I</Text>
          </TouchableOpacity>
          <View style={styles.predictiveDivider} />
          <TouchableOpacity style={styles.predictiveItem}>
            <Text style={styles.predictiveText}>The</Text>
          </TouchableOpacity>
          <View style={styles.predictiveDivider} />
          <TouchableOpacity style={styles.predictiveItem}>
            <Text style={styles.predictiveText}>I'm</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.keyboard}>
          {/* QWERTY Row */}
          <View style={styles.keyboardRow}>
            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
              <TouchableOpacity key={key} style={styles.key}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* ASDF Row */}
          <View style={styles.keyboardRow}>
            {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
              <TouchableOpacity key={key} style={styles.key}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* ZXCV Row */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={styles.specialKey}>
              <Text style={styles.specialKeyText}>⇧</Text>
            </TouchableOpacity>
            {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
              <TouchableOpacity key={key} style={styles.key}>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.specialKey}>
              <Text style={styles.specialKeyText}>⌫</Text>
            </TouchableOpacity>
          </View>
          
          {/* Bottom Row */}
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={styles.specialKey}>
              <Text style={styles.specialKeyText}>123</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.spaceKey}>
              <Text style={styles.spaceKeyText}>space</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialKey}>
              <Text style={styles.specialKeyText}>return</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.keyboardBottom}>
          <TouchableOpacity style={styles.keyboardBottomButton}>
            <Text style={styles.keyboardBottomIcon}>😊</Text>
          </TouchableOpacity>
          <View style={styles.homeIndicator} />
          <TouchableOpacity style={styles.keyboardBottomButton}>
            <Text style={styles.keyboardBottomIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
    color: '#fff',
    fontSize: 18,
  },
  doneButton: {
    padding: 8,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  entryArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  entryContent: {
    padding: 20,
    minHeight: '100%',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  journalLabel: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  journalDot: {
    color: '#333',
    fontSize: 16,
    marginHorizontal: 8,
  },
  locationPrompt: {
    color: '#333',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    minHeight: 200,
  },
  actionBar: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: '#666',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  moreIcon: {
    fontSize: 16,
    color: '#666',
  },
  moreText: {
    fontSize: 14,
    color: '#666',
  },
  keyboardArea: {
    backgroundColor: '#f0f0f0',
  },
  predictiveText: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  predictiveItem: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  predictiveText: {
    fontSize: 16,
    color: '#007AFF',
  },
  predictiveDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#ddd',
  },
  keyboard: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  key: {
    width: 32,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  keyText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  specialKey: {
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    paddingHorizontal: 8,
  },
  specialKeyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  spaceKey: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  spaceKeyText: {
    fontSize: 14,
    color: '#666',
  },
  keyboardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  keyboardBottomButton: {
    padding: 8,
  },
  keyboardBottomIcon: {
    fontSize: 20,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
  },
});
