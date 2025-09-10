import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { IOSTile } from '../components/IOSTile';
import { Template, useTemplateStore } from '../stores/templateStore';

type BodyScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const BodyScreen = ({ navigation }: BodyScreenProps) => {
  const templates      = useTemplateStore(state => state.templates);
  const addTemplate    = useTemplateStore(state => state.addTemplate);
  const updateTemplate = useTemplateStore(state => state.updateTemplate);

  const renderTemplateCard = (template: Template) => {
    return (
      <IOSTile
        key={template.id}
        style={styles.templateCard}
        onPress={() => {
          // Navigate to BuildTemplateScreen with the template data for editing
          navigation.navigate('BuildTemplate', { templateId: template.id });
        }}
      >
        <Text style={styles.templateCardText}>{template.name}</Text>
        <Text style={styles.templateCardDetails}>
          {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
        </Text>
      </IOSTile>
    );
  };

  const handleAddTemplatePress = () => {
    navigation.navigate('BuildTemplate');
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Let's Workout.</Text>
        <IOSTile style={styles.beginButton} onPress={() => {}}>
          <Text style={styles.beginButtonText}>Begin</Text>
        </IOSTile>
        <View style={styles.templatesHeaderRow}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <View style={styles.templatesActions}>
            <IOSTile 
              style={styles.templateButton}
              onPress={handleAddTemplatePress}
            >
              <Text style={styles.templateButtonText}>+ Template</Text>
            </IOSTile>
            <IOSTile style={styles.moreButton} onPress={() => {}}>
              <Text style={styles.moreButtonText}>...</Text>
            </IOSTile>
          </View>
        </View>

        {templates.length === 0 ? (
          <IOSTile 
            style={styles.addTemplateCard}
            onPress={() => navigation.navigate('BuildTemplate')}
          >
            <Text style={styles.addTemplateCardText}>add a template:</Text>
          </IOSTile>
        ) : (
          <View style={styles.templatesGrid}>
            {templates.map(renderTemplateCard)}
          </View>
        )}

        <View style={styles.pastWorkoutsHeaderRow}>
          <Text style={styles.pastWorkoutsTitle}>Past Workouts</Text>
          <View style={styles.pastWorkoutsActions}>
            <IOSTile style={styles.workoutButton} onPress={() => {}}>
              <Text style={styles.workoutButtonText}>+ Workout</Text>
            </IOSTile>
            <IOSTile style={styles.moreButton} onPress={() => {}}>
              <Text style={styles.moreButtonText}>...</Text>
            </IOSTile>
          </View>
        </View>

        <IOSTile 
          style={styles.addWorkoutCard}
          onPress={() => {}}
        >
          <Text style={styles.addWorkoutCardText}>add a workout</Text>
        </IOSTile>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 32 - 12) / 2; // Screen width - padding - gap between cards

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  beginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  beginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
  templatesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  templatesTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  templatesActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  templateButton: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  templateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  moreButton: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  moreButtonText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },
  addTemplateCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    width: '48%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addTemplateCardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  templateCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    width: cardWidth,
    height: 150,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  templateCardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  templateCardDetails: {
    color: '#999',
    fontSize: 14,
  },
  pastWorkoutsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 12,
  },
  pastWorkoutsTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  pastWorkoutsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  workoutButton: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  workoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  addWorkoutCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    width: '48%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addWorkoutCardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 