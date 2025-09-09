import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SavedMeal, useNutritionStore } from '../stores/nutritionStore';

type SavedMealsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const SavedMealsScreen = ({ navigation }: SavedMealsScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const savedMeals = useNutritionStore((state) => state.savedMeals);
  const useSavedMeal = useNutritionStore((state) => state.useSavedMeal);
  const updateSavedMeal = useNutritionStore((state) => state.updateSavedMeal);
  const deleteSavedMeal = useNutritionStore((state) => state.deleteSavedMeal);

  const filteredMeals = savedMeals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (meal.description && meal.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUseMeal = (meal: SavedMeal) => {
    Alert.alert(
      'Use Saved Meal',
      `Add "${meal.name}" to which meal?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Breakfast', onPress: () => useSavedMeal(meal.id, 'breakfast') },
        { text: 'Lunch', onPress: () => useSavedMeal(meal.id, 'lunch') },
        { text: 'Dinner', onPress: () => useSavedMeal(meal.id, 'dinner') },
        { text: 'Snacks', onPress: () => useSavedMeal(meal.id, 'snacks') },
      ]
    );
  };

  const handleEditMeal = (meal: SavedMeal) => {
    Alert.prompt(
      'Edit Meal Name',
      'Enter a new name for this meal:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (newName) => {
            if (newName && newName.trim()) {
              updateSavedMeal(meal.id, { name: newName.trim() });
            }
          },
        },
      ],
      'plain-text',
      meal.name
    );
  };

  const handleDeleteMeal = (meal: SavedMeal) => {
    Alert.alert(
      'Delete Meal',
      `Are you sure you want to delete "${meal.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSavedMeal(meal.id),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Meals</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Search */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved meals..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Saved Meals List */}
        {filteredMeals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Saved Meals</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No meals match your search.' : 'Create meal templates to see them here.'}
            </Text>
          </View>
        ) : (
          <View style={styles.mealsList}>
            {filteredMeals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealDescription}>{meal.description}</Text>
                    <Text style={styles.mealStats}>
                      {meal.totalCalories} cal • {meal.totalProtein}g protein • {meal.useCount} uses
                    </Text>
                    <Text style={styles.mealDate}>
                      Created: {formatDate(meal.createdAt)}
                      {meal.lastUsed && ` • Last used: ${formatDate(meal.lastUsed)}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.mealActions}>
                  <TouchableOpacity
                    style={styles.useButton}
                    onPress={() => handleUseMeal(meal)}
                  >
                    <Text style={styles.useButtonText}>Use</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditMeal(meal)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMeal(meal)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  mealsList: {
    gap: 16,
  },
  mealCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  mealHeader: {
    marginBottom: 16,
  },
  mealInfo: {
    gap: 4,
  },
  mealName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealDescription: {
    color: '#999',
    fontSize: 14,
  },
  mealStats: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  mealDate: {
    color: '#666',
    fontSize: 12,
  },
  mealActions: {
    flexDirection: 'row',
    gap: 12,
  },
  useButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  useButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
