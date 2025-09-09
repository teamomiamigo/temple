import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNutritionStore } from '../stores/nutritionStore';

interface WaterIntakeWidgetProps {
  style?: any;
}

export const WaterIntakeWidget: React.FC<WaterIntakeWidgetProps> = ({ style }) => {
  const { goals, getTodayNutrition, updateWaterIntake } = useNutritionStore();
  const todayNutrition = getTodayNutrition();
  
  const currentIntake = todayNutrition?.waterIntake || 0;
  const waterGoal = goals.water || 2500; // Default to 2500ml (3/4 gallon)
  const progress = Math.min(currentIntake / waterGoal, 1);
  const remaining = Math.max(0, waterGoal - currentIntake);
  
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  
  // Animation for progress bar
  const progressAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [progress]);
  
  const handleQuickAdd = (amount: number) => {
    const newAmount = currentIntake + amount;
    updateWaterIntake(newAmount);
    
    // Haptic feedback simulation (you can add actual haptic feedback here)
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleCustomAdd = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }
    
    const newAmount = currentIntake + amount;
    updateWaterIntake(newAmount);
    setCustomAmount('');
    setShowCustomInput(false);
  };
  
  const formatAmount = (ml: number) => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(1)}L`;
    }
    return `${ml}ml`;
  };
  
  const formatOunces = (ml: number) => {
    const oz = Math.round(ml * 0.033814);
    return `${oz}oz`;
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.waterIcon}>💧</Text>
        <Text style={styles.title}>Water Intake</Text>
      </View>
      
      {/* Current Intake vs Goal */}
      <View style={styles.intakeDisplay}>
        <Text style={styles.currentAmount}>
          {formatAmount(currentIntake)} / {formatAmount(waterGoal)}
        </Text>
        <Text style={styles.remainingAmount}>
          {formatAmount(remaining)} remaining
        </Text>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressPercentage}>
          {Math.round(progress * 100)}%
        </Text>
      </View>
      
      {/* Quick Add Buttons */}
      <View style={styles.quickButtonsContainer}>
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => handleQuickAdd(237)} // 8oz = 237ml
        >
          <Text style={styles.quickButtonEmoji}>☕</Text>
          <Text style={styles.quickButtonText}>8oz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => handleQuickAdd(710)} // 24oz = 710ml
        >
          <Text style={styles.quickButtonEmoji}>🍼</Text>
          <Text style={styles.quickButtonText}>24oz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.quickButton}
          onPress={() => handleQuickAdd(500)}
        >
          <Text style={styles.quickButtonEmoji}>🥤</Text>
          <Text style={styles.quickButtonText}>500ml</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.customButton}
          onPress={() => setShowCustomInput(true)}
        >
          <Text style={styles.customButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {/* Custom Input Modal */}
      <Modal
        visible={showCustomInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Amount</Text>
            <TextInput
              style={styles.customInput}
              placeholder="Enter amount in ml"
              placeholderTextColor="#666"
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="numeric"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCustomInput(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleCustomAdd}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  intakeDisplay: {
    marginBottom: 16,
  },
  currentAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  remainingAmount: {
    color: '#999',
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressPercentage: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  quickButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    backgroundColor: '#222',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  quickButtonEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  customButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 18,
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
    padding: 24,
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
  customInput: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
