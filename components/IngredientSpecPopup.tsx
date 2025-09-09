import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ApiFoodItem } from '../services/foodApi';

interface IngredientSpecPopupProps {
  visible: boolean;
  food: ApiFoodItem | null;
  onClose: () => void;
  onConfirm: (food: ApiFoodItem, quantity: number, servingType: 'servings' | 'grams') => void;
}

export const IngredientSpecPopup = ({ visible, food, onClose, onConfirm }: IngredientSpecPopupProps) => {
  const [quantity, setQuantity] = useState('1');
  const [servingType, setServingType] = useState<'servings' | 'grams'>('servings');

  if (!food) return null;

  const handleConfirm = () => {
    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity.');
      return;
    }

    onConfirm(food, quantityNum, servingType);
    onClose();
  };

  const getServingSize = () => {
    if (servingType === 'grams') {
      return `${quantity}g`;
    } else {
      const servings = parseFloat(quantity) || 1;
      return servings === 1 ? food.servingSize : `${servings} servings (${food.servingSize} each)`;
    }
  };

  const getNutritionInfo = () => {
    const quantityNum = parseFloat(quantity) || 1;
    
    if (servingType === 'grams') {
      // Convert grams to servings based on servingSizeGrams
      const servings = quantityNum / food.servingSizeGrams;
      return {
        calories: Math.round(food.calories * servings),
        protein: Math.round(food.protein * servings * 10) / 10,
        carbs: Math.round(food.carbs * servings * 10) / 10,
        fat: Math.round(food.fat * servings * 10) / 10,
      };
    } else {
      return {
        calories: Math.round(food.calories * quantityNum),
        protein: Math.round(food.protein * quantityNum * 10) / 10,
        carbs: Math.round(food.carbs * quantityNum * 10) / 10,
        fat: Math.round(food.fat * quantityNum * 10) / 10,
      };
    }
  };

  const nutrition = getNutritionInfo();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Specify Ingredient</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Food Info */}
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodServing}>Default: {food.servingSize}</Text>
            {food.brand && <Text style={styles.foodBrand}>Brand: {food.brand}</Text>}
          </View>

          {/* Quantity Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Quantity:</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#666"
            />
          </View>

          {/* Serving Type Selection */}
          <View style={styles.servingTypeSection}>
            <Text style={styles.inputLabel}>Measure by:</Text>
            <View style={styles.servingTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.servingTypeButton,
                  servingType === 'servings' && styles.servingTypeButtonActive
                ]}
                onPress={() => setServingType('servings')}
              >
                <Text style={[
                  styles.servingTypeButtonText,
                  servingType === 'servings' && styles.servingTypeButtonTextActive
                ]}>
                  Servings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.servingTypeButton,
                  servingType === 'grams' && styles.servingTypeButtonActive
                ]}
                onPress={() => setServingType('grams')}
              >
                <Text style={[
                  styles.servingTypeButtonText,
                  servingType === 'grams' && styles.servingTypeButtonTextActive
                ]}>
                  Grams
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nutrition Preview */}
          <View style={styles.nutritionPreview}>
            <Text style={styles.previewTitle}>Nutrition Preview:</Text>
            <Text style={styles.previewServing}>{getServingSize()}</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{nutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>fat</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Add to Meal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#222',
    borderRadius: 12,
  },
  foodName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodServing: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
  foodBrand: {
    color: '#666',
    fontSize: 12,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
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
    borderWidth: 1,
    borderColor: '#333',
  },
  servingTypeSection: {
    marginBottom: 20,
  },
  servingTypeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  servingTypeButton: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  servingTypeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  servingTypeButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  servingTypeButtonTextActive: {
    color: '#fff',
  },
  nutritionPreview: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewServing: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  nutritionLabel: {
    color: '#666',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
