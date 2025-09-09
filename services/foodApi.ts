// Food API Service for fetching nutrition data
// Using USDA FoodData Central API (free) and Edamam as backup

export interface ApiFoodItem {
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
  barcode?: string;
}

// USDA FoodData Central API
const USDA_API_KEY = '6Att1OUVY7jNQg3yTZF6UkZgZqBsp4F6vTikAIPY';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// Edamam Food Database API (backup)
const EDAMAM_APP_ID = 'YOUR_APP_ID'; // Replace with your app ID
const EDAMAM_APP_KEY = 'YOUR_APP_KEY'; // Replace with your app key
const EDAMAM_BASE_URL = 'https://api.edamam.com/api/food-database/v2';

export class FoodApiService {
  // Test API connection
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=apple&pageSize=1`
      );
      
      if (response.ok) {
        console.log('✅ USDA API connection successful');
        return true;
      } else {
        console.error('❌ USDA API connection failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ USDA API connection error:', error);
      return false;
    }
  }
  
  // Search foods using USDA API
  static async searchFoodsUSDA(query: string): Promise<ApiFoodItem[]> {
    try {
      const response = await fetch(
        `${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=20`
      );
      
      if (!response.ok) {
        throw new Error(`USDA API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.foods || !Array.isArray(data.foods)) {
        console.log('No foods found in USDA API response');
        return [];
      }
      
