import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, shadows } from '../constants/theme';

type MealSummary = {
  name: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  calories: number;
  items: number;
};

type TodaySummaryProps = {
  meals: MealSummary[];
  onViewSavedMeals: () => void;
  onPressSummary?: () => void;
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

export const TodaySummary = ({ meals, onViewSavedMeals, onPressSummary }: TodaySummaryProps) => {
  return (
    <TouchableOpacity 
      style={styles.todaySummaryBox}
      onPress={onPressSummary}
      activeOpacity={onPressSummary ? 0.9 : 1}
      disabled={!onPressSummary}
    >
      <View style={styles.summaryHeader}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.savedMealsButton}>
          <Text style={styles.savedMealsButtonText}>📚 Saved Meals</Text>
        </View>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  todaySummaryBox: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.large,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  savedMealsButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...shadows.medium,
  },
  savedMealsButtonText: {
    color: colors.background,
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
    borderBottomColor: colors.divider,
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
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  summaryMealTime: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '500',
  },
  summaryMealStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryMealCalories: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
    letterSpacing: -0.3,
  },
  summaryMealCaloriesLabel: {
    color: colors.textTertiary,
    fontSize: 12,
    marginRight: 12,
    fontWeight: '500',
  },
  summaryMealItems: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '500',
  },
  summaryMealProgress: {
    height: 3,
    backgroundColor: colors.glassBackground,
    borderRadius: 2,
    overflow: 'hidden',
  },
  summaryMealProgressBar: {
    height: '100%',
    backgroundColor: colors.textSecondary,
    borderRadius: 2,
  },
});