import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FoodEntry } from '../../types/nutrition';
import { getPlatformColor } from '../../utils/platformColors';

interface FoodLogRowProps {
  food: FoodEntry;
  onPress?: () => void;
  showMeal?: boolean;
}

export const FoodLogRow: React.FC<FoodLogRowProps> = ({
  food,
  onPress,
  showMeal = false,
}) => {
  const { title, calories, meal, note, macros } = food;

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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.content}>
        {/* Left side - Food info */}
        <View style={styles.foodInfo}>
          {showMeal && (
            <View style={styles.mealBadge}>
              <Text style={styles.mealEmoji}>{getMealEmoji(meal)}</Text>
              <Text style={styles.mealName}>{getMealDisplayName(meal)}</Text>
            </View>
          )}
          
          <Text style={styles.foodTitle}>{title}</Text>
          
          {note && (
            <Text style={styles.foodNote}>{note}</Text>
          )}
          
          {macros && (
            <View style={styles.macroChips}>
              <View style={[styles.macroChip, styles.proteinChip]}>
                <Text style={styles.macroChipText}>
                  P: {Math.round(macros.protein)}g
                </Text>
              </View>
              <View style={[styles.macroChip, styles.carbsChip]}>
                <Text style={styles.macroChipText}>
                  C: {Math.round(macros.carbs)}g
                </Text>
              </View>
              <View style={[styles.macroChip, styles.fatChip]}>
                <Text style={styles.macroChipText}>
                  F: {Math.round(macros.fat)}g
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Right side - Calories and chevron */}
        <View style={styles.rightSide}>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesValue}>{Math.round(calories)}</Text>
            <Text style={styles.caloriesLabel}>cal</Text>
          </View>
          
          {onPress && (
            <Text style={styles.chevron}>›</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: getPlatformColor('systemBackground'),
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  foodInfo: {
    flex: 1,
    marginRight: 12,
  },
  mealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  mealName: {
    fontSize: 12,
    fontWeight: '500',
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: getPlatformColor('label'),
    allowFontScaling: true,
    marginBottom: 2,
  },
  foodNote: {
    fontSize: 14,
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  macroChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  macroChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proteinChip: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
  },
  carbsChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  fatChip: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  macroChipText: {
    fontSize: 10,
    fontWeight: '500',
    color: getPlatformColor('label'),
    allowFontScaling: true,
  },
  rightSide: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  caloriesContainer: {
    alignItems: 'center',
    marginRight: 8,
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: '700',
    color: getPlatformColor('label'),
    allowFontScaling: true,
  },
  caloriesLabel: {
    fontSize: 12,
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
  },
  chevron: {
    fontSize: 16,
    color: getPlatformColor('tertiaryLabel'),
    fontWeight: '300',
  },
});

