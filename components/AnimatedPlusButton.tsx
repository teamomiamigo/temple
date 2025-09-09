import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AnimatedPlusButtonProps {
  onLogFood: () => void;
}

export const AnimatedPlusButton = ({ onLogFood }: AnimatedPlusButtonProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Simple press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onLogFood();
    });
  };

  return (
    <View style={styles.fixedButtonContainer}>
      <Animated.View
        style={[
          styles.plusButton,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={handlePress} style={styles.plusButtonTouchable}>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
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