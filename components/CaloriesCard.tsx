import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IOSTile } from './IOSTile';

interface CaloriesCardProps {
  caloriesLeft: number;
  goal: number;
  consumed: number;
  onPress?: () => void;
}

export const CaloriesCard: React.FC<CaloriesCardProps> = ({
  caloriesLeft,
  goal,
  consumed,
  onPress
}) => {
  const progressPercentage = Math.min(100, (consumed / goal) * 100);

  return (
    <IOSTile style={styles.caloriesCard} onPress={onPress}>
      <View style={styles.caloriesContent}>
        <View style={styles.caloriesLeft}>
          <Text style={styles.caloriesValue}>{caloriesLeft}</Text>
          <Text style={styles.caloriesLabel}>calories left</Text>
          <View style={styles.caloriesProgress}>
            <View style={[styles.caloriesProgressBar, { width: `${progressPercentage}%` }]} />
          </View>
        </View>
        <View style={styles.caloriesRight}>
          <View style={styles.caloriesIconContainer}>
            <Text style={styles.caloriesIcon}>🔥</Text>
          </View>
          <Text style={styles.caloriesGoal}>Goal: {goal}</Text>
        </View>
      </View>
    </IOSTile>
  );
};

const styles = StyleSheet.create({
  caloriesCard: {
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 4,
  },
  caloriesLabel: {
    color: '#999',
    fontSize: 16,
    marginBottom: 12,
  },
  caloriesProgress: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  caloriesProgressBar: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 3,
  },
  caloriesRight: {
    alignItems: 'center',
  },
  caloriesIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  caloriesIcon: {
    fontSize: 32,
  },
  caloriesGoal: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
});