      return data.foods.map((food: any) => ({
        id: `usda-${food.fdcId}`,
        name: food.description || 'Unknown Food',
        brand: food.brandOwner || undefined,
        servingSize: '100g',
        servingSizeGrams: 100,
        calories: this.getNutrientValue(food.foodNutrients, 'Energy'),
        protein: this.getNutrientValue(food.foodNutrients, 'Protein'),
        carbs: this.getNutrientValue(food.foodNutrients, 'Carbohydrate, by difference'),
        fat: this.getNutrientValue(food.foodNutrients, 'Total lipid (fat)'),
        fiber: this.getNutrientValue(food.foodNutrients, 'Fiber, total dietary'),
        sugar: this.getNutrientValue(food.foodNutrients, 'Sugars, total including NLEA'),
        sodium: this.getNutrientValue(food.foodNutrients, 'Sodium, Na'),
      }));
    } catch (error) {
      console.error('USDA API Error:', error);
      return [];
    }
  }
  
  // Search foods using Edamam API (backup)
  static async searchFoodsEdamam(query: string): Promise<ApiFoodItem[]> {
    try {
      const response = await fetch(
        `${EDAMAM_BASE_URL}/parser?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error('Edamam API request failed');
      }
      
      const data = await response.json();
      
      return data.hints?.map((hint: any) => {
        const food = hint.food;
        const nutrients = food.nutrients;
        
        return {
          id: `edamam-${food.foodId}`,
          name: food.label,
          brand: food.brand,
          servingSize: '100g',
          servingSizeGrams: 100,
          calories: nutrients.ENERC_KCAL || 0,
          protein: nutrients.PROCNT || 0,
          carbs: nutrients.CHOCDF || 0,
          fat: nutrients.FAT || 0,
          fiber: nutrients.FIBTG || 0,
          sugar: nutrients.SUGAR || 0,
          sodium: nutrients.NA || 0,
        };
      }) || [];
    } catch (error) {
      console.error('Edamam API Error:', error);
      return [];
    }
  }
  
  // Main search function that tries both APIs
  static async searchFoods(query: string): Promise<ApiFoodItem[]> {
    console.log(`Searching for: "${query}"`);
    
    // Try USDA first, fallback to Edamam
    let results = await this.searchFoodsUSDA(query);
    console.log(`USDA API returned ${results.length} results`);
    
    if (results.length === 0) {
      console.log('Trying Edamam API as fallback...');
      results = await this.searchFoodsEdamam(query);
      console.log(`Edamam API returned ${results.length} results`);
    }
    
    return results;
  }
  
  // Get nutrient value from USDA food nutrients array
  private static getNutrientValue(nutrients: any[], nutrientName: string): number {
    if (!nutrients || !Array.isArray(nutrients)) {
      return 0;
    }
    
    const nutrient = nutrients.find((n: any) => {
      // Handle different nutrient name formats
      const name = n.nutrient?.name || n.nutrientName || '';
      return name.toLowerCase().includes(nutrientName.toLowerCase()) || 
             name === nutrientName;
    });
    
    return nutrient?.amount || nutrient?.value || 0;
  }
  
  // Get detailed food information by FDC ID
  static async getFoodDetails(fdcId: string): Promise<ApiFoodItem | null> {
    try {
      const response = await fetch(
        `${USDA_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`USDA API request failed: ${response.status} ${response.statusText}`);
      }
      
      const food = await response.json();
      
      return {
        id: `usda-${food.fdcId}`,
        name: food.description || 'Unknown Food',
        brand: food.brandOwner || undefined,
        servingSize: '100g',
        servingSizeGrams: 100,
        calories: this.getNutrientValue(food.foodNutrients, 'Energy'),
        protein: this.getNutrientValue(food.foodNutrients, 'Protein'),
        carbs: this.getNutrientValue(food.foodNutrients, 'Carbohydrate, by difference'),
        fat: this.getNutrientValue(food.foodNutrients, 'Total lipid (fat)'),
        fiber: this.getNutrientValue(food.foodNutrients, 'Fiber, total dietary'),
        sugar: this.getNutrientValue(food.foodNutrients, 'Sugars, total including NLEA'),
        sodium: this.getNutrientValue(food.foodNutrients, 'Sodium, Na'),
      };
    } catch (error) {
      console.error('USDA API Error:', error);
      return null;
    }
  }
  
  // Get food by barcode (using Edamam)
  static async getFoodByBarcode(barcode: string): Promise<ApiFoodItem | null> {
    try {
      const response = await fetch(
        `${EDAMAM_BASE_URL}/parser?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&upc=${barcode}`
      );
      
      if (!response.ok) {
        throw new Error('Barcode lookup failed');
      }
      
      const data = await response.json();
      
      if (data.hints && data.hints.length > 0) {
        const food = data.hints[0].food;
        const nutrients = food.nutrients;
        
        return {
          id: `barcode-${barcode}`,
          name: food.label,
          brand: food.brand,
          servingSize: '100g',
          servingSizeGrams: 100,
          calories: nutrients.ENERC_KCAL || 0,
          protein: nutrients.PROCNT || 0,
          carbs: nutrients.CHOCDF || 0,
          fat: nutrients.FAT || 0,
          fiber: nutrients.FIBTG || 0,
          sugar: nutrients.SUGAR || 0,
          sodium: nutrients.NA || 0,
          barcode: barcode,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Barcode lookup error:', error);
      return null;
    }
  }
}

// For development/testing, we'll use a mock service that returns our existing data
export class MockFoodApiService {
  static async searchFoods(query: string): Promise<ApiFoodItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return our existing sample foods filtered by query
    const sampleFoods = [
      { id: '1', name: 'Chicken Breast', servingSize: '100g', servingSizeGrams: 100, calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
      { id: '2', name: 'Salmon', servingSize: '100g', servingSizeGrams: 100, calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 44 },
      { id: '3', name: 'Eggs', servingSize: '1 large', servingSizeGrams: 50, calories: 70, protein: 6, carbs: 0.6, fat: 5, fiber: 0, sugar: 0.6, sodium: 70 },
      { id: '4', name: 'Brown Rice', servingSize: '1 cup cooked', servingSizeGrams: 195, calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, sodium: 10 },
      { id: '5', name: 'Banana', servingSize: '1 medium', servingSizeGrams: 118, calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14.4, sodium: 1 },
      { id: '6', name: 'Apple', servingSize: '1 medium', servingSizeGrams: 182, calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2 },
      { id: '7', name: 'Greek Yogurt', servingSize: '1 cup', servingSizeGrams: 170, calories: 100, protein: 17, carbs: 6, fat: 0, fiber: 0, sugar: 6, sodium: 50 },
      { id: '8', name: 'Almonds', servingSize: '1 oz (28g)', servingSizeGrams: 28, calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, sodium: 1 },
    ];
    
    const lowercaseQuery = query.toLowerCase();
    return sampleFoods.filter(food => 
      food.name.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  static async getFoodByBarcode(barcode: string): Promise<ApiFoodItem | null> {
    // Mock barcode lookup
    await new Promise(resolve => setTimeout(resolve, 500));
    return null;
  }
}

// Export the service to use (switch between real API and mock)
export const FoodApi = FoodApiService; // Now using real USDA API
