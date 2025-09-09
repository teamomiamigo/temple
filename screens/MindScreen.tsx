import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const RING_SIZE = width * 0.7;
const STROKE_WIDTH = 16;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const MindScreen = () => {
  // These will be set from backend/user data in the future
  const [emotionsCount, setEmotionsCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [checkIns, setCheckIns] = useState(0);
  // Animated progress: 0 = empty, 1 = full (checked in today)
  const progress = useRef(new Animated.Value(0)).current;
  const [checkedIn, setCheckedIn] = useState(false);

  const animateProgress = (toValue: number) => {
    Animated.timing(progress, {
      toValue,
      duration: 900,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  const handleCheckIn = () => {
    if (!checkedIn) {
      animateProgress(1);
      setCheckIns(checkIns + 1);
      setEmotionsCount(emotionsCount + 1); // demo only
      setStreak(streak + 1); // demo only
    } else {
      animateProgress(0);
      setCheckIns(checkIns - 1);
      setEmotionsCount(emotionsCount - 1); // demo only
      setStreak(streak - 1); // demo only
    }
    setCheckedIn(!checkedIn);
  };

  // Interpolate the animated value to get the strokeDashoffset
  const animatedStrokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconHex}>⬡</Text>
          </TouchableOpacity>
          <View style={styles.badgesRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>{emotionsCount} emotions</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>{streak} day streak</Text></View>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconHeart}>♡</Text>
          </TouchableOpacity>
        </View>

        {/* Prompt */}
        <Text style={styles.prompt}>How are you feeling this evening?</Text>

        {/* Circular Check-in Button with dynamic progress */}
        <View style={styles.ringContainer}>
          <View style={styles.ringBg}>
            {/* Progress ring using SVG */}
            <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
              {/* Background ring */}
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke="#222"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
              {/* Foreground progress ring */}
              <AnimatedCircle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke="url(#grad)"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE},${CIRCUMFERENCE}`}
                strokeDashoffset={animatedStrokeDashoffset}
                strokeLinecap="round"
              />
              {/* Gradient definition (simple red/orange) */}
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor="#ff5050" />
                  <Stop offset="100%" stopColor="#ffb347" />
                </LinearGradient>
              </Defs>
            </Svg>
            <TouchableOpacity
              style={styles.checkInButton}
              activeOpacity={0.8}
              onPress={handleCheckIn}
            >
              <Text style={styles.checkInPlus}>＋</Text>
              <Text style={styles.checkInText}>Check in</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for bottom nav */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom card and nav */}
      <View style={styles.bottomCard}>
        <Text style={styles.bottomCardText}>{checkIns} check-ins</Text>
        <View style={styles.bottomNavRow}>
          <TouchableOpacity style={styles.bottomNavItemActive}>
            <Text style={styles.bottomNavIcon}>＋</Text>
            <Text style={styles.bottomNavLabelActive}>Check in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavIcon}>🛠️</Text>
            <Text style={styles.bottomNavLabel}>Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavIcon}>👥</Text>
            <Text style={styles.bottomNavLabel}>Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomNavItem}>
            <Text style={styles.bottomNavIcon}>📊</Text>
            <Text style={styles.bottomNavLabel}>Analyze</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 0,
    minHeight: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
  },
  iconHex: {
    color: '#fff',
    fontSize: 28,
    opacity: 0.7,
  },
  iconHeart: {
    color: '#fff',
    fontSize: 24,
    opacity: 0.7,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    backgroundColor: '#222',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    fontWeight: '500',
  },
  prompt: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    marginHorizontal: 16,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ringBg: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    backgroundColor: '#18181a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringFg: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: 16,
    borderColor: 'rgba(255,80,80,0.8)', // placeholder for gradient
    borderRightColor: 'orange',
    borderLeftColor: '#18181a',
    borderTopColor: '#18181a',
    borderBottomColor: '#18181a',
    zIndex: 1,
    transform: [{ rotate: '45deg' }],
  },
  checkInButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  checkInPlus: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  checkInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.8,
  },
  bottomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  bottomCardText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 12,
  },
  bottomNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    opacity: 0.6,
  },
  bottomNavItemActive: {
    flex: 1,
    alignItems: 'center',
    opacity: 1,
  },
  bottomNavIcon: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 2,
  },
  bottomNavLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.7,
  },
  bottomNavLabelActive: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    opacity: 1,
  },
}); 