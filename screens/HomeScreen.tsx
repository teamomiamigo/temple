import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { CaloriesCard } from '../components/CaloriesCard';
import { MacroCards } from '../components/MacroCards';
import { TodaySummary } from '../components/TodaySummary';
import { WaterIntakeWidget } from '../components/WaterIntakeWidget';
import { WeightTrackingWidget } from '../components/WeightTrackingWidget';
import { useMeditationStore } from '../stores/meditationStore';
import { useNutritionStore } from '../stores/nutritionStore';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { goals, getTodayNutrition } = useNutritionStore();
  const { getDailyQuote, getTotalSessions, getTotalMinutes } = useMeditationStore();
  
  const todayNutrition = getTodayNutrition();
  const dailyQuote = getDailyQuote();
  const totalSessions = getTotalSessions();
  const totalMinutes = getTotalMinutes();

  // Calculate meal summaries
  const getMealSummaries = () => {
    if (!todayNutrition) {
      return [
        { name: 'breakfast' as const, calories: 0, items: 0 },
        { name: 'lunch' as const, calories: 0, items: 0 },
        { name: 'dinner' as const, calories: 0, items: 0 },
        { name: 'snacks' as const, calories: 0, items: 0 },
      ];
    }

    return ['breakfast', 'lunch', 'dinner', 'snacks'].map(mealName => {
      const meal = todayNutrition.meals.find(m => m.name === mealName);
      return {
        name: mealName as 'breakfast' | 'lunch' | 'dinner' | 'snacks',
        calories: meal ? meal.entries.reduce((sum, entry) => sum + entry.calories, 0) : 0,
        items: meal ? meal.entries.length : 0,
      };
    });
  };

  const mealSummaries = getMealSummaries();
  const totalCalories = todayNutrition?.totalCalories || 0;
  const caloriesLeft = Math.max(0, goals.calories - totalCalories);
  const consumedMacros = {
    protein: todayNutrition?.totalProtein || 0,
    carbs: todayNutrition?.totalCarbs || 0,
    fat: todayNutrition?.totalFat || 0,
  };

  const handleLogFood = () => {
    (navigation as any).navigate('Nutrition', { screen: 'UnifiedFoodLogging' });
  };

  const handleViewNutrition = () => {
    (navigation as any).navigate('Nutrition');
  };

  const handleViewWeight = () => {
    (navigation as any).navigate('Nutrition', { screen: 'WeightTracking' });
  };

  const handleViewMeditation = () => {
    (navigation as any).navigate('Temple');
  };

  const handleViewSavedMeals = () => {
    (navigation as any).navigate('Nutrition', { screen: 'SavedMeals' });
  };

  const quickActions = [
    {
      title: 'Log Food',
      icon: '🍎',
      onPress: handleLogFood,
      color: '#FF6B35',
    },
    {
      title: 'Add Weight',
      icon: '⚖️',
      onPress: handleViewWeight,
      color: '#4CAF50',
    },
    {
      title: 'Meditate',
      icon: '🧘',
      onPress: handleViewMeditation,
      color: '#9C27B0',
    },
    {
      title: 'Quick Workout',
      icon: '💪',
      onPress: () => (navigation as any).navigate('Body', { screen: 'QuickWorkout' }),
      color: '#2196F3',
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {getGreeting()}</Text>
          <Text style={styles.welcomeText}>Welcome to your wellness journey</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
        </View>
      </View>

      {/* Daily Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>💭</Text>
        <View style={styles.quoteContent}>
          <Text style={styles.quoteText}>"{dailyQuote.text}"</Text>
          <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionButton, { backgroundColor: action.color }]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Calories Card */}
      <CaloriesCard
        caloriesLeft={caloriesLeft}
        goal={goals.calories}
        consumed={totalCalories}
        onPress={handleViewNutrition}
      />

      {/* Macro Cards */}
      <MacroCards
        goals={{
          protein: goals.protein,
          carbs: goals.carbs,
          fat: goals.fat,
        }}
        consumed={consumedMacros}
      />

      {/* Today's Summary */}
      <TodaySummary
        meals={mealSummaries}
        onViewSavedMeals={handleViewSavedMeals}
        onPressSummary={handleViewNutrition}
      />

      {/* Water Intake Widget */}
      <WaterIntakeWidget />

      {/* Weight Tracking Widget */}
      <WeightTrackingWidget onPress={handleViewWeight} />

      {/* Meditation Stats */}
      <View style={styles.meditationCard}>
        <View style={styles.meditationHeader}>
          <View style={styles.meditationIconContainer}>
            <Text style={styles.meditationIcon}>🧘</Text>
          </View>
          <View style={styles.meditationHeaderText}>
            <Text style={styles.meditationTitle}>Meditation Journey</Text>
            <Text style={styles.meditationSubtitle}>Find your inner peace</Text>
          </View>
          <TouchableOpacity
            style={styles.meditationButton}
            onPress={handleViewMeditation}
            activeOpacity={0.8}
          >
            <Text style={styles.meditationButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.meditationStats}>
          <View style={styles.meditationStatItem}>
            <Text style={styles.meditationStatValue}>{totalSessions}</Text>
            <Text style={styles.meditationStatLabel}>Sessions</Text>
          </View>
          <View style={styles.meditationStatItem}>
            <Text style={styles.meditationStatValue}>{totalMinutes}</Text>
            <Text style={styles.meditationStatLabel}>Minutes</Text>
          </View>
          <View style={styles.meditationStatItem}>
            <Text style={styles.meditationStatValue}>
              {totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0}
            </Text>
            <Text style={styles.meditationStatLabel}>Avg Time</Text>
          </View>
        </View>
      </View>

      {/* Recent Activity Summary */}
      <View style={styles.activityCard}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.activityItems}>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>🔥</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Calories</Text>
              <Text style={styles.activityValue}>
                {totalCalories} / {goals.calories}
              </Text>
            </View>
            <View style={styles.activityProgress}>
              <View 
                style={[
                  styles.activityProgressBar, 
                  { width: `${Math.min(100, (totalCalories / goals.calories) * 100)}%` }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>💧</Text>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Water</Text>
              <Text style={styles.activityValue}>
                {todayNutrition?.waterIntake || 0}ml / {goals.water || 2500}ml
              </Text>
            </View>
            <View style={styles.activityProgress}>
              <View 
                style={[
                  styles.activityProgressBar, 
                  { width: `${Math.min(100, ((todayNutrition?.waterIntake || 0) / (goals.water || 2500)) * 100)}%` }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

// Helper functions
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

const getFormattedDate = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  dateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quoteCard: {
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quoteIcon: {
    fontSize: 24,
    marginRight: 16,
    marginTop: 4,
  },
  quoteContent: {
    flex: 1,
  },
  quoteText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 48) / 2,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  meditationCard: {
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  meditationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  meditationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  meditationIcon: {
    fontSize: 24,
  },
  meditationHeaderText: {
    flex: 1,
  },
  meditationTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  meditationSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  meditationButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  meditationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  meditationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  meditationStatItem: {
    alignItems: 'center',
  },
  meditationStatValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  meditationStatLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  activityCard: {
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  activityItems: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityValue: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  activityProgress: {
    width: 60,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  activityProgressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
}); 