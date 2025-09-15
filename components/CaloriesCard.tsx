import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IOSTile } from './IOSTile';

type CaloriesCardProps = {
  caloriesLeft: number;
  goal: number;
  consumed: number;
};

export const CaloriesCard = ({ caloriesLeft, goal, consumed }: CaloriesCardProps) => {
  const progressWidth = Math.min(100, (consumed / goal) * 100);

  return (
    <IOSTile style={styles.caloriesCard} onPress={() => {}}>
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
    </IOSTile>
  );
};

const styles = StyleSheet.create({
  caloriesCard: {
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
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
    letterSpacing: -1,
  },
  caloriesLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 16,
    fontWeight: '500',
  },
  caloriesProgress: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  caloriesIcon: {
    fontSize: 32,
  },
  caloriesGoal: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
});