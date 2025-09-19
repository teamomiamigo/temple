// Common types for nutrition detail screens

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
};

export type MacroBreakdown = {
  protein: number;
  carbs: number;
  fat: number;
};

export type NutrientRow = {
  name: string;
  total: number;
  goal?: number;
  unit: 'g' | 'mg' | 'kcal';
  left?: number;
};

export type FoodEntry = {
  id: string;
  title: string;
  calories: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  note?: string;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  timestamp: number;
};

export type MealGroup = {
  name: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  displayName: string;
  entries: FoodEntry[];
  totalCalories: number;
};

export type NutritionDetailTab = 'Overview' | 'Calories' | 'Nutrients' | 'Macros';

export type NutritionPeriod = 'day' | 'week' | 'month';

export type ChartDataPoint = {
  date: string;
  value: number;
  label?: string;
};

export type NutritionDetailParams = {
  initialTab?: NutritionDetailTab;
  initialPeriod?: NutritionPeriod;
};

