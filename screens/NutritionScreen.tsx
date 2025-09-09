import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnimatedPlusButton } from '../components/AnimatedPlusButton';
import { useNutritionStore } from '../stores/nutritionStore';
import { getMealByTime, getMealDisplayName, getMealEmoji, getMealTimeRange, isCurrentMealTime } from '../utils/mealUtils';

type NutritionScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const NutritionScreen = ({ navigation }: NutritionScreenProps) => {
  const goals = useNutritionStore((state) => state.goals);
  const todayNutrition = useNutritionStore((state) => state.getTodayNutrition());
  
  // Calculate remaining macros
  const caloriesLeft = Math.max(0, goals.calories - (todayNutrition?.totalCalories || 0));
  const proteinLeft = Math.max(0, goals.protein - (todayNutrition?.totalProtein || 0));
  const carbsLeft = Math.max(0, goals.carbs - (todayNutrition?.totalCarbs || 0));
  const fatLeft = Math.max(0, goals.fat - (todayNutrition?.totalFat || 0));
  
  // Get current meal based on time
  const currentMeal = getMealByTime();
  
  const handleLogMeal = () => {
    navigation.navigate('LogMeal', { mealName: currentMeal });
  };
  
  const handleLogItem = () => {
    navigation.navigate('LogItem', { mealName: currentMeal });
  };
  
  const handleViewSavedMeals = () => {
    navigation.navigate('SavedMeals');
  };
  
  const getMealCalories = (mealName: string) => {
    if (!todayNutrition) return 0;
    const meal = todayNutrition.meals.find(m => m.name === mealName);
    return meal ? meal.entries.reduce((sum, entry) => sum + entry.calories, 0) : 0;
  };
  
  const getMealItems = (mealName: string) => {
    if (!todayNutrition) return [];
    const meal = todayNutrition.meals.find(m => m.name === mealName);
    return meal ? meal.entries : [];
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Let's Eat Healthy.</Text>

        {/* Calories summary card */}
        <View style={styles.caloriesCard}>
          <View>
            <Text style={styles.caloriesValue}>{caloriesLeft}</Text>
            <Text style={styles.caloriesLabel}>Calories left</Text>
          </View>
          <View style={styles.caloriesIconCircle}>
            {/* A flame emoji as placeholder icon */}
            <Text style={styles.flameIcon}>🔥</Text>
          </View>
        </View>

        {/* Macro cards */}
        <View style={styles.macroRow}>
          <View style={styles.macroCard}>
            <Text style={styles.macroValue}>{proteinLeft}g</Text>
            <Text style={styles.macroLabel}>Protein left</Text>
          </View>
          <View style={styles.macroCard}>
            <Text style={styles.macroValue}>{carbsLeft}g</Text>
            <Text style={styles.macroLabel}>Carbs left</Text>
          </View>
          <View style={styles.macroCard}>
            <Text style={styles.macroValue}>{fatLeft}g</Text>
            <Text style={styles.macroLabel}>Fat left</Text>
          </View>
        </View>

        {/* Current Meal Section */}
        <View style={styles.currentMealSection}>
          <View style={styles.currentMealHeader}>
            <Text style={styles.currentMealEmoji}>{getMealEmoji(currentMeal)}</Text>
            <View style={styles.currentMealInfo}>
              <Text style={styles.currentMealTitle}>
                {isCurrentMealTime(currentMeal) ? 'Current Meal' : 'Next Meal'}
              </Text>
              <Text style={styles.currentMealName}>{getMealDisplayName(currentMeal)}</Text>
              <Text style={styles.currentMealTime}>{getMealTimeRange(currentMeal)}</Text>
            </View>
            <Text style={styles.currentMealCalories}>{getMealCalories(currentMeal)} cal</Text>
          </View>
          
          {getMealItems(currentMeal).length > 0 && (
            <View style={styles.currentMealItems}>
              {getMealItems(currentMeal).slice(0, 3).map((item, index) => (
                <Text key={index} style={styles.currentMealItem}>
                  • {item.foodName} ({item.calories} cal)
                </Text>
              ))}
              {getMealItems(currentMeal).length > 3 && (
                <Text style={styles.currentMealItem}>
                  +{getMealItems(currentMeal).length - 3} more items
                </Text>
              )}
            </View>
          )}
        </View>
        
        {/* Today's Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <TouchableOpacity onPress={handleViewSavedMeals} style={styles.savedMealsButton}>
            <Text style={styles.savedMealsButtonText}>📚 Saved Meals</Text>
          </TouchableOpacity>
        </View>
        
        {/* Meal Overview */}
        <View style={styles.mealsOverview}>
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
            <View key={meal} style={styles.mealOverviewCard}>
              <Text style={styles.mealOverviewEmoji}>{getMealEmoji(meal)}</Text>
              <Text style={styles.mealOverviewName}>{getMealDisplayName(meal)}</Text>
              <Text style={styles.mealOverviewCalories}>{getMealCalories(meal)} cal</Text>
              <Text style={styles.mealOverviewItems}>{getMealItems(meal).length} items</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Animated Plus Button */}
      <AnimatedPlusButton onLogMeal={handleLogMeal} onLogItem={handleLogItem} />
    </View>
  );
};

const { width } = Dimensions.get('window');
const macroCardWidth = (width - 32 - 16) / 3; // padding + gaps

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  caloriesCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  caloriesValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
  },
  caloriesLabel: {
    color: '#999',
    fontSize: 16,
    marginTop: 4,
  },
  caloriesIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameIcon: {
    fontSize: 32,
    color: '#fff',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  macroCard: {
    width: macroCardWidth,
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  macroValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  macroLabel: {
    color: '#999',
    fontSize: 14,
  },
  sectionHeader: {
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
  currentMealSection: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  currentMealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentMealEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  currentMealInfo: {
    flex: 1,
  },
  currentMealTitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
  currentMealName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  currentMealTime: {
    color: '#666',
    fontSize: 12,
  },
  currentMealCalories: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentMealItems: {
    marginTop: 8,
  },
  currentMealItem: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
  mealsOverview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mealOverviewCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  mealOverviewEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  mealOverviewName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  mealOverviewCalories: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mealOverviewItems: {
    color: '#666',
    fontSize: 12,
  },
}); 