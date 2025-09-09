import { create } from 'zustand';

export type NutritionGoals = {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
  water?: number; // in ml
};

export type FoodItem = {
  id: string;
  name: string;
  brand?: string;
  servingSize: string;
  servingSizeGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  isCustom: boolean; // true if user added this food
  barcode?: string;
};

export type MealEntry = {
  id: string;
  foodId: string;
  foodName: string;
  servingSize: string;
  quantity: number; // how many servings
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  timestamp: number;
};

export type Meal = {
  id: string;
  name: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  entries: MealEntry[];
  timestamp: number;
};

export type DailyNutrition = {
  date: string; // YYYY-MM-DD format
  meals: Meal[];
  waterIntake: number; // in ml
  goals: NutritionGoals;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber?: number;
  totalSugar?: number;
  totalSodium?: number;
};

export type SavedMeal = {
  id: string;
  name: string;
  description?: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: number;
  lastUsed?: number;
  useCount: number;
};

type NutritionStore = {
  // Goals
  goals: NutritionGoals;
  setGoals: (goals: NutritionGoals) => void;
  
  // Food database
  foods: FoodItem[];
  addFood: (food: Omit<FoodItem, 'id'>) => void;
  updateFood: (id: string, updates: Partial<FoodItem>) => void;
  removeFood: (id: string) => void;
  searchFoods: (query: string) => FoodItem[];
  
  // Recent and favorite foods
  recentFoods: string[]; // Array of food IDs
  favoriteFoods: string[]; // Array of food IDs
  addToRecent: (foodId: string) => void;
  toggleFavorite: (foodId: string) => void;
  getRecentFoods: () => FoodItem[];
  getFavoriteFoods: () => FoodItem[];
  
  // Daily nutrition
  dailyNutrition: DailyNutrition[];
  getTodayNutrition: () => DailyNutrition | undefined;
  addMealEntry: (mealName: Meal['name'], entry: Omit<MealEntry, 'id' | 'timestamp'>) => void;
  updateMealEntry: (entryId: string, updates: Partial<MealEntry>) => void;
  removeMealEntry: (entryId: string) => void;
  updateWaterIntake: (amount: number) => void;
  
  // Saved Meals
  savedMeals: SavedMeal[];
  saveMeal: (meal: Omit<SavedMeal, 'id' | 'createdAt' | 'useCount'>) => void;
  updateSavedMeal: (id: string, updates: Partial<SavedMeal>) => void;
  deleteSavedMeal: (id: string) => void;
  useSavedMeal: (id: string, mealName: Meal['name']) => void;
  
  // Analytics
  getWeeklyNutrition: () => DailyNutrition[];
  getMonthlyNutrition: () => DailyNutrition[];
};

// Default nutrition goals (can be customized)
const defaultGoals: NutritionGoals = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fat: 67,
  fiber: 25,
  sugar: 50,
  sodium: 2300,
  water: 2500,
};

