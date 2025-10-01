import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { colors, shadows } from '../constants/theme';

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
      <View style={[styles.macroCard, styles.proteinCard]}>
        <View style={styles.macroIconContainer}>
          <Text style={styles.macroIcon}>🥩</Text>
        </View>
        <Text style={styles.macroValue}>{proteinLeft}g</Text>
        <Text style={styles.macroLabel}>Protein</Text>
        <View style={styles.macroProgress}>
          <View style={[styles.macroProgressBar, { width: `${Math.min(100, (consumed.protein / goals.protein) * 100)}%` }]} />
        </View>
      </View>
      
      <View style={[styles.macroCard, styles.carbsCard]}>
        <View style={styles.macroIconContainer}>
          <Text style={styles.macroIcon}>🍞</Text>
        </View>
        <Text style={styles.macroValue}>{carbsLeft}g</Text>
        <Text style={styles.macroLabel}>Carbs</Text>
        <View style={styles.macroProgress}>
          <View style={[styles.macroProgressBar, { width: `${Math.min(100, (consumed.carbs / goals.carbs) * 100)}%` }]} />
        </View>
      </View>
      
      <View style={[styles.macroCard, styles.fatCard]}>
        <View style={styles.macroIconContainer}>
          <Text style={styles.macroIcon}>🥑</Text>
        </View>
        <Text style={styles.macroValue}>{fatLeft}g</Text>
        <Text style={styles.macroLabel}>Fat</Text>
        <View style={styles.macroProgress}>
          <View style={[styles.macroProgressBar, { width: `${Math.min(100, (consumed.fat / goals.fat) * 100)}%` }]} />
        </View>
      </View>
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
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.medium,
  },
  proteinCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  carbsCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.textSecondary,
  },
  fatCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.textTertiary,
  },
  macroIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  macroIcon: {
    fontSize: 20,
  },
  macroValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  macroLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  macroProgress: {
    width: '100%',
    height: 4,
    backgroundColor: colors.glassBackground,
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});