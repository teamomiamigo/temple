import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { IngredientSpecPopup } from '../components/IngredientSpecPopup';
// import { ApiFoodItem, FoodApi } from '../services/foodApi';
import { getMealDisplayName, getMealEmoji, MealType } from '../utils/mealUtils';

type UnifiedFoodLoggingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface MealItem {
  id: string;
  food: any; // Temporarily use any instead of ApiFoodItem
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

type TabType = 'all' | 'myMeals' | 'myRecipes' | 'myFoods';

export const UnifiedFoodLoggingScreen = ({ navigation }: UnifiedFoodLoggingScreenProps) => {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [showIngredientPopup, setShowIngredientPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [showMealSelector, setShowMealSelector] = useState(false);
  
  // Temporarily comment out store usage to test
  // const addMealEntry = useNutritionStore((state) => state.addMealEntry);
  // const savedMeals = useNutritionStore((state) => state.savedMeals);
  // const recentFoods = useNutritionStore((state) => state.getRecentFoods());
  // const foods = useNutritionStore((state) => state.foods);
  
  // Mock data for testing
  const addMealEntry = () => console.log('Mock addMealEntry called');
  const savedMeals: any[] = [
    { id: 'meal1', name: 'Chicken & Rice', calories: 450, protein: 35, carbs: 40, fat: 12 },
    { id: 'meal2', name: 'Greek Salad', calories: 280, protein: 15, carbs: 20, fat: 18 },
  ];
  const recentFoods: any[] = [
    { id: 'recent1', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: 'recent2', name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 22, fat: 0.9 },
    { id: 'recent3', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
    { id: 'recent4', name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  ];
  const foods: any[] = [];
  
  const meals: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

  // Debug: Log to console to see if component is rendering
  console.log('UnifiedFoodLoggingScreen rendered');
  
  const handleSearch = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock search results based on query
      const allFoods = [
        { id: '1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
        { id: '2', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
        { id: '3', name: 'Orange', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },
        { id: '4', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { id: '5', name: 'Salmon', calories: 208, protein: 25, carbs: 0, fat: 12 },
        { id: '6', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
        { id: '7', name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 22, fat: 0.9 },
        { id: '8', name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11 },
      ];
      
      // Filter foods based on search query
      const results = allFoods.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Search Error', 'Failed to search for foods. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search when query changes
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  const handleFoodSelect = (food: any) => {
    setSelectedFood(food);
    setShowIngredientPopup(true);
  };

  const handleIngredientConfirm = (food: any, quantity: number, servingType: 'servings' | 'grams') => {
    let finalQuantity = quantity;
    let servingSize = food.servingSize;
    
    if (servingType === 'grams') {
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
    if (mealItems.length === 0) {
      Alert.alert('Empty Meal', 'Please add at least one item to your meal.');
      return;
    }

    mealItems.forEach(item => {
      addMealEntry(selectedMeal, {
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
    
    Alert.alert('Success', `Meal added to your ${getMealDisplayName(selectedMeal)}!`);
    navigation.goBack();
  };

  const handleQuickAction = (action: string) => {
    // Placeholder for quick actions
    Alert.alert('Quick Action', `${action} functionality coming soon!`);
  };

  const getTotalCalories = () => {
    return mealItems.reduce((sum, item) => sum + item.calories, 0);
  };

  const getDisplayFoods = () => {
    switch (activeTab) {
      case 'all':
        // If there's a search query, show search results
        // If no search query, show recent foods
        if (searchQuery.trim().length > 0) {
          return searchResults;
        } else {
          return recentFoods;
        }
      case 'myMeals':
        return savedMeals;
      case 'myRecipes':
        return []; // Placeholder
      case 'myFoods':
        return foods;
      default:
        return [];
    }
  };

  const renderFoodItem = (item: any, index: number) => {
    if (activeTab === 'myMeals') {
      // Render saved meal
      return (
        <TouchableOpacity key={item.id} style={styles.foodItem}>
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodServing}>{item.description}</Text>
            <Text style={styles.foodMacros}>
              {item.totalCalories} cal • {item.totalProtein}g protein • {item.useCount} uses
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    // Render regular food item
    return (
      <TouchableOpacity
        key={item.id || index}
        style={styles.foodItem}
        onPress={() => handleFoodSelect(item)}
      >
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodServing}>{item.servingSize}</Text>
          <Text style={styles.foodMacros}>
            {item.calories} cal • {item.protein}g protein • {item.carbs}g carbs • {item.fat}g fat
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        {/* Meal Selector */}
        <TouchableOpacity 
          style={styles.mealSelector}
          onPress={() => setShowMealSelector(true)}
        >
          <Text style={styles.mealSelectorText}>
            {getMealEmoji(selectedMeal)} {getMealDisplayName(selectedMeal)}
          </Text>
          <Text style={styles.mealSelectorArrow}>▼</Text>
        </TouchableOpacity>
        
        {/* Save Button */}
        {mealItems.length > 0 && (
          <TouchableOpacity onPress={handleSaveMeal} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Food"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          {(['all', 'myMeals', 'myRecipes', 'myFoods'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab === 'all' ? 'All' : 
                 tab === 'myMeals' ? 'My Meals' :
                 tab === 'myRecipes' ? 'My Recipes' : 'My Foods'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('Barcode Scan')}
          >
            <Text style={styles.quickActionIcon}>📷</Text>
            <Text style={styles.quickActionText}>Barcode scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('Voice Log')}
          >
            <Text style={styles.quickActionIcon}>🎤</Text>
            <Text style={styles.quickActionText}>Voice log</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('Meal Scan')}
          >
            <Text style={styles.quickActionIcon}>📸</Text>
            <Text style={styles.quickActionText}>Meal scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleQuickAction('Quick Add')}
          >
            <Text style={styles.quickActionIcon}>+</Text>
            <Text style={styles.quickActionText}>Quick add</Text>
          </TouchableOpacity>
        </View>

        {/* Current Meal Items */}
        {mealItems.length > 0 && (
          <View style={styles.currentMealSection}>
            <Text style={styles.sectionTitle}>Your {getMealDisplayName(selectedMeal)}</Text>
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
              <Text style={styles.totalCalories}>{Math.round(getTotalCalories())} calories</Text>
            </View>
          </View>
        )}

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>History</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Most Recent ▼</Text>
            </TouchableOpacity>
          </View>
          
          {getDisplayFoods().length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {activeTab === 'all' ? (searchQuery.trim().length > 0 ? 'No foods found' : 'Start typing to search for foods') :
                 activeTab === 'myMeals' ? 'No saved meals yet' :
                 activeTab === 'myRecipes' ? 'No recipes yet' : 'No custom foods yet'}
              </Text>
            </View>
          ) : (
            <View style={styles.foodList}>
              {getDisplayFoods().map((item, index) => renderFoodItem(item, index))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Meal Selector Modal */}
      <Modal
        visible={showMealSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMealSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Meal</Text>
            {meals.map((meal) => (
              <TouchableOpacity
                key={meal}
                style={[
                  styles.mealOption,
                  selectedMeal === meal && styles.selectedMealOption
                ]}
                onPress={() => {
                  setSelectedMeal(meal);
                  setShowMealSelector(false);
                }}
              >
                <Text style={styles.mealOptionEmoji}>{getMealEmoji(meal)}</Text>
                <Text style={[
                  styles.mealOptionText,
                  selectedMeal === meal && styles.selectedMealOptionText
                ]}>
                  {getMealDisplayName(meal)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      
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
  mealSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mealSelectorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  mealSelectorArrow: {
    color: '#999',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    outlineStyle: 'none', // Remove blue focus border on web
    borderWidth: 0, // Remove any border
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: '#999',
    fontSize: 16,
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
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  currentMealSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
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
    alignItems: 'center',
  },
  totalsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  totalCalories: {
    color: '#007AFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  historySection: {
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonText: {
    color: '#999',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  foodList: {
    gap: 8,
  },
  foodItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  mealOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedMealOption: {
    backgroundColor: '#007AFF',
  },
  mealOptionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  mealOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedMealOptionText: {
    fontWeight: '600',
  },
});
