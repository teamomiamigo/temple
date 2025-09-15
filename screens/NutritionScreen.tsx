import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedPlusButton } from '../components/AnimatedPlusButton';
import { CaloriesCard } from '../components/CaloriesCard';
import { MacroCards } from '../components/MacroCards';
import { TodaySummary } from '../components/TodaySummary';
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
  
  // Helper functions
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
  
  // Calculate consumed macros
  const consumed = {
    calories: todayNutrition?.totalCalories || 0,
    protein: todayNutrition?.totalProtein || 0,
    carbs: todayNutrition?.totalCarbs || 0,
    fat: todayNutrition?.totalFat || 0,
  };
  
  // Calculate remaining calories
  const caloriesLeft = Math.max(0, goals.calories - consumed.calories);
  
  // Prepare meal data
  const meals = [
    { name: 'breakfast' as const, calories: getMealCalories('breakfast'), items: getMealItems('breakfast').length },
    { name: 'lunch' as const, calories: getMealCalories('lunch'), items: getMealItems('lunch').length },
    { name: 'dinner' as const, calories: getMealCalories('dinner'), items: getMealItems('dinner').length },
    { name: 'snacks' as const, calories: getMealCalories('snacks'), items: getMealItems('snacks').length },
  ];
  
  const handleLogFood = () => {
    navigation.navigate('UnifiedFoodLogging');
  };
  
  const handleViewSavedMeals = () => {
    navigation.navigate('SavedMeals');
  };

  const handleWeightTrackingPress = () => {
    navigation.navigate('WeightTracking');
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Let's Eat Healthy.</Text>

        {/* Calories Card */}
        <CaloriesCard 
          caloriesLeft={caloriesLeft}
          goal={goals.calories}
          consumed={consumed.calories}
        />

        {/* Macro Cards */}
        <MacroCards 
          goals={goals}
          consumed={consumed}
        />

        {/* Today's Summary */}
        <TodaySummary 
          meals={meals}
          onViewSavedMeals={handleViewSavedMeals}
        />

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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 100,
  },
  pageTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
});