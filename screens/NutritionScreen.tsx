import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedPlusButton } from '../components/AnimatedPlusButton';
import { IOSTile } from '../components/IOSTile';
import { WaterIntakeChart } from '../components/WaterIntakeChart';
import { WaterIntakeWidget } from '../components/WaterIntakeWidget';
import { WeightTrackingWidget } from '../components/WeightTrackingWidget';
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

        {/* Current Meal Section */}
        <IOSTile style={styles.currentMealSection} onPress={() => {}}>
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
        </IOSTile>
        
        {/* Today's Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <IOSTile onPress={handleViewSavedMeals} style={styles.savedMealsButton}>
            <Text style={styles.savedMealsButtonText}>📚 Saved Meals</Text>
          </IOSTile>
        </View>
        
        {/* Meal Overview */}
        <View style={styles.mealsOverview}>
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
            <IOSTile key={meal} style={styles.mealOverviewCard} onPress={() => {}}>
              <View style={styles.mealCardHeader}>
                <View style={styles.mealIconContainer}>
                  <Text style={styles.mealOverviewEmoji}>{getMealEmoji(meal)}</Text>
                </View>
                <View style={styles.mealCardInfo}>
                  <Text style={styles.mealOverviewName}>{getMealDisplayName(meal)}</Text>
                  <Text style={styles.mealOverviewTime}>{getMealTimeRange(meal)}</Text>
                </View>
                <View style={styles.mealCardStats}>
                  <Text style={styles.mealOverviewCalories}>{getMealCalories(meal)}</Text>
                  <Text style={styles.mealOverviewCaloriesLabel}>cal</Text>
                </View>
              </View>
              <View style={styles.mealCardFooter}>
                <Text style={styles.mealOverviewItems}>{getMealItems(meal).length} items logged</Text>
                {getMealItems(meal).length > 0 && (
                  <View style={styles.mealProgress}>
                    <View style={[styles.mealProgressBar, { width: `${Math.min(100, (getMealCalories(meal) / 500) * 100)}%` }]} />
                  </View>
                )}
              </View>
            </IOSTile>
          ))}
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
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mealOverviewEmoji: {
    fontSize: 20,
  },
  mealCardInfo: {
    flex: 1,
  },
  mealOverviewName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  mealOverviewTime: {
    color: '#666',
    fontSize: 11,
  },
  mealCardStats: {
    alignItems: 'flex-end',
  },
  mealOverviewCalories: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealOverviewCaloriesLabel: {
    color: '#666',
    fontSize: 10,
  },
  mealCardFooter: {
    marginTop: 8,
  },
  mealOverviewItems: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  mealProgress: {
    height: 3,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  mealProgressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
}); 