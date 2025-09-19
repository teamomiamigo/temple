import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Platform,
    PlatformColor,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { NutritionPeriod } from '../../types/nutrition';

interface PeriodControlProps {
  period: NutritionPeriod;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onChangePeriod: (period: NutritionPeriod) => void;
}

export const PeriodControl: React.FC<PeriodControlProps> = ({
  period,
  label,
  onPrev,
  onNext,
  onChangePeriod,
}) => {
  const handlePeriodChange = (newPeriod: NutritionPeriod) => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
    onChangePeriod(newPeriod);
  };

  const handlePrev = () => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
    onPrev();
  };

  const handleNext = () => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
    onNext();
  };

  return (
    <View style={styles.container}>
      {/* Left chevron */}
      <TouchableOpacity
        style={styles.chevronButton}
        onPress={handlePrev}
        activeOpacity={0.7}
      >
        <Text style={styles.chevron}>‹</Text>
      </TouchableOpacity>

      {/* Period selector */}
      <View style={styles.periodSelector}>
        {(['day', 'week', 'month'] as NutritionPeriod[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.periodButton,
              period === p && styles.activePeriodButton,
            ]}
            onPress={() => handlePeriodChange(p)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === p && styles.activePeriodButtonText,
              ]}
            >
              {p === 'day' ? 'Day' : p === 'week' ? 'Week' : 'Month'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date label */}
      <View style={styles.dateLabelContainer}>
        <Text style={styles.dateLabel}>{label}</Text>
        <TouchableOpacity
          style={styles.caretButton}
          onPress={() => {
            // TODO: Open date picker
            console.log('Open date picker');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.caret}>⌄</Text>
        </TouchableOpacity>
      </View>

      {/* Right chevron */}
      <TouchableOpacity
        style={styles.chevronButton}
        onPress={handleNext}
        activeOpacity={0.7}
      >
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Platform.select({
      ios: PlatformColor('systemBackground'),
      android: '#fff',
    }),
  },
  chevronButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Platform.select({
      ios: PlatformColor('systemGray6'),
      android: '#f2f2f7',
    }),
  },
  chevron: {
    fontSize: 20,
    fontWeight: '600',
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Platform.select({
      ios: PlatformColor('systemGray6'),
      android: '#f2f2f7',
    }),
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: Platform.select({
      ios: PlatformColor('systemBackground'),
      android: '#fff',
    }),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
    allowFontScaling: true,
  },
  activePeriodButtonText: {
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
    fontWeight: '600',
  },
  dateLabelContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Platform.select({
      ios: PlatformColor('label'),
      android: '#000',
    }),
    allowFontScaling: true,
    marginRight: 4,
  },
  caretButton: {
    padding: 4,
  },
  caret: {
    fontSize: 12,
    color: Platform.select({
      ios: PlatformColor('secondaryLabel'),
      android: '#8e8e93',
    }),
  },
});

