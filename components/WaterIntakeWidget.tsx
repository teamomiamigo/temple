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
import { colors, shadows } from '../constants/theme';
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
  
  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.waterIconContainer}>
          <Text style={styles.waterIcon}>💧</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Water Intake</Text>
          <Text style={styles.subtitle}>Stay hydrated</Text>
        </View>
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
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  waterIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    ...shadows.medium,
  },
  waterIcon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  intakeDisplay: {
    marginBottom: 20,
  },
  currentAmount: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  remainingAmount: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: colors.glassBackground,
    borderRadius: 4,
    marginRight: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  quickButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    backgroundColor: colors.glassBackground,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  quickButtonEmoji: {
    fontSize: 18,
    marginBottom: 6,
  },
  quickButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  customButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    ...shadows.medium,
  },
  customButtonText: {
    color: colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 300,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  customInput: {
    backgroundColor: colors.glassBackground,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.glassBackground,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});