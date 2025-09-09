import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AnimatedPlusButtonProps {
  onLogMeal: () => void;
  onLogItem: () => void;
}

export const AnimatedPlusButton = ({ onLogMeal, onLogItem }: AnimatedPlusButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mealOptionAnim = useRef(new Animated.Value(0)).current;
  const itemOptionAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (isOpen) {
      // Close animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(mealOptionAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(itemOptionAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsOpen(false);
      });
    } else {
      // Open animation
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(mealOptionAnim, {
          toValue: 1,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemOptionAnim, {
          toValue: 1,
          duration: 300,
          delay: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleLogMeal = () => {
    setIsOpen(false);
    onLogMeal();
  };

  const handleLogItem = () => {
    setIsOpen(false);
    onLogItem();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const mealTranslateY = mealOptionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const itemTranslateY = itemOptionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -160],
  });

  return (
    <>
      {/* Main Plus Button - Always Visible */}
      <View style={styles.fixedButtonContainer}>
        <Animated.View
          style={[
            styles.plusButton,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: rotate },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={handlePress} style={styles.plusButtonTouchable}>
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Modal with Options */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity 
            style={styles.overlayTouchable} 
            activeOpacity={1} 
            onPress={() => setIsOpen(false)}
          />
          <Animated.View style={[styles.blurBackground, { opacity: fadeAnim }]} />
          
          <View style={styles.buttonContainer}>
            {/* Log Item Option */}
            <Animated.View
              style={[
                styles.optionButton,
                styles.itemOption,
                {
                  opacity: itemOptionAnim,
                  transform: [{ translateY: itemTranslateY }],
                },
              ]}
            >
              <TouchableOpacity onPress={handleLogItem} style={styles.optionTouchable}>
                <Text style={styles.optionEmoji}>🍎</Text>
                <Text style={styles.optionText}>Log Item</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Log Meal Option */}
            <Animated.View
              style={[
                styles.optionButton,
                styles.mealOption,
                {
                  opacity: mealOptionAnim,
                  transform: [{ translateY: mealTranslateY }],
                },
              ]}
            >
              <TouchableOpacity onPress={handleLogMeal} style={styles.optionTouchable}>
                <Text style={styles.optionEmoji}>🍽️</Text>
                <Text style={styles.optionText}>Log Meal</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  fixedButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    position: 'absolute',
    backgroundColor: '#222',
    borderRadius: 25,
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mealOption: {
    backgroundColor: '#007AFF',
  },
  itemOption: {
    backgroundColor: '#ff6b35',
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  plusButtonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
});