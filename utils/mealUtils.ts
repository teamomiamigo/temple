// Utility functions for meal detection and management

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

// Time-based meal detection
export const getMealByTime = (): MealType => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 16) {
    return 'lunch';
  } else if (hour >= 16 && hour < 21) {
    return 'dinner';
  } else {
    return 'snacks';
  }
};

// Get meal display name
export const getMealDisplayName = (meal: MealType): string => {
  switch (meal) {
    case 'breakfast': return 'Breakfast';
    case 'lunch': return 'Lunch';
    case 'dinner': return 'Dinner';
    case 'snacks': return 'Snacks';
    default: return meal;
  }
};

// Get meal emoji
export const getMealEmoji = (meal: MealType): string => {
  switch (meal) {
    case 'breakfast': return '🌅';
    case 'lunch': return '☀️';
    case 'dinner': return '🌙';
    case 'snacks': return '🍿';
    default: return '🍽️';
  }
};

// Get meal time range
export const getMealTimeRange = (meal: MealType): string => {
  switch (meal) {
    case 'breakfast': return '5:00 AM - 11:00 AM';
    case 'lunch': return '11:00 AM - 4:00 PM';
    case 'dinner': return '4:00 PM - 9:00 PM';
    case 'snacks': return '9:00 PM - 5:00 AM';
    default: return '';
  }
};

// Check if current time is within meal time
export const isCurrentMealTime = (meal: MealType): boolean => {
  return getMealByTime() === meal;
};

// Get next meal
export const getNextMeal = (): MealType => {
  const currentMeal = getMealByTime();
  
  switch (currentMeal) {
    case 'breakfast': return 'lunch';
    case 'lunch': return 'dinner';
    case 'dinner': return 'snacks';
    case 'snacks': return 'breakfast';
    default: return 'breakfast';
  }
};

// Get previous meal
export const getPreviousMeal = (): MealType => {
  const currentMeal = getMealByTime();
  
  switch (currentMeal) {
    case 'breakfast': return 'snacks';
    case 'lunch': return 'breakfast';
    case 'dinner': return 'lunch';
    case 'snacks': return 'dinner';
    default: return 'snacks';
  }
};
