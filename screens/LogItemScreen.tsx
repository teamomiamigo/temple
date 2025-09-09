import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IngredientSpecPopup } from '../components/IngredientSpecPopup';
import { ApiFoodItem, FoodApi, FoodApiService } from '../services/foodApi';
import { useNutritionStore } from '../stores/nutritionStore';

type LogItemScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      mealName: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    };
  };
};

export const LogItemScreen = ({ navigation, route }: LogItemScreenProps) => {
  const { mealName } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ApiFoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<ApiFoodItem | null>(null);
  const [showIngredientPopup, setShowIngredientPopup] = useState(false);
  
  const addMealEntry = useNutritionStore((state) => state.addMealEntry);
  
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
    
    addMealEntry(mealName, {
      foodId: food.id,
      foodName: food.name,
      servingSize: servingSize,
      quantity: finalQuantity,
      calories: Math.round(food.calories * finalQuantity),
      protein: Math.round(food.protein * finalQuantity * 10) / 10,
      carbs: Math.round(food.carbs * finalQuantity * 10) / 10,
      fat: Math.round(food.fat * finalQuantity * 10) / 10,
      fiber: food.fiber,
      sugar: food.sugar,
      sodium: food.sodium,
    });
    
    navigation.goBack();
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Item to {getMealDisplayName(mealName)}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a food item..."
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
        
        {/* Search Results */}
        {searchResults.length > 0 && (
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
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
    marginBottom: 4,
  },
  quantityInfo: {
    color: '#666',
    fontSize: 14,
  },
  previewSection: {
    marginBottom: 20,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
  },
  previewItemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewServing: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
  },
  previewMacros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewMacro: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  logButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
