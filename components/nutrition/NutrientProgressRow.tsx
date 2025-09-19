import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NutrientRow } from '../../types/nutrition';
import { getPlatformColor } from '../../utils/platformColors';

interface NutrientProgressRowProps {
  nutrient: NutrientRow;
  onPress?: () => void;
}

export const NutrientProgressRow: React.FC<NutrientProgressRowProps> = ({
  nutrient,
  onPress,
}) => {
  const { name, total, goal, unit, left } = nutrient;
  
  const progress = goal ? Math.min((total / goal) * 100, 100) : 0;
  const isOverGoal = goal && total > goal;
  const displayLeft = left !== undefined ? left : (goal ? Math.max(0, goal - total) : 0);

  const getProgressColor = () => {
    if (isOverGoal) {
      return '#FF3B30'; // Red for over goal
    }
    if (progress >= 80) {
      return '#34C759'; // Green for good progress
    }
    if (progress >= 50) {
      return '#FF9500'; // Orange for moderate progress
    }
    return '#007AFF'; // Blue for low progress
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'kcal') {
      return `${Math.round(value)}`;
    }
    if (unit === 'mg') {
      return `${Math.round(value)}`;
    }
    return `${Math.round(value * 10) / 10}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.content}>
        {/* Nutrient name */}
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.unit}>({unit})</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progress}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
        </View>

        {/* Values */}
        <View style={styles.valuesContainer}>
          <View style={styles.valueGroup}>
            <Text style={styles.valueLabel}>Total</Text>
            <Text style={styles.valueText}>
              {formatValue(total, unit)}
            </Text>
          </View>
          
          {goal && (
            <View style={styles.valueGroup}>
              <Text style={styles.valueLabel}>Goal</Text>
              <Text style={styles.valueText}>
                {formatValue(goal, unit)}
              </Text>
            </View>
          )}
          
          <View style={styles.valueGroup}>
            <Text style={styles.valueLabel}>
              {isOverGoal ? 'Over' : 'Left'}
            </Text>
            <Text
              style={[
                styles.valueText,
                isOverGoal && styles.overGoalText,
              ]}
            >
              {isOverGoal ? '+' : ''}{formatValue(displayLeft, unit)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: getPlatformColor('systemBackground'),
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: getPlatformColor('label'),
    allowFontScaling: true,
    marginRight: 4,
  },
  unit: {
    fontSize: 14,
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: getPlatformColor('systemGray5'),
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueGroup: {
    alignItems: 'center',
    flex: 1,
  },
  valueLabel: {
    fontSize: 12,
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
    marginBottom: 2,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: getPlatformColor('label'),
    allowFontScaling: true,
  },
  overGoalText: {
    color: '#FF3B30',
  },
});

