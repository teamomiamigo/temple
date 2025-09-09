import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IngredientSpecPopup } from '../components/IngredientSpecPopup';
import { ApiFoodItem, FoodApi, FoodApiService } from '../services/foodApi';
import { useNutritionStore } from '../stores/nutritionStore';

type LogMealScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      mealName: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    };
  };
};

interface MealItem {
  id: string;
  food: ApiFoodItem;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const LogMealScreen = ({ navigation, route }: LogMealScreenProps) => {
  const { mealName } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ApiFoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<ApiFoodItem | null>(null);
  const [showIngredientPopup, setShowIngredientPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');
  
  const addMealEntry = useNutritionStore((state) => state.addMealEntry);
  const saveMeal = useNutritionStore((state) => state.saveMeal);
  const savedMeals = useNutritionStore((state) => state.savedMeals);
  const useSavedMeal = useNutritionStore((state) => state.useSavedMeal);
  
  // Debug: Log saved meals
  console.log('Saved meals in LogMealScreen:', savedMeals);
  
  const getMealDisplayName = (meal: string) => {
    switch (meal) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snacks': return 'Snacks';
      default: return meal;
    }
  };
  
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const results = await FoodApi.searchFoods(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Search Error', 'Failed to search for foods. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleTestAPI = async () => {
    Alert.alert('Testing API', 'Testing USDA API connection...');
    const isConnected = await FoodApiService.testConnection();
    Alert.alert(
      'API Test Result', 
      isConnected ? '✅ API connection successful!' : '❌ API connection failed. Check console for details.'
    );
  };
  
  const handleFoodSelect = (food: ApiFoodItem) => {
    setSelectedFood(food);
    setShowIngredientPopup(true);
  };

  const handleIngredientConfirm = (food: ApiFoodItem, quantity: number, servingType: 'servings' | 'grams') => {
    let finalQuantity = quantity;
    let servingSize = food.servingSize;
    
    if (servingType === 'grams') {
      // Convert grams to servings
      finalQuantity = quantity / food.servingSizeGrams;
      servingSize = `${quantity}g`;
    }
    
    const newItem: MealItem = {
      id: Date.now().toString(),
      food: {
        ...food,
        servingSize: servingSize,
      },
      quantity: finalQuantity,
      calories: Math.round(food.calories * finalQuantity),
      protein: Math.round(food.protein * finalQuantity * 10) / 10,
      carbs: Math.round(food.carbs * finalQuantity * 10) / 10,
      fat: Math.round(food.fat * finalQuantity * 10) / 10,
    };
    
    setMealItems([...mealItems, newItem]);
    setSelectedFood(null);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  const handleRemoveItem = (itemId: string) => {
    setMealItems(mealItems.filter(item => item.id !== itemId));
  };
  
  const handleSaveMeal = () => {
    console.log('handleSaveMeal called, mealItems length:', mealItems.length);
    if (mealItems.length === 0) {
      Alert.alert('Empty Meal', 'Please add at least one item to your meal.');
      return;
    }

    // For web compatibility, use a simple prompt instead of Alert.prompt
    const mealNameInput = prompt(`Save to ${getMealDisplayName(mealName)}\n\nEnter a name for this meal:`);
    console.log('Save meal prompt result:', mealNameInput);
    
    if (mealNameInput && mealNameInput.trim()) {
      console.log('Adding meal items to daily log...');
      // Add to current meal only (don't save as template)
      mealItems.forEach(item => {
        console.log('Adding item:', item.food.name);
        addMealEntry(mealName, {
          foodId: item.food.id,
          foodName: item.food.name,
          servingSize: item.food.servingSize,
          quantity: item.quantity,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.food.fiber,
          sugar: item.food.sugar,
          sodium: item.food.sodium,
        });
      });
      
      Alert.alert('Success', `Meal "${mealNameInput.trim()}" added to your ${getMealDisplayName(mealName)}!`);
      navigation.goBack();
    } else if (mealNameInput !== null) {
      Alert.alert('Error', 'Please enter a meal name.');
    }
  };

  const handleSaveAsTemplate = () => {
    console.log('handleSaveAsTemplate called, mealItems length:', mealItems.length);
    if (mealItems.length === 0) {
      Alert.alert('Empty Meal', 'Please add at least one item to your meal.');
      return;
    }

    // For web compatibility, use a simple prompt instead of Alert.prompt
    const templateName = prompt('Make this into a saved meal\n\nEnter a name for this meal template:');
    console.log('Save template prompt result:', templateName);
    
    if (templateName && templateName.trim()) {
      console.log('Saving meal as template...');
      // Convert meal items to meal entries
      const mealEntries = mealItems.map(item => ({
        id: item.id,
        foodId: item.food.id,
        foodName: item.food.name,
        servingSize: item.food.servingSize,
        quantity: item.quantity,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.food.fiber,
        sugar: item.food.sugar,
        sodium: item.food.sodium,
        timestamp: Date.now(),
      }));

      // Create a meal with all entries
      const meal = {
        id: Date.now().toString(),
        name: templateName.trim(),
        entries: mealEntries,
        timestamp: Date.now(),
      };

      console.log('Saving template with meal:', meal);
      // Save as template
      saveMeal({
        name: templateName.trim(),
        description: `${mealItems.length} items`,
        meals: [meal],
        totalCalories: getTotalCalories(),
        totalProtein: getTotalProtein(),
        totalCarbs: getTotalCarbs(),
        totalFat: getTotalFat(),
      });

      console.log('Adding items to current meal...');
      // Also add to current meal
      mealItems.forEach(item => {
        console.log('Adding item to current meal:', item.food.name);
        addMealEntry(mealName, {
          foodId: item.food.id,
          foodName: item.food.name,
          servingSize: item.food.servingSize,
          quantity: item.quantity,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          fiber: item.food.fiber,
          sugar: item.food.sugar,
          sodium: item.food.sodium,
        });
      });

      Alert.alert('Success', `Meal "${templateName.trim()}" saved as template and added to your ${getMealDisplayName(mealName)}!`);
      navigation.goBack();
    } else if (templateName !== null) {
      Alert.alert('Error', 'Please enter a meal name.');
    }
  };

  const handleUseSavedMeal = (savedMealId: string) => {
    console.log('handleUseSavedMeal called with:', savedMealId);
    const savedMeal = savedMeals.find(meal => meal.id === savedMealId);
    console.log('Found saved meal:', savedMeal);
    
    if (savedMeal) {
      // Convert saved meal items to current meal items
      const newMealItems: MealItem[] = savedMeal.meals.flatMap(meal => 
        meal.entries.map(entry => ({
          id: `${entry.id}-${Date.now()}`,
          food: {
            id: entry.foodId,
            name: entry.foodName,
            servingSize: entry.servingSize,
            servingSizeGrams: 100, // Default value
            calories: entry.calories / entry.quantity,
            protein: entry.protein / entry.quantity,
            carbs: entry.carbs / entry.quantity,
            fat: entry.fat / entry.quantity,
            fiber: entry.fiber || 0,
            sugar: entry.sugar || 0,
            sodium: entry.sodium || 0,
          },
          quantity: entry.quantity,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
        }))
      );
      
      console.log('New meal items:', newMealItems);
      setMealItems([...mealItems, ...newMealItems]);
      Alert.alert('Success', 'Saved meal items added to your current meal!');
    } else {
      Alert.alert('Error', 'Saved meal not found');
    }
  };

  const handleModifySavedMeal = (savedMealId: string) => {
    console.log('handleModifySavedMeal called with:', savedMealId);
    const savedMeal = savedMeals.find(meal => meal.id === savedMealId);
    console.log('Found saved meal for modify:', savedMeal);
    
    if (savedMeal) {
      // Convert saved meal items to current meal items for editing
      const newMealItems: MealItem[] = savedMeal.meals.flatMap(meal => 
        meal.entries.map(entry => ({
          id: `${entry.id}-${Date.now()}`,
          food: {
            id: entry.foodId,
            name: entry.foodName,
            servingSize: entry.servingSize,
            servingSizeGrams: 100, // Default value
            calories: entry.calories / entry.quantity,
            protein: entry.protein / entry.quantity,
            carbs: entry.carbs / entry.quantity,
            fat: entry.fat / entry.quantity,
            fiber: entry.fiber || 0,
            sugar: entry.sugar || 0,
            sodium: entry.sodium || 0,
          },
          quantity: entry.quantity,
          calories: entry.calories,
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
        }))
      );
      
      console.log('New meal items for modify:', newMealItems);
      setMealItems(newMealItems);
      setActiveTab('saved'); // Keep on saved tab to show the items
      Alert.alert('Meal Loaded', 'Saved meal loaded for editing. You can now modify it before saving.');
    } else {
      Alert.alert('Error', 'Saved meal not found for modification');
    }
  };
  
  const getTotalCalories = () => {
    return mealItems.reduce((sum, item) => sum + item.calories, 0);
  };
  
  const getTotalProtein = () => {
    return mealItems.reduce((sum, item) => sum + item.protein, 0);
  };
  
  const getTotalCarbs = () => {
    return mealItems.reduce((sum, item) => sum + item.carbs, 0);
  };
  
  const getTotalFat = () => {
    return mealItems.reduce((sum, item) => sum + item.fat, 0);
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log {getMealDisplayName(mealName)}</Text>
        <TouchableOpacity onPress={handleSaveAsTemplate} style={styles.saveTemplateButton}>
          <Text style={styles.saveTemplateButtonText}>Save Template</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'search' && styles.activeTab]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
              🔍 Search Foods
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
              📚 Saved Meals
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Section */}
        {activeTab === 'search' && (
          <View style={styles.searchSection}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for foods..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>
            
            {/* Test API Button */}
            <TouchableOpacity onPress={handleTestAPI} style={styles.testButton}>
              <Text style={styles.testButtonText}>🧪 Test USDA API</Text>
            </TouchableOpacity>
            
            {isSearching && (
              <Text style={styles.searchingText}>Searching...</Text>
            )}
          </View>
        )}

        {/* Saved Meals Section */}
        {activeTab === 'saved' && (
          <View style={styles.savedMealsSection}>
            {/* Current Meal Items */}
            {mealItems.length > 0 && (
              <View style={styles.mealSection}>
                <Text style={styles.sectionTitle}>Your {getMealDisplayName(mealName)}</Text>
                {mealItems.map((item) => (
                  <View key={item.id} style={styles.mealItem}>
                    <View style={styles.mealItemInfo}>
                      <Text style={styles.mealItemName}>{item.food.name}</Text>
                      <Text style={styles.mealItemQuantity}>
                        {item.quantity} serving{item.quantity !== 1 ? 's' : ''} ({item.food.servingSize})
                      </Text>
                      <Text style={styles.mealItemMacros}>
                        {item.calories} cal • {item.protein}g protein • {item.carbs}g carbs • {item.fat}g fat
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                
                {/* Meal Totals */}
                <View style={styles.mealTotals}>
                  <Text style={styles.totalsTitle}>Meal Totals</Text>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalLabel}>Calories:</Text>
                    <Text style={styles.totalValue}>{Math.round(getTotalCalories())}</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalLabel}>Protein:</Text>
                    <Text style={styles.totalValue}>{Math.round(getTotalProtein() * 10) / 10}g</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalLabel}>Carbs:</Text>
                    <Text style={styles.totalValue}>{Math.round(getTotalCarbs() * 10) / 10}g</Text>
                  </View>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalLabel}>Fat:</Text>
                    <Text style={styles.totalValue}>{Math.round(getTotalFat() * 10) / 10}g</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Saved Meals List */}
            {savedMeals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No Saved Meals</Text>
                <Text style={styles.emptyStateText}>
                  Create meal templates by adding foods and saving them as templates.
                </Text>
              </View>
            ) : (
              <View style={styles.savedMealsList}>
                {savedMeals.map((savedMeal) => (
                  <View key={savedMeal.id} style={styles.savedMealCard}>
                    <TouchableOpacity
                      style={styles.savedMealMain}
                      onPress={() => handleUseSavedMeal(savedMeal.id)}
                    >
                      <View style={styles.savedMealInfo}>
                        <Text style={styles.savedMealName}>{savedMeal.name}</Text>
                        <Text style={styles.savedMealDescription}>{savedMeal.description}</Text>
                        <Text style={styles.savedMealStats}>
                          {savedMeal.totalCalories} cal • {savedMeal.totalProtein}g protein • {savedMeal.useCount} uses
                        </Text>
                      </View>
                      <Text style={styles.useIcon}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modifyButton}
                      onPress={() => handleModifySavedMeal(savedMeal.id)}
                    >
                      <Text style={styles.modifyButtonText}>✏️</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        
        {/* Search Results */}
        {activeTab === 'search' && searchResults.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {searchResults.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={styles.foodItem}
                onPress={() => handleFoodSelect(food)}
              >
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodServing}>{food.servingSize}</Text>
                  <Text style={styles.foodMacros}>
                    {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                  </Text>
                </View>
                <Text style={styles.addIcon}>+</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
      </ScrollView>
      
      {/* Save Buttons */}
      {mealItems.length > 0 && (
        <View style={styles.bottomSaveButton}>
          <TouchableOpacity 
            style={styles.saveTemplateButtonBottom} 
            onPress={() => {
              console.log('Save template button pressed');
              handleSaveAsTemplate();
            }}
          >
            <Text style={styles.saveTemplateButtonTextBottom}>💾 Make this into a saved meal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => {
              console.log('Save meal button pressed');
              handleSaveMeal();
            }}
          >
            <Text style={styles.saveButtonText}>Save to {getMealDisplayName(mealName)}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Ingredient Specification Popup */}
      <IngredientSpecPopup
        visible={showIngredientPopup}
        food={selectedFood}
        onClose={() => setShowIngredientPopup(false)}
        onConfirm={handleIngredientConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveTemplateButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveTemplateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSaveButton: {
    padding: 20,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 12,
  },
  saveTemplateButtonBottom: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveTemplateButtonTextBottom: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  savedMealsSection: {
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  savedMealsList: {
    gap: 12,
  },
  savedMealCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  savedMealMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  savedMealInfo: {
    flex: 1,
  },
  savedMealName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savedMealDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  savedMealStats: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '500',
  },
  useIcon: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modifyButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  modifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchSection: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchingText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  searchResults: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  foodItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedFoodItem: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodServing: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  foodMacros: {
    color: '#666',
    fontSize: 12,
  },
  addIcon: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantitySection: {
    marginBottom: 20,
  },
  quantityLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityInput: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mealSection: {
    marginBottom: 20,
  },
  mealItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealItemInfo: {
    flex: 1,
  },
  mealItemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mealItemQuantity: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  mealItemMacros: {
    color: '#666',
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: '#ff4757',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mealTotals: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  totalsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    color: '#999',
    fontSize: 14,
  },
  totalValue: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
