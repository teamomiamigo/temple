import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableWithoutFeedbackProps,
    ViewStyle
} from 'react-native';

interface AppStoreTileProps extends TouchableWithoutFeedbackProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  scaleValue?: number;
  shadowIntensity?: number;
  hapticFeedback?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export const AppStoreTile: React.FC<AppStoreTileProps> = ({
  children,
  style,
  onPress,
  scaleValue = 0.95,
  shadowIntensity = 0.4,
  hapticFeedback = true,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0.15)).current;
  const elevationAnim = useRef(new Animated.Value(3)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    // Authentic iOS App Store press in animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: scaleValue,
        tension: 400,
        friction: 25,
        useNativeDriver: true,
      }),
      Animated.spring(shadowAnim, {
        toValue: shadowIntensity,
        tension: 400,
        friction: 25,
        useNativeDriver: false,
      }),
      Animated.spring(elevationAnim, {
        toValue: 15,
        tension: 400,
        friction: 25,
        useNativeDriver: false,
      }),
      Animated.spring(translateYAnim, {
        toValue: -2,
        tension: 400,
        friction: 25,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback (if available)
    if (hapticFeedback) {
      // You can add actual haptic feedback here
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    // Authentic iOS App Store press out animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 400,
        friction: 25,
        useNativeDriver: true,
      }),
      Animated.spring(shadowAnim, {
        toValue: 0.15,
        tension: 400,
        friction: 25,
        useNativeDriver: false,
      }),
      Animated.spring(elevationAnim, {
        toValue: 3,
        tension: 400,
        friction: 25,
        useNativeDriver: false,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        tension: 400,
        friction: 25,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    // Delay to let the spring animation complete before navigation
    // This creates the authentic iOS App Store "bounce back" effect
    setTimeout(() => {
      onPress?.();
    }, 200);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[styles.container, style]}
      {...props}
    >
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ],
            shadowOpacity: shadowAnim,
            elevation: elevationAnim,
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  animatedView: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowRadius: 12,
  },
});
