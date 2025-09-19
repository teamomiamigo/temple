import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Platform,
    PlatformColor,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FoodLogRow } from '../components/nutrition/FoodLogRow';
import { MacroPie } from '../components/nutrition/MacroPie';
import { NutrientProgressRow } from '../components/nutrition/NutrientProgressRow';
import { NutritionTabBar } from '../components/nutrition/NutritionTabBar';
import { PeriodControl } from '../components/nutrition/PeriodControl';
import { useNutritionStore } from '../stores/nutritionStore';
import { ChartDataPoint, FoodEntry, MealGroup, NutrientRow, NutritionDetailParams, NutritionDetailTab, NutritionPeriod } from '../types/nutrition';

type NutritionDetailScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: NutritionDetailParams }, 'params'>;
};

export const NutritionDetailScreen: React.FC<NutritionDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { initialTab = 'Overview', initialPeriod = 'day' } = route.params || {};
  
  const [activeTab, setActiveTab] = useState<NutritionDetailTab>(initialTab);
  const [period, setPeriod] = useState<NutritionPeriod>(initialPeriod);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { goals, getTodayNutrition, getWeeklyNutrition, getMonthlyNutrition } = useNutritionStore();

  // Trigger haptic feedback on mount
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  // Get nutrition data based on period
  const nutritionData = useMemo(() => {
    switch (period) {
      case 'day':
        return getTodayNutrition();
      case 'week':
        return getWeeklyNutrition();
      case 'month':
        return getMonthlyNutrition();
      default:
        return getTodayNutrition();
    }
  }, [period, getTodayNutrition, getWeeklyNutrition, getMonthlyNutrition]);

  // Mock data for demonstration (TODO: Replace with real data)
  const mockTotals = {
    calories: 1850,
    protein: 120,
    carbs: 180,
    fat: 65,
    fiber: 25,
    sugar: 45,
    sodium: 2100,
  };

  const mockNutrients: NutrientRow[] = [
    { name: 'Protein', total: 120, goal: 150, unit: 'g', left: 30 },
    { name: 'Carbs', total: 180, goal: 250, unit: 'g', left: 70 },
    { name: 'Fat', total: 65, goal: 67, unit: 'g', left: 2 },
    { name: 'Fiber', total: 25, goal: 25, unit: 'g', left: 0 },
    { name: 'Sugar', total: 45, goal: 50, unit: 'g', left: 5 },
    { name: 'Sodium', total: 2100, goal: 2300, unit: 'mg', left: 200 },
  ];

  const mockFoodEntries: FoodEntry[] = [
    {
      id: '1',
      title: 'Greek Yogurt with Berries',
      calories: 150,
      meal: 'breakfast',
      note: '1 cup with mixed berries',
      macros: { protein: 15, carbs: 20, fat: 2 },
      timestamp: Date.now() - 3600000,
    },
    {
      id: '2',
      title: 'Grilled Chicken Salad',
      calories: 320,
      meal: 'lunch',
      note: 'Mixed greens, tomatoes, cucumber',
      macros: { protein: 35, carbs: 15, fat: 12 },
      timestamp: Date.now() - 1800000,
    },
    {
      id: '3',
      title: 'Salmon with Quinoa',
      calories: 450,
      meal: 'dinner',
      note: '6oz salmon, 1 cup quinoa',
      macros: { protein: 40, carbs: 35, fat: 18 },
      timestamp: Date.now() - 600000,
    },
    {
      id: '4',
      title: 'Apple with Almond Butter',
      calories: 200,
      meal: 'snacks',
      note: '1 medium apple, 1 tbsp almond butter',
      macros: { protein: 6, carbs: 25, fat: 12 },
      timestamp: Date.now() - 300000,
    },
  ];

  const mockMealGroups: MealGroup[] = [
    {
      name: 'breakfast',
      displayName: 'Breakfast',
      entries: mockFoodEntries.filter(f => f.meal === 'breakfast'),
      totalCalories: mockFoodEntries.filter(f => f.meal === 'breakfast').reduce((sum, f) => sum + f.calories, 0),
    },
    {
      name: 'lunch',
      displayName: 'Lunch',
      entries: mockFoodEntries.filter(f => f.meal === 'lunch'),
      totalCalories: mockFoodEntries.filter(f => f.meal === 'lunch').reduce((sum, f) => sum + f.calories, 0),
    },
    {
      name: 'dinner',
      displayName: 'Dinner',
      entries: mockFoodEntries.filter(f => f.meal === 'dinner'),
      totalCalories: mockFoodEntries.filter(f => f.meal === 'dinner').reduce((sum, f) => sum + f.calories, 0),
    },
    {
      name: 'snacks',
      displayName: 'Snacks',
      entries: mockFoodEntries.filter(f => f.meal === 'snacks'),
      totalCalories: mockFoodEntries.filter(f => f.meal === 'snacks').reduce((sum, f) => sum + f.calories, 0),
    },
  ];

  const mockChartData: ChartDataPoint[] = [
    { date: '2024-01-15', value: 1800, label: 'Mon' },
    { date: '2024-01-16', value: 1950, label: 'Tue' },
    { date: '2024-01-17', value: 2100, label: 'Wed' },
    { date: '2024-01-18', value: 1750, label: 'Thu' },
    { date: '2024-01-19', value: 2000, label: 'Fri' },
    { date: '2024-01-20', value: 1850, label: 'Sat' },
    { date: '2024-01-21', value: 1900, label: 'Sun' },
  ];

  const getPeriodLabel = () => {
    const today = new Date();
    switch (period) {
      case 'day':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      default:
        return 'Today';
    }
  };

  const handleTabChange = (tab: NutritionDetailTab) => {
    setActiveTab(tab);
  };

  const handlePeriodChange = (newPeriod: NutritionPeriod) => {
    setPeriod(newPeriod);
  };

  const handlePrev = () => {
    // TODO: Implement date navigation
    console.log('Previous period');
  };

  const handleNext = () => {
    // TODO: Implement date navigation
    console.log('Next period');
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Summary Tiles */}
      <View style={styles.summarySection}>
        <View style={styles.summaryTile}>
          <Text style={styles.summaryValue}>{mockTotals.calories}</Text>
          <Text style={styles.summaryLabel}>Calories Consumed</Text>
        </View>
        <View style={styles.summaryTile}>
          <Text style={styles.summaryValue}>{Math.max(0, goals.calories - mockTotals.calories)}</Text>
          <Text style={styles.summaryLabel}>Calories Left</Text>
        </View>
      </View>

      {/* Macro Totals */}
      <View style={styles.macroSection}>
        <Text style={styles.sectionTitle}>Macro Totals</Text>
        <View style={styles.macroGrid}>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{mockTotals.protein}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{mockTotals.carbs}g</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroValue}>{mockTotals.fat}g</Text>
            <Text style={styles.macroLabel}>Fat</Text>
          </View>
        </View>
      </View>

      {/* Trend Chart Placeholder */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Calories Trend (7 days)</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>📈 Chart visualization</Text>
          <Text style={styles.chartPlaceholderSubtext}>
            Average: {Math.round(mockChartData.reduce((sum, d) => sum + d.value, 0) / mockChartData.length)} cal/day
          </Text>
        </View>
      </View>

      {/* Today's Foods Preview */}
      <View style={styles.foodsSection}>
        <Text style={styles.sectionTitle}>Today's Foods</Text>
        {mockFoodEntries.slice(0, 3).map((food) => (
          <FoodLogRow key={food.id} food={food} />
        ))}
        <View style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Foods →</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderCaloriesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Primary Stat Card */}
      <View style={styles.primaryStatCard}>
        <Text style={styles.primaryStatValue}>{mockTotals.calories}</Text>
        <Text style={styles.primaryStatLabel}>Calories Consumed</Text>
        <View style={styles.primaryStatProgress}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min((mockTotals.calories / goals.calories) * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((mockTotals.calories / goals.calories) * 100)}% of goal
          </Text>
        </View>
      </View>

      {/* Chart Placeholder */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Calories Over Time</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>📊 Line Chart</Text>
          <Text style={styles.chartPlaceholderSubtext}>
            {period === 'day' ? 'Hourly breakdown' : 
             period === 'week' ? 'Daily breakdown' : 'Weekly breakdown'}
          </Text>
        </View>
      </View>

      {/* Day Detail List */}
      <View style={styles.detailSection}>
        <Text style={styles.sectionTitle}>Daily Breakdown</Text>
        {mockMealGroups.map((meal) => (
          <View key={meal.name} style={styles.mealGroup}>
            <View style={styles.mealGroupHeader}>
              <Text style={styles.mealGroupName}>{meal.displayName}</Text>
              <Text style={styles.mealGroupCalories}>{meal.totalCalories} cal</Text>
            </View>
            {meal.entries.map((food) => (
              <FoodLogRow key={food.id} food={food} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderNutrientsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.nutrientsSection}>
        {mockNutrients.map((nutrient) => (
          <NutrientProgressRow key={nutrient.name} nutrient={nutrient} />
        ))}
      </View>
    </ScrollView>
  );

  const renderMacrosTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.macrosSection}>
        <Text style={styles.sectionTitle}>Macro Breakdown</Text>
        <View style={styles.pieChartContainer}>
          <MacroPie
            protein={mockTotals.protein}
            carbs={mockTotals.carbs}
            fat={mockTotals.fat}
            size={250}
          />
        </View>
        
        {/* Macro Details */}
        <View style={styles.macroDetails}>
          {mockNutrients.slice(0, 3).map((nutrient) => (
            <NutrientProgressRow key={nutrient.name} nutrient={nutrient} />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverviewTab();
      case 'Calories':
        return renderCaloriesTab();
      case 'Nutrients':
        return renderNutrientsTab();
      case 'Macros':
        return renderMacrosTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <NutritionTabBar
        tabs={['Overview', 'Calories', 'Nutrients', 'Macros']}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      {/* Period Control */}
      <PeriodControl
        period={period}
        label={getPeriodLabel()}
        onPrev={handlePrev}
        onNext={handleNext}
        onChangePeriod={handlePeriodChange}
      />

      {/* Content */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: PlatformColor('systemGroupedBackground'),
      android: '#f2f2f7',
    }),
  },
  tabContent: {
    flex: 1,
  },
  summarySection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  summaryTile: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: PlatformColor('systemBackground'),
      android: '#fff',
    }),
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
    allowFontScaling: true,
  },
  summaryLabel: {
    fontSize: 14,
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
    allowFontScaling: true,
    marginTop: 4,
  },
  macroSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
    allowFontScaling: true,
    marginBottom: 12,
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  macroItem: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: PlatformColor('systemBackground'),
      android: '#fff',
    }),
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
    allowFontScaling: true,
  },
  macroLabel: {
    fontSize: 12,
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
    allowFontScaling: true,
    marginTop: 4,
  },
  chartSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  chartPlaceholder: {
    backgroundColor: Platform.select({
      ios: PlatformColor('systemBackground'),
      android: '#fff',
    }),
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartPlaceholderText: {
    fontSize: 18,
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
    allowFontScaling: true,
    marginBottom: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: Platform.select({
      ios: PlatformColor('tertiaryLabel'),
      android: '#c7c7cc',
    }),
    allowFontScaling: true,
  },
  foodsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: Platform.select({
      ios: PlatformColor('systemBlue'),
      android: '#007AFF',
    }),
    allowFontScaling: true,
  },
  primaryStatCard: {
    backgroundColor: Platform.select({
      ios: PlatformColor('systemBackground'),
      android: '#fff',
    }),
    borderRadius: 16,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryStatValue: {
    fontSize: 48,
    fontWeight: '800',
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
    allowFontScaling: true,
  },
  primaryStatLabel: {
    fontSize: 16,
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
    allowFontScaling: true,
    marginBottom: 16,
  },
  primaryStatProgress: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Platform.select({
      ios: PlatformColor('systemGray5'),
      android: '#e5e5ea',
    }),
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Platform.select({
      ios: PlatformColor('systemBlue'),
      android: '#007AFF',
    }),
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
    allowFontScaling: true,
    textAlign: 'center',
  },
  detailSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mealGroup: {
    marginBottom: 16,
  },
  mealGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Platform.select({
      ios: PlatformColor('systemGray6'),
      android: '#f2f2f7',
    }),
    borderRadius: 8,
    marginBottom: 8,
  },
  mealGroupName: {
    fontSize: 16,
    fontWeight: '600',
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
    allowFontScaling: true,
  },
  mealGroupCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
    allowFontScaling: true,
  },
  nutrientsSection: {
    paddingVertical: 16,
  },
  macrosSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  macroDetails: {
    marginTop: 16,
  },
});

