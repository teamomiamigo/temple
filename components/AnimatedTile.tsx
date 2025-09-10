import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native';

interface AnimatedTileProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  animationType?: 'scale' | 'lift' | 'bounce' | 'ios';
  duration?: number;
  scaleValue?: number;
  elevationValue?: number;
  shadowOpacity?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const AnimatedTile: React.FC<AnimatedTileProps> = ({
  children,
  style,
  onPress,
  animationType = 'ios',
  duration = 200,
  scaleValue = 0.95,
  elevationValue = 8,
  shadowOpacity = 0.3,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const elevationAnim = useRef(new Animated.Value(0)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(0.1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const getAnimationConfig = () => {
    switch (animationType) {
      case 'scale':
        return {
          pressIn: () => {
            Animated.timing(scaleAnim, {
              toValue: scaleValue,
              duration: duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start();
          },
          pressOut: () => {
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: duration,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }).start();
          },
          transform: [{ scale: scaleAnim }],
        };
      
      case 'lift':
        return {
          pressIn: () => {
            Animated.parallel([
              Animated.timing(elevationAnim, {
                toValue: elevationValue,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(shadowOpacityAnim, {
                toValue: shadowOpacity,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(translateYAnim, {
                toValue: -2,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start();
          },
          pressOut: () => {
            Animated.parallel([
              Animated.timing(elevationAnim, {
                toValue: 0,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(shadowOpacityAnim, {
                toValue: 0.1,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(translateYAnim, {
                toValue: 0,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start();
          },
          transform: [{ translateY: translateYAnim }],
          elevation: elevationAnim,
          shadowOpacity: shadowOpacityAnim,
        };
      
      case 'bounce':
        return {
          pressIn: () => {
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: scaleValue,
                duration: duration / 2,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.spring(scaleAnim, {
                toValue: 1.02,
                tension: 300,
                friction: 10,
                useNativeDriver: true,
              }),
            ]).start();
          },
          pressOut: () => {
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 300,
              friction: 10,
              useNativeDriver: true,
            }).start();
          },
          transform: [{ scale: scaleAnim }],
        };
      
      case 'ios':
      default:
        return {
          pressIn: () => {
            Animated.parallel([
              Animated.timing(scaleAnim, {
                toValue: scaleValue,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(elevationAnim, {
                toValue: elevationValue,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(shadowOpacityAnim, {
                toValue: shadowOpacity,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(translateYAnim, {
                toValue: -1,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start();
          },
          pressOut: () => {
            Animated.parallel([
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(elevationAnim, {
                toValue: 0,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(shadowOpacityAnim, {
                toValue: 0.1,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
              }),
              Animated.timing(translateYAnim, {
                toValue: 0,
                duration: duration,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start();
          },
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim }
          ],
          elevation: elevationAnim,
          shadowOpacity: shadowOpacityAnim,
        };
    }
  };

  const animationConfig = getAnimationConfig();

  const handlePressIn = () => {
    animationConfig.pressIn();
  };

  const handlePressOut = () => {
    animationConfig.pressOut();
  };

  const handlePress = () => {
    // Add a slight delay to let the animation complete before navigation
    setTimeout(() => {
      onPress?.();
    }, 50);
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1} // Disable default opacity change
      style={[styles.container, style]}
      {...props}
    >
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: animationConfig.transform,
            elevation: animationConfig.elevation,
            shadowOpacity: animationConfig.shadowOpacity,
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
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
      height: 2,
    },
    shadowRadius: 4,
  },
});
