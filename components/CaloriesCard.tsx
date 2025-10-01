import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, shadows } from '../constants/theme';

type CaloriesCardProps = {
  caloriesLeft: number;
  goal: number;
  consumed: number;
  onPress?: () => void;
};

export const CaloriesCard = ({ caloriesLeft, goal, consumed, onPress }: CaloriesCardProps) => {
  const progressWidth = Math.min(100, (consumed / goal) * 100);

  return (
    <TouchableOpacity 
      style={styles.caloriesCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      disabled={!onPress}
    >
      <View style={styles.caloriesContent}>
        <View style={styles.caloriesLeft}>
          <Text style={styles.caloriesValue}>{caloriesLeft}</Text>
          <Text style={styles.caloriesLabel}>calories left</Text>
          <View style={styles.caloriesProgress}>
            <View style={[styles.caloriesProgressBar, { width: `${progressWidth}%` }]} />
          </View>
        </View>
        <View style={styles.caloriesRight}>
          <View style={styles.caloriesIconContainer}>
            <Text style={styles.caloriesIcon}>🔥</Text>
          </View>
          <Text style={styles.caloriesGoal}>Goal: {goal}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  caloriesCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.large,
  },
  caloriesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesLeft: {
    flex: 1,
  },
  caloriesValue: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -1,
  },
  caloriesLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  caloriesProgress: {
    height: 6,
    backgroundColor: colors.glassBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  caloriesProgressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  caloriesRight: {
    alignItems: 'center',
  },
  caloriesIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...shadows.medium,
  },
  caloriesIcon: {
    fontSize: 32,
  },
  caloriesGoal: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});