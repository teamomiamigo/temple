import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNutritionStore } from '../stores/nutritionStore';

type QuickLogScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      mealName: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    };
  };
};

// Common quick log items
const quickLogItems = [
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium' },
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium' },
  { name: 'Orange', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, serving: '1 medium' },
  { name: 'Coffee', calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup' },
  { name: 'Eggs', calories: 70, protein: 6, carbs: 0.6, fat: 5, serving: '1 large' },
  { name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0, serving: '1 cup' },
  { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz' },
  { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fat: 6, serving: '1 bar' },
  { name: 'Milk', calories: 122, protein: 8, carbs: 12, fat: 5, serving: '1 cup' },
  { name: 'Oatmeal', calories: 154, protein: 6, carbs: 27, fat: 3, serving: '1 cup cooked' },
];

export const QuickLogScreen = ({ navigation, route }: QuickLogScreenProps) => {
  const { mealName } = route.params;
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  
  const addMealEntry = useNutritionStore((state) => state.addMealEntry);
  
  const handleQuickLog = () => {
    if (!selectedItem) {
      Alert.alert('No Item Selected', 'Please select an item to log.');
      return;
    }
    
    const quantityNum = parseFloat(quantity) || 1;
    
    addMealEntry(mealName, {
      foodId: `quick-${selectedItem.name.toLowerCase().replace(/\s+/g, '-')}`,
      foodName: selectedItem.name,
      servingSize: selectedItem.serving,
      quantity: quantityNum,
      calories: Math.round(selectedItem.calories * quantityNum),
      protein: Math.round(selectedItem.protein * quantityNum * 10) / 10,
      carbs: Math.round(selectedItem.carbs * quantityNum * 10) / 10,
      fat: Math.round(selectedItem.fat * quantityNum * 10) / 10,
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
        <Text style={styles.headerTitle}>Quick Log - {getMealDisplayName(mealName)}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Tap to quickly log common items</Text>
        
        {/* Quick Log Items */}
        <View style={styles.itemsGrid}>
          {quickLogItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.quickItem,
                selectedItem?.name === item.name && styles.selectedQuickItem
              ]}
              onPress={() => setSelectedItem(item)}
            >
              <Text style={styles.quickItemName}>{item.name}</Text>
              <Text style={styles.quickItemCalories}>{item.calories} cal</Text>
              <Text style={styles.quickItemServing}>{item.serving}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Quantity Input */}
        {selectedItem && (
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#666"
            />
            <Text style={styles.quantityInfo}>
              {selectedItem.serving} per serving
            </Text>
          </View>
        )}
        
        {/* Preview */}
        {selectedItem && quantity && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Quick Log Preview:</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewItemName}>{selectedItem.name}</Text>
              <Text style={styles.previewServing}>
                {quantity} serving{quantity !== '1' ? 's' : ''} ({selectedItem.serving})
              </Text>
              <View style={styles.previewMacros}>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedItem.calories * (parseFloat(quantity) || 1))} cal
                </Text>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedItem.protein * (parseFloat(quantity) || 1) * 10) / 10}g protein
                </Text>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedItem.carbs * (parseFloat(quantity) || 1) * 10) / 10}g carbs
                </Text>
                <Text style={styles.previewMacro}>
                  {Math.round(selectedItem.fat * (parseFloat(quantity) || 1) * 10) / 10}g fat
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      
      {/* Log Button */}
      {selectedItem && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logButton} onPress={handleQuickLog}>
            <Text style={styles.logButtonText}>Quick Log to {getMealDisplayName(mealName)}</Text>
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
  subtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickItem: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedQuickItem: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  quickItemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickItemCalories: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  quickItemServing: {
    color: '#666',
    fontSize: 12,
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
