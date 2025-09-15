import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IOSTile } from './IOSTile';
import { getMealDisplayName, getMealEmoji, getMealTimeRange } from '../utils/mealUtils';

interface Meal {
  name: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  calories: number;
  items: number;
}

interface TodaySummaryProps {
  meals: Meal[];
  onViewSavedMeals?: () => void;
  onPress?: () => void;
}

export const TodaySummary: React.FC<TodaySummaryProps> = ({
  meals,
  onViewSavedMeals,
  onPress
}) => {
  return (
    <IOSTile style={styles.todaySummaryBox} onPress={onPress}>
      <View style={styles.summaryHeader}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <IOSTile onPress={onViewSavedMeals} style={styles.savedMealsButton}>
          <Text style={styles.savedMealsButtonText}>📚 Saved Meals</Text>
        </IOSTile>
      </View>
      
      <View style={styles.summaryGrid}>
        {meals.map((meal, index) => (
          <View key={meal.name} style={[styles.summarySection, index < 2 && styles.summarySectionBorderBottom]}>
            <View style={styles.summaryMealHeader}>
              <Text style={styles.summaryMealEmoji}>{getMealEmoji(meal.name)}</Text>
              <View style={styles.summaryMealInfo}>
                <Text style={styles.summaryMealName}>{getMealDisplayName(meal.name)}</Text>
                <Text style={styles.summaryMealTime}>{getMealTimeRange(meal.name)}</Text>
              </View>
            </View>
            <View style={styles.summaryMealStats}>
              <Text style={styles.summaryMealCalories}>{meal.calories}</Text>
              <Text style={styles.summaryMealCaloriesLabel}>cal</Text>
              <Text style={styles.summaryMealItems}>{meal.items} items</Text>
            </View>
            {meal.items > 0 && (
              <View style={styles.summaryMealProgress}>
                <View style={[styles.summaryMealProgressBar, { width: `${Math.min(100, (meal.calories / 500) * 100)}%` }]} />
              </View>
            )}
          </View>
        ))}
      </View>
    </IOSTile>
  );
};

const styles = StyleSheet.create({
  todaySummaryBox: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  savedMealsButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  savedMealsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  summarySection: {
    width: '50%',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  summarySectionBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  summaryMealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryMealEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  summaryMealInfo: {
    flex: 1,
  },
  summaryMealName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  summaryMealTime: {
    color: '#666',
    fontSize: 11,
  },
  summaryMealStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryMealCalories: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  summaryMealCaloriesLabel: {
    color: '#666',
    fontSize: 10,
    marginRight: 8,
  },
  summaryMealItems: {
    color: '#666',
    fontSize: 11,
  },
  summaryMealProgress: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  summaryMealProgressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
});
