import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FoodItem, useNutritionStore } from '../stores/nutritionStore';

// Food Item Component
const FoodItemComponent = ({ 
  food, 
  selectedFood, 
  onSelect, 
  onToggleFavorite 
}: { 
  food: FoodItem; 
  selectedFood: FoodItem | null; 
  onSelect: (food: FoodItem) => void;
  onToggleFavorite: (foodId: string) => void;
}) => {
  const favoriteFoods = useNutritionStore((state) => state.favoriteFoods);
  const isFavorite = favoriteFoods.includes(food.id);
  
  return (
    <TouchableOpacity
      style={[
        styles.foodItem,
        selectedFood?.id === food.id && styles.selectedFoodItem
      ]}
      onPress={() => onSelect(food)}
    >
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodServing}>{food.servingSize}</Text>
        <Text style={styles.foodMacros}>
          {food.calories} cal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
        </Text>
      </View>
      <View style={styles.foodActions}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(food.id)}
        >
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
        {selectedFood?.id === food.id && (
          <Text style={styles.selectedIcon}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

type AddMealScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      mealName: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    };
  };
};

export const AddMealScreen = ({ navigation, route }: AddMealScreenProps) => {
  const { mealName } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  const [activeTab, setActiveTab] = useState<'search' | 'recent' | 'favorites'>('search');
  
  const foods = useNutritionStore((state) => state.searchFoods(searchQuery));
  const recentFoods = useNutritionStore((state) => state.getRecentFoods());
  const favoriteFoods = useNutritionStore((state) => state.getFavoriteFoods());
  const addMealEntry = useNutritionStore((state) => state.addMealEntry);
  const toggleFavorite = useNutritionStore((state) => state.toggleFavorite);
  
  const handleAddFood = () => {
    if (!selectedFood) {
      Alert.alert('No Food Selected', 'Please select a food to add.');
      return;
    }
    
    const quantityNum = parseFloat(quantity) || 1;
    
    addMealEntry(mealName, {
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      servingSize: selectedFood.servingSize,
      quantity: quantityNum,
      calories: Math.round(selectedFood.calories * quantityNum),
      protein: Math.round(selectedFood.protein * quantityNum * 10) / 10,
      carbs: Math.round(selectedFood.carbs * quantityNum * 10) / 10,
      fat: Math.round(selectedFood.fat * quantityNum * 10) / 10,
      fiber: selectedFood.fiber ? Math.round(selectedFood.fiber * quantityNum * 10) / 10 : undefined,
      sugar: selectedFood.sugar ? Math.round(selectedFood.sugar * quantityNum * 10) / 10 : undefined,
      sodium: selectedFood.sodium ? Math.round(selectedFood.sodium * quantityNum) : undefined,
    });
    
    navigation.goBack();
  };
  
  const getMealDisplayName = (meal: string) => {
    switch (meal) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snacks': return 'Snacks';
      default: return meal;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add to {getMealDisplayName(mealName)}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Search */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'search' && styles.activeTab]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
              Search
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
            onPress={() => setActiveTab('recent')}
          >
            <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
              Recent
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Food List */}
        <View style={styles.foodList}>
          {activeTab === 'search' && searchQuery.length > 0 && foods.map((food) => (
            <FoodItemComponent
              key={food.id}
              food={food}
              selectedFood={selectedFood}
              onSelect={setSelectedFood}
              onToggleFavorite={toggleFavorite}
            />
          ))}
          
          {activeTab === 'recent' && recentFoods.map((food) => (
            <FoodItemComponent
              key={food.id}
              food={food}
              selectedFood={selectedFood}
              onSelect={setSelectedFood}
              onToggleFavorite={toggleFavorite}
            />
          ))}
          
          {activeTab === 'favorites' && favoriteFoods.map((food) => (
            <FoodItemComponent
              key={food.id}
              food={food}
              selectedFood={selectedFood}
              onSelect={setSelectedFood}
              onToggleFavorite={toggleFavorite}
            />
          ))}
          
          {activeTab === 'search' && searchQuery.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Start typing to search for foods</Text>
            </View>
          )}
          
          {activeTab === 'recent' && recentFoods.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent foods yet</Text>
            </View>
          )}
          
          {activeTab === 'favorites' && favoriteFoods.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No favorite foods yet</Text>
            </View>
          )}
        </View>
        
        {/* Quantity Input */}
        {selectedFood && (
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity (servings):</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#666"
            />
            <Text style={styles.quantityInfo}>
              {selectedFood.servingSize} per serving
            </Text>
          </View>
        )}
        
        {/* Nutrition Preview */}
        {selectedFood && quantity && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Nutrition Preview:</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewFoodName}>{selectedFood.name}</Text>
              <Text style={styles.previewServing}>
                {quantity} serving{quantity !== '1' ? 's' : ''} ({selectedFood.servingSize})
              </Text>
              <View style={styles.previewMacros}>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedFood.calories * (parseFloat(quantity) || 1))} cal
                </Text>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedFood.protein * (parseFloat(quantity) || 1) * 10) / 10}g protein
                </Text>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedFood.carbs * (parseFloat(quantity) || 1) * 10) / 10}g carbs
                </Text>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedFood.fat * (parseFloat(quantity) || 1) * 10) / 10}g fat
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Add Button */}
      {selectedFood && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text style={styles.addButtonText}>Add to {getMealDisplayName(mealName)}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  searchInput: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
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
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  foodList: {
    marginBottom: 20,
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
  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    color: '#666',
    fontSize: 18,
  },
  favoriteIconActive: {
    color: '#ff4757',
  },
  selectedIcon: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
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
  previewFoodName: {
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
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
