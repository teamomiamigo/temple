import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedPlusButton } from '../components/AnimatedPlusButton';
import { IOSTile } from '../components/IOSTile';
import { WaterIntakeChart } from '../components/WaterIntakeChart';
import { WaterIntakeWidget } from '../components/WaterIntakeWidget';
import { WeightTrackingWidget } from '../components/WeightTrackingWidget';
import { useNutritionStore } from '../stores/nutritionStore';
import { getMealByTime, getMealDisplayName, getMealEmoji, getMealTimeRange } from '../utils/mealUtils';

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
  
  const handleLogFood = () => {
    navigation.navigate('UnifiedFoodLogging');
  };
  
  const handleViewSavedMeals = () => {
    navigation.navigate('SavedMeals');
  };

  const handleWeightTrackingPress = () => {
    navigation.navigate('WeightTracking');
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
        <IOSTile style={styles.caloriesCard} onPress={() => {}}>
          <View style={styles.caloriesContent}>
            <View style={styles.caloriesLeft}>
              <Text style={styles.caloriesValue}>{caloriesLeft}</Text>
              <Text style={styles.caloriesLabel}>calories left</Text>
              <View style={styles.caloriesProgress}>
                <View style={[styles.caloriesProgressBar, { width: `${Math.min(100, ((goals.calories - caloriesLeft) / goals.calories) * 100)}%` }]} />
              </View>
            </View>
            <View style={styles.caloriesRight}>
              <View style={styles.caloriesIconContainer}>
                <Text style={styles.caloriesIcon}>🔥</Text>
              </View>
              <Text style={styles.caloriesGoal}>Goal: {goals.calories}</Text>
            </View>
          </View>
        </IOSTile>

        {/* Macro cards */}
        <View style={styles.macroRow}>
          <IOSTile style={[styles.macroCard, styles.proteinCard]} onPress={() => {}}>
            <View style={styles.macroIconContainer}>
              <Text style={styles.macroIcon}>🥩</Text>
            </View>
            <Text style={styles.macroValue}>{proteinLeft}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
            <View style={styles.macroProgress}>
              <View style={[styles.macroProgressBar, { width: `${Math.min(100, ((goals.protein - proteinLeft) / goals.protein) * 100)}%` }]} />
            </View>
          </IOSTile>
          <IOSTile style={[styles.macroCard, styles.carbsCard]} onPress={() => {}}>
            <View style={styles.macroIconContainer}>
              <Text style={styles.macroIcon}>🍞</Text>
            </View>
            <Text style={styles.macroValue}>{carbsLeft}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
            <View style={styles.macroProgress}>
              <View style={[styles.macroProgressBar, { width: `${Math.min(100, ((goals.carbs - carbsLeft) / goals.carbs) * 100)}%` }]} />
            </View>
          </IOSTile>
          <IOSTile style={[styles.macroCard, styles.fatCard]} onPress={() => {}}>
            <View style={styles.macroIconContainer}>
              <Text style={styles.macroIcon}>🥑</Text>
            </View>
            <Text style={styles.macroValue}>{fatLeft}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
            <View style={styles.macroProgress}>
              <View style={[styles.macroProgressBar, { width: `${Math.min(100, ((goals.fat - fatLeft) / goals.fat) * 100)}%` }]} />
            </View>
          </IOSTile>
        </View>

        {/* Today's Summary Box */}
        <View style={styles.todaySummaryContainer}>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <IOSTile onPress={handleViewSavedMeals} style={styles.savedMealsButton}>
              <Text style={styles.savedMealsButtonText}>📚 Saved Meals</Text>
            </IOSTile>
          </View>
          
          <IOSTile style={styles.summaryBox} onPress={() => {}}>
            <View style={styles.summaryGrid}>
              {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal, index) => (
                <View key={meal} style={[styles.summarySection, index < 2 && styles.summarySectionBorderBottom]}>
                  <View style={styles.summaryMealHeader}>
                    <Text style={styles.summaryMealEmoji}>{getMealEmoji(meal)}</Text>
                    <View style={styles.summaryMealInfo}>
                      <Text style={styles.summaryMealName}>{getMealDisplayName(meal)}</Text>
                      <Text style={styles.summaryMealTime}>{getMealTimeRange(meal)}</Text>
                    </View>
                  </View>
                  <View style={styles.summaryMealStats}>
                    <Text style={styles.summaryMealCalories}>{getMealCalories(meal)}</Text>
                    <Text style={styles.summaryMealCaloriesLabel}>cal</Text>
                    <Text style={styles.summaryMealItems}>{getMealItems(meal).length} items</Text>
                  </View>
                  {getMealItems(meal).length > 0 && (
                    <View style={styles.summaryMealProgress}>
                      <View style={[styles.summaryMealProgressBar, { width: `${Math.min(100, (getMealCalories(meal) / 500) * 100)}%` }]} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </IOSTile>
        </View>

        {/* Water Intake Widget */}
        <WaterIntakeWidget />

        {/* Water Intake Chart */}
        <WaterIntakeChart />

        {/* Weight Tracking Widget */}
        <WeightTrackingWidget onPress={handleWeightTrackingPress} />
      </ScrollView>

      {/* Animated Plus Button */}
      <AnimatedPlusButton onLogFood={handleLogFood} />
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
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  caloriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesLeft: {
    flex: 1,
  },
  caloriesValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
  },
  caloriesLabel: {
    color: '#999',
    fontSize: 16,
    marginBottom: 12,
  },
  caloriesProgress: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  caloriesProgressBar: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  caloriesRight: {
    alignItems: 'center',
  },
  caloriesIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  caloriesIcon: {
    fontSize: 32,
  },
  caloriesGoal: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
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
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  proteinCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  carbsCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  fatCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  macroIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  macroIcon: {
    fontSize: 20,
  },
  macroValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  macroLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  macroProgress: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
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
  todaySummaryContainer: {
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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