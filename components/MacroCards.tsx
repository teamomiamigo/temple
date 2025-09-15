import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { IOSTile } from './IOSTile';

interface MacroGoals {
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroConsumed {
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroCardsProps {
  goals: MacroGoals;
  consumed: MacroConsumed;
  onPress?: (macro: 'protein' | 'carbs' | 'fat') => void;
}

const { width } = Dimensions.get('window');
const macroCardWidth = (width - 32 - 16) / 3; // padding + gaps

export const MacroCards: React.FC<MacroCardsProps> = ({
  goals,
  consumed,
  onPress
}) => {
  const macroData = [
    {
      key: 'protein' as const,
      icon: '🥩',
      value: goals.protein - consumed.protein,
      label: 'Protein',
      color: '#FF6B35',
      progress: Math.min(100, (consumed.protein / goals.protein) * 100)
    },
    {
      key: 'carbs' as const,
      icon: '🍞',
      value: goals.carbs - consumed.carbs,
      label: 'Carbs',
      color: '#4CAF50',
      progress: Math.min(100, (consumed.carbs / goals.carbs) * 100)
    },
    {
      key: 'fat' as const,
      icon: '🥑',
      value: goals.fat - consumed.fat,
      label: 'Fat',
      color: '#FFC107',
      progress: Math.min(100, (consumed.fat / goals.fat) * 100)
    }
  ];

  return (
    <View style={styles.macroRow}>
      {macroData.map((macro) => (
        <IOSTile
          key={macro.key}
          style={[styles.macroCard, { borderLeftColor: macro.color }]}
          onPress={() => onPress?.(macro.key)}
        >
          <View style={styles.macroIconContainer}>
            <Text style={styles.macroIcon}>{macro.icon}</Text>
          </View>
          <Text style={styles.macroValue}>{macro.value}g</Text>
          <Text style={styles.macroLabel}>{macro.label}</Text>
          <View style={styles.macroProgress}>
            <View style={[styles.macroProgressBar, { width: `${macro.progress}%` }]} />
          </View>
        </IOSTile>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  macroCard: {
    width: macroCardWidth,
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  macroIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
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
  },
  macroLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  macroProgress: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});
