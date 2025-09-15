import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IOSTile } from './IOSTile';

type MealSummary = {
  name: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  calories: number;
  items: number;
};

type TodaySummaryProps = {
  meals: MealSummary[];
  onViewSavedMeals: () => void;
};

// Helper functions for meal display
const getMealEmoji = (mealName: string) => {
  switch (mealName) {
    case 'breakfast': return '🧇';
    case 'lunch': return '☀️';
    case 'dinner': return '🌙';
    case 'snacks': return '🍿';
    default: return '🍽️';
  }
};

const getMealDisplayName = (mealName: string) => {
  switch (mealName) {
    case 'breakfast': return 'Breakfast';
    case 'lunch': return 'Lunch';
    case 'dinner': return 'Dinner';
    case 'snacks': return 'Snacks';
    default: return mealName;
  }
};

const getMealTimeRange = (mealName: string) => {
  switch (mealName) {
    case 'breakfast': return '7:00 AM - 11:00 AM';
    case 'lunch': return '11:00 AM - 4:00 PM';
    case 'dinner': return '4:00 PM - 9:00 PM';
    case 'snacks': return '9:00 PM - 7:00 AM';
    default: return '';
  }
};

export const TodaySummary = ({ meals, onViewSavedMeals }: TodaySummaryProps) => {
  return (
    <IOSTile style={styles.todaySummaryBox} onPress={() => {}}>
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
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  savedMealsButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  savedMealsButtonText: {
    color: '#fff',
    fontSize: 14,
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryMealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryMealEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  summaryMealInfo: {
    flex: 1,
  },
  summaryMealName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  summaryMealTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
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
    letterSpacing: -0.3,
  },
  summaryMealCaloriesLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginRight: 12,
    fontWeight: '500',
  },
  summaryMealItems: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  summaryMealProgress: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  summaryMealProgressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
});