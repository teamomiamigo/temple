import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, shadows } from '../constants/theme';

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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
  },
  plusButtonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: colors.background,
    fontSize: 32,
    fontWeight: 'bold',
  },
});