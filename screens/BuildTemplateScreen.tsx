import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Exercise, useTemplateStore } from '../stores/templateStore';

type BuildTemplateScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params?: {
      templateId?: string;
    };
  };
};

export const BuildTemplateScreen = ({ navigation, route }: BuildTemplateScreenProps) => {
  // Get template ID from route params if it exists (for editing)
  const templateId = route.params?.templateId;
  
  // Get store actions and data using separate selectors to keep snapshots stable
  const templates = useTemplateStore((state) => state.templates);
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const updateTemplate = useTemplateStore((state) => state.updateTemplate);
  
  // Find template by ID if we're editing
  const existingTemplate = templateId 
    ? templates.find(t => t.id === templateId) 
    : undefined;

  // Initialize state with existing template data if available
  const [templateName, setTemplateName] = useState(existingTemplate?.name || 'New Template');
  const [exercises, setExercises] = useState<Exercise[]>(
    existingTemplate?.exercises ? 
    [...existingTemplate.exercises] : // Create a copy to avoid mutating the store directly
    []
  );
  const [showExerciseForm, setShowExerciseForm] = useState(exercises.length > 0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<TextInput>(null);
  
  const addExercise = () => {
    setExercises([...exercises, { 
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: 10,
      weight: 0
    }]);
    setShowExerciseForm(true);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === id ? { ...exercise, [field]: value } : exercise
    ));
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const saveTemplate = () => {
    // Validate that there's at least one exercise
    if (exercises.length === 0) {
      Alert.alert("Can't Save", "Please add at least one exercise to your template.");
      return;
    }

    // Validate that all exercises have names
    const hasUnnamedExercise = exercises.some(ex => !ex.name.trim());
    if (hasUnnamedExercise) {
      Alert.alert("Can't Save", "Please name all exercises in your template.");
      return;
    }

    if (templateId && existingTemplate) {
      // Update existing template
      updateTemplate(templateId, {
        name: templateName,
        exercises: exercises,
      });
    } else {
      // Create new template
      addTemplate({
        name: templateName,
        exercises: exercises,
      });
    }

    // Navigate back
    navigation.goBack();
  };

  const handleTitlePress = () => {
    setIsEditingTitle(true);
    // Focus the input after a short delay to allow the input to render
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    // If user deleted the entire name, reset to default
    if (!templateName.trim()) {
      setTemplateName(existingTemplate?.name || 'New Template');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top section with title */}
      <View style={styles.topSection}>
        <Text style={styles.topTitle}>{templateName}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          {isEditingTitle ? (
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              value={templateName}
              onChangeText={setTemplateName}
              onBlur={handleTitleBlur}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <TouchableOpacity onPress={handleTitlePress} activeOpacity={0.7}>
              <Text style={styles.titleText}>{templateName}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {!showExerciseForm ? (
          <TouchableOpacity style={styles.addExercisesButton} onPress={addExercise}>
            <Text style={styles.addExercisesButtonText}>Add Exercises</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.exercisesSection}>
            {exercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.exerciseHeader}>
                  <TextInput 
                    style={styles.exerciseNameInput}
                    value={exercise.name}
                    onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
                    placeholder="Exercise name"
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity 
                    onPress={() => deleteExercise(exercise.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.exerciseDetails}>
                  <View style={styles.exerciseDetailItem}>
                    <Text style={styles.detailLabel}>Sets</Text>
                    <TextInput 
                      style={styles.detailInput}
                      value={exercise.sets.toString()}
                      onChangeText={(value) => updateExercise(exercise.id, 'sets', parseInt(value) || 0)}
                      keyboardType="numeric"
                      placeholderTextColor="#666"
                    />
                  </View>
                  
                  <View style={styles.exerciseDetailItem}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <TextInput 
                      style={styles.detailInput}
                      value={exercise.reps.toString()}
                      onChangeText={(value) => updateExercise(exercise.id, 'reps', parseInt(value) || 0)}
                      keyboardType="numeric"
                      placeholderTextColor="#666"
                    />
                  </View>
                  
                  <View style={styles.exerciseDetailItem}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <TextInput 
                      style={styles.detailInput}
                      value={exercise.weight.toString()}
                      onChangeText={(value) => updateExercise(exercise.id, 'weight', parseFloat(value) || 0)}
                      keyboardType="numeric"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>
              </View>
            ))}
            
            <TouchableOpacity style={styles.addMoreExerciseButton} onPress={addExercise}>
              <Text style={styles.addMoreExerciseButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Footer with navigation buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={saveTemplate} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  topTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  titleText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  titleInput: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    padding: 0,
    minWidth: 250,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  addExercisesButton: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addExercisesButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '500',
  },
  exercisesSection: {
    marginBottom: 20,
  },
  exerciseItem: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNameInput: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    color: '#ff4f4f',
    fontSize: 24,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseDetailItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  detailLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  detailInput: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 4,
    padding: 8,
    textAlign: 'center',
  },
  addMoreExerciseButton: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addMoreExerciseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.7,
  },
}); 