// Comprehensive food database
const sampleFoods: FoodItem[] = [
  // Proteins
  {
    id: '1',
    name: 'Chicken Breast',
    servingSize: '100g',
    servingSizeGrams: 100,
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    isCustom: false,
  },
  {
    id: '2',
    name: 'Salmon',
    servingSize: '100g',
    servingSizeGrams: 100,
    calories: 208,
    protein: 25,
    carbs: 0,
    fat: 12,
    fiber: 0,
    sugar: 0,
    sodium: 44,
    isCustom: false,
  },
  {
    id: '3',
    name: 'Eggs',
    servingSize: '1 large',
    servingSizeGrams: 50,
    calories: 70,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    fiber: 0,
    sugar: 0.6,
    sodium: 70,
    isCustom: false,
  },
  {
    id: '4',
    name: 'Ground Beef (90% lean)',
    servingSize: '100g',
    servingSizeGrams: 100,
    calories: 176,
    protein: 20,
    carbs: 0,
    fat: 10,
    fiber: 0,
    sugar: 0,
    sodium: 66,
    isCustom: false,
  },
  {
    id: '5',
    name: 'Greek Yogurt',
    servingSize: '1 cup',
    servingSizeGrams: 170,
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    fiber: 0,
    sugar: 6,
    sodium: 50,
    isCustom: false,
  },
  {
    id: '6',
    name: 'Cottage Cheese',
    servingSize: '1 cup',
    servingSizeGrams: 226,
    calories: 163,
    protein: 28,
    carbs: 6,
    fat: 2,
    fiber: 0,
    sugar: 6,
    sodium: 918,
    isCustom: false,
  },
  
  // Grains & Carbs
  {
    id: '7',
    name: 'Brown Rice',
    servingSize: '1 cup cooked',
    servingSizeGrams: 195,
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    fiber: 3.5,
    sugar: 0.7,
    sodium: 10,
    isCustom: false,
  },
  {
    id: '8',
    name: 'White Rice',
    servingSize: '1 cup cooked',
    servingSizeGrams: 158,
    calories: 205,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
    fiber: 0.6,
    sugar: 0.1,
    sodium: 2,
    isCustom: false,
  },
  {
    id: '9',
    name: 'Quinoa',
    servingSize: '1 cup cooked',
    servingSizeGrams: 185,
    calories: 222,
    protein: 8,
    carbs: 40,
    fat: 3.6,
    fiber: 5,
    sugar: 0.9,
    sodium: 13,
    isCustom: false,
  },
  {
    id: '10',
    name: 'Oatmeal',
    servingSize: '1 cup cooked',
    servingSizeGrams: 234,
    calories: 154,
    protein: 6,
    carbs: 27,
    fat: 3,
    fiber: 4,
    sugar: 1,
    sodium: 7,
    isCustom: false,
  },
  {
    id: '11',
    name: 'Whole Wheat Bread',
    servingSize: '1 slice',
    servingSizeGrams: 28,
    calories: 81,
    protein: 4,
    carbs: 14,
    fat: 1.1,
    fiber: 2,
    sugar: 1.4,
    sodium: 144,
    isCustom: false,
  },
  {
    id: '12',
    name: 'Sweet Potato',
    servingSize: '1 medium',
    servingSizeGrams: 114,
    calories: 103,
    protein: 2.3,
    carbs: 24,
    fat: 0.2,
    fiber: 3.8,
    sugar: 7.4,
    sodium: 41,
    isCustom: false,
  },
  
  // Fruits
  {
    id: '13',
    name: 'Banana',
    servingSize: '1 medium',
    servingSizeGrams: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    sugar: 14.4,
    sodium: 1,
    isCustom: false,
  },
  {
    id: '14',
    name: 'Apple',
    servingSize: '1 medium',
    servingSizeGrams: 182,
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    sugar: 19,
    sodium: 2,
    isCustom: false,
  },
  {
    id: '15',
    name: 'Orange',
    servingSize: '1 medium',
    servingSizeGrams: 131,
    calories: 62,
    protein: 1.2,
    carbs: 15.4,
    fat: 0.2,
    fiber: 3.1,
    sugar: 12.2,
    sodium: 0,
    isCustom: false,
  },
  {
    id: '16',
    name: 'Blueberries',
    servingSize: '1 cup',
    servingSizeGrams: 148,
    calories: 84,
    protein: 1.1,
    carbs: 21,
    fat: 0.5,
    fiber: 3.6,
    sugar: 15,
    sodium: 1,
    isCustom: false,
  },
  {
    id: '17',
    name: 'Strawberries',
    servingSize: '1 cup',
    servingSizeGrams: 152,
    calories: 49,
    protein: 1,
    carbs: 12,
    fat: 0.5,
    fiber: 3,
    sugar: 7.4,
    sodium: 1,
    isCustom: false,
  },
  
  // Vegetables
  {
    id: '18',
    name: 'Broccoli',
    servingSize: '1 cup',
    servingSizeGrams: 91,
    calories: 31,
    protein: 2.6,
    carbs: 6,
    fat: 0.3,
    fiber: 2.6,
    sugar: 1.5,
    sodium: 33,
    isCustom: false,
  },
  {
    id: '19',
    name: 'Spinach',
    servingSize: '1 cup',
    servingSizeGrams: 30,
    calories: 7,
    protein: 0.9,
    carbs: 1.1,
    fat: 0.1,
    fiber: 0.7,
    sugar: 0.1,
    sodium: 24,
    isCustom: false,
  },
  {
    id: '20',
    name: 'Avocado',
    servingSize: '1 medium',
    servingSizeGrams: 150,
    calories: 240,
    protein: 3,
    carbs: 13,
    fat: 22,
    fiber: 10,
    sugar: 1,
    sodium: 10,
    isCustom: false,
  },
  {
    id: '21',
    name: 'Carrots',
    servingSize: '1 cup',
    servingSizeGrams: 128,
    calories: 52,
    protein: 1.2,
    carbs: 12,
    fat: 0.3,
    fiber: 3.6,
    sugar: 6.1,
    sodium: 88,
    isCustom: false,
  },
  
  // Nuts & Seeds
  {
    id: '22',
    name: 'Almonds',
    servingSize: '1 oz (28g)',
    servingSizeGrams: 28,
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    fiber: 3.5,
    sugar: 1.2,
    sodium: 1,
    isCustom: false,
  },
  {
    id: '23',
    name: 'Peanut Butter',
    servingSize: '2 tbsp',
    servingSizeGrams: 32,
    calories: 188,
    protein: 8,
    carbs: 6,
    fat: 16,
    fiber: 2,
    sugar: 3,
    sodium: 152,
    isCustom: false,
  },
  {
    id: '24',
    name: 'Chia Seeds',
    servingSize: '1 oz (28g)',
    servingSizeGrams: 28,
    calories: 138,
    protein: 4.7,
    carbs: 12,
    fat: 8.7,
    fiber: 10.6,
    sugar: 0,
    sodium: 5,
    isCustom: false,
  },
  
  // Common Snacks & Quick Items
  {
    id: '25',
    name: 'Protein Bar',
    servingSize: '1 bar',
    servingSizeGrams: 60,
    calories: 200,
    protein: 20,
    carbs: 22,
    fat: 6,
    fiber: 1,
    sugar: 2,
    sodium: 200,
    isCustom: false,
  },
  {
    id: '26',
    name: 'Granola Bar',
    servingSize: '1 bar',
    servingSizeGrams: 28,
    calories: 120,
    protein: 2,
    carbs: 22,
    fat: 3,
    fiber: 1,
    sugar: 8,
    sodium: 100,
    isCustom: false,
  },
  {
    id: '27',
    name: 'Coffee',
    servingSize: '1 cup',
    servingSizeGrams: 240,
    calories: 2,
    protein: 0.3,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 5,
    isCustom: false,
  },
  {
    id: '28',
    name: 'Milk (2%)',
    servingSize: '1 cup',
    servingSizeGrams: 244,
    calories: 122,
    protein: 8,
    carbs: 12,
    fat: 5,
    fiber: 0,
    sugar: 12,
    sodium: 95,
    isCustom: false,
  },
];

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  // Goals
  goals: defaultGoals,
  setGoals: (goals) => set({ goals }),
  
  // Food database
  foods: sampleFoods,
  addFood: (food) => set((state) => ({
    foods: [...state.foods, { ...food, id: Date.now().toString() }],
  })),
  updateFood: (id, updates) => set((state) => ({
    foods: state.foods.map((food) =>
      food.id === id ? { ...food, ...updates } : food
    ),
  })),
  removeFood: (id) => set((state) => ({
    foods: state.foods.filter((food) => food.id !== id),
  })),
  searchFoods: (query) => {
    const { foods } = get();
    const lowercaseQuery = query.toLowerCase();
    return foods.filter((food) =>
      food.name.toLowerCase().includes(lowercaseQuery) ||
      (food.brand && food.brand.toLowerCase().includes(lowercaseQuery))
    );
  },
  
  // Recent and favorite foods
  recentFoods: [],
  favoriteFoods: [],
  addToRecent: (foodId) => set((state) => {
    const newRecent = [foodId, ...state.recentFoods.filter(id => id !== foodId)].slice(0, 10);
    return { recentFoods: newRecent };
  }),
  toggleFavorite: (foodId) => set((state) => ({
    favoriteFoods: state.favoriteFoods.includes(foodId)
      ? state.favoriteFoods.filter(id => id !== foodId)
      : [...state.favoriteFoods, foodId]
  })),
  getRecentFoods: () => {
    const { foods, recentFoods } = get();
    return recentFoods.map(id => foods.find(food => food.id === id)).filter(Boolean) as FoodItem[];
  },
  getFavoriteFoods: () => {
    const { foods, favoriteFoods } = get();
    return favoriteFoods.map(id => foods.find(food => food.id === id)).filter(Boolean) as FoodItem[];
  },
  
  // Daily nutrition
  dailyNutrition: [],
  getTodayNutrition: () => {
    const { dailyNutrition } = get();
    const today = new Date().toISOString().split('T')[0];
    return dailyNutrition.find((day) => day.date === today);
  },
  addMealEntry: (mealName, entry) => {
    const { goals, addToRecent } = get();
    const today = new Date().toISOString().split('T')[0];
    
    // Add to recent foods
    addToRecent(entry.foodId);
    
    set((state) => {
      const existingDay = state.dailyNutrition.find((day) => day.date === today);
      
      if (existingDay) {
        // Update existing day
        const updatedMeals = existingDay.meals.map((meal) => {
          if (meal.name === mealName) {
            const newEntry: MealEntry = {
              ...entry,
              id: Date.now().toString(),
              timestamp: Date.now(),
            };
            return {
              ...meal,
              entries: [...meal.entries, newEntry],
            };
          }
          return meal;
        });
        
        // If meal doesn't exist, create it
        if (!updatedMeals.find((meal) => meal.name === mealName)) {
          const newMeal: Meal = {
            id: Date.now().toString(),
            name: mealName,
            entries: [{
              ...entry,
              id: Date.now().toString(),
              timestamp: Date.now(),
            }],
            timestamp: Date.now(),
          };
          updatedMeals.push(newMeal);
        }
        
        // Recalculate totals
        const updatedDay = {
          ...existingDay,
          meals: updatedMeals,
          totalCalories: updatedMeals.reduce((sum, meal) => 
            sum + meal.entries.reduce((mealSum, entry) => mealSum + entry.calories, 0), 0),
          totalProtein: updatedMeals.reduce((sum, meal) => 
            sum + meal.entries.reduce((mealSum, entry) => mealSum + entry.protein, 0), 0),
          totalCarbs: updatedMeals.reduce((sum, meal) => 
            sum + meal.entries.reduce((mealSum, entry) => mealSum + entry.carbs, 0), 0),
          totalFat: updatedMeals.reduce((sum, meal) => 
            sum + meal.entries.reduce((mealSum, entry) => mealSum + entry.fat, 0), 0),
        };
        
        return {
          dailyNutrition: state.dailyNutrition.map((day) =>
            day.date === today ? updatedDay : day
          ),
        };
      } else {
        // Create new day
        const newMeal: Meal = {
          id: Date.now().toString(),
          name: mealName,
          entries: [{
            ...entry,
            id: Date.now().toString(),
            timestamp: Date.now(),
          }],
          timestamp: Date.now(),
        };
        
        const newDay: DailyNutrition = {
          date: today,
          meals: [newMeal],
          waterIntake: 0,
          goals,
          totalCalories: entry.calories,
          totalProtein: entry.protein,
          totalCarbs: entry.carbs,
          totalFat: entry.fat,
        };
        
        return {
          dailyNutrition: [...state.dailyNutrition, newDay],
        };
      }
    });
  },
  updateMealEntry: (entryId, updates) => {
    set((state) => ({
      dailyNutrition: state.dailyNutrition.map((day) => ({
        ...day,
        meals: day.meals.map((meal) => ({
          ...meal,
          entries: meal.entries.map((entry) =>
            entry.id === entryId ? { ...entry, ...updates } : entry
          ),
        })),
      })),
    }));
  },
  removeMealEntry: (entryId) => {
    set((state) => ({
      dailyNutrition: state.dailyNutrition.map((day) => ({
        ...day,
        meals: day.meals.map((meal) => ({
          ...meal,
          entries: meal.entries.filter((entry) => entry.id !== entryId),
        })),
      })),
    }));
  },
  updateWaterIntake: (amount) => {
    const today = new Date().toISOString().split('T')[0];
    set((state) => {
      const existingDay = state.dailyNutrition.find((day) => day.date === today);
      
      if (existingDay) {
        return {
          dailyNutrition: state.dailyNutrition.map((day) =>
            day.date === today ? { ...day, waterIntake: amount } : day
          ),
        };
      } else {
        const newDay: DailyNutrition = {
          date: today,
          meals: [],
          waterIntake: amount,
          goals: state.goals,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
        };
        return {
          dailyNutrition: [...state.dailyNutrition, newDay],
        };
      }
    });
  },
  
  // Saved Meals
  savedMeals: [],
  saveMeal: (meal) => set((state) => ({
    savedMeals: [
      ...state.savedMeals,
      {
        ...meal,
        id: Date.now().toString(),
        createdAt: Date.now(),
        useCount: 0,
      },
    ],
  })),
  updateSavedMeal: (id, updates) => set((state) => ({
    savedMeals: state.savedMeals.map((meal) =>
      meal.id === id ? { ...meal, ...updates } : meal
    ),
  })),
  deleteSavedMeal: (id) => set((state) => ({
    savedMeals: state.savedMeals.filter((meal) => meal.id !== id),
  })),
  useSavedMeal: (id, mealName) => {
    const { savedMeals, addMealEntry } = get();
    const savedMeal = savedMeals.find((meal) => meal.id === id);
    
    if (savedMeal) {
      // Add all meals from saved meal to the specified meal
      savedMeal.meals.forEach((meal) => {
        meal.entries.forEach((entry) => {
          addMealEntry(mealName, {
            foodId: entry.foodId,
            foodName: entry.foodName,
            servingSize: entry.servingSize,
            quantity: entry.quantity,
            calories: entry.calories,
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat,
            fiber: entry.fiber,
            sugar: entry.sugar,
            sodium: entry.sodium,
          });
        });
      });
      
      // Update use count and last used
      set((state) => ({
        savedMeals: state.savedMeals.map((meal) =>
          meal.id === id
            ? { ...meal, useCount: meal.useCount + 1, lastUsed: Date.now() }
            : meal
        ),
      }));
    }
  },
  
  // Analytics
  getWeeklyNutrition: () => {
    const { dailyNutrition } = get();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];
    
    return dailyNutrition.filter((day) => day.date >= oneWeekAgoStr);
  },
  getMonthlyNutrition: () => {
    const { dailyNutrition } = get();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
    
    return dailyNutrition.filter((day) => day.date >= oneMonthAgoStr);
  },
}));
