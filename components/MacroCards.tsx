import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { IOSTile } from './IOSTile';

const { width } = Dimensions.get('window');
const macroCardWidth = (width - 32 - 16) / 3; // padding + gaps

type MacroCardsProps = {
  goals: { protein: number; carbs: number; fat: number };
  consumed: { protein: number; carbs: number; fat: number };
};

export const MacroCards = ({ goals, consumed }: MacroCardsProps) => {
  const proteinLeft = Math.max(0, goals.protein - consumed.protein);
  const carbsLeft = Math.max(0, goals.carbs - consumed.carbs);
  const fatLeft = Math.max(0, goals.fat - consumed.fat);

  return (
    <View style={styles.macroRow}>
      <IOSTile style={[styles.macroCard, styles.proteinCard]} onPress={() => {}}>
        <View style={styles.macroIconContainer}>
          <Text style={styles.macroIcon}>🥩</Text>
        </View>
        <Text style={styles.macroValue}>{proteinLeft}g</Text>
        <Text style={styles.macroLabel}>Protein</Text>
        <View style={styles.macroProgress}>
          <View style={[styles.macroProgressBar, { width: `${Math.min(100, (consumed.protein / goals.protein) * 100)}%` }]} />
        </View>
      </IOSTile>
      
      <IOSTile style={[styles.macroCard, styles.carbsCard]} onPress={() => {}}>
        <View style={styles.macroIconContainer}>
          <Text style={styles.macroIcon}>🍞</Text>
        </View>
        <Text style={styles.macroValue}>{carbsLeft}g</Text>
        <Text style={styles.macroLabel}>Carbs</Text>
        <View style={styles.macroProgress}>
          <View style={[styles.macroProgressBar, { width: `${Math.min(100, (consumed.carbs / goals.carbs) * 100)}%` }]} />
        </View>
      </IOSTile>
      
      <IOSTile style={[styles.macroCard, styles.fatCard]} onPress={() => {}}>
        <View style={styles.macroIconContainer}>
          <Text style={styles.macroIcon}>🥑</Text>
        </View>
        <Text style={styles.macroValue}>{fatLeft}g</Text>
        <Text style={styles.macroLabel}>Fat</Text>
        <View style={styles.macroProgress}>
          <View style={[styles.macroProgressBar, { width: `${Math.min(100, (consumed.fat / goals.fat) * 100)}%` }]} />
        </View>
      </IOSTile>
    </View>
  );
};

const styles = StyleSheet.create({
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  macroCard: {
    width: macroCardWidth,
    backgroundColor: 'rgba(17, 17, 17, 0.8)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  proteinCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  carbsCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  fatCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  macroIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  macroIcon: {
    fontSize: 20,
  },
  macroValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  macroLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  macroProgress: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});