import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { getPlatformColor } from '../../utils/platformColors';

interface MacroPieProps {
  protein: number;
  carbs: number;
  fat: number;
  size?: number;
}

export const MacroPie: React.FC<MacroPieProps> = ({
  protein,
  carbs,
  fat,
  size = 200,
}) => {
  const { segments, total, percentages } = useMemo(() => {
    const total = protein + carbs + fat;
    if (total === 0) {
      return {
        segments: [],
        total: 0,
        percentages: { protein: 0, carbs: 0, fat: 0 },
      };
    }

    const percentages = {
      protein: (protein / total) * 100,
      carbs: (carbs / total) * 100,
      fat: (fat / total) * 100,
    };

    const radius = (size - 40) / 2;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    const segments = [
      {
        name: 'Protein',
        value: protein,
        percentage: percentages.protein,
        color: '#FF6B35',
        strokeDasharray: `${(percentages.protein / 100) * circumference} ${circumference}`,
        strokeDashoffset: -currentOffset,
      },
    ];

    currentOffset += (percentages.protein / 100) * circumference;

    segments.push({
      name: 'Carbs',
      value: carbs,
      percentage: percentages.carbs,
      color: '#4CAF50',
      strokeDasharray: `${(percentages.carbs / 100) * circumference} ${circumference}`,
      strokeDashoffset: -currentOffset,
    });

    currentOffset += (percentages.carbs / 100) * circumference;

    segments.push({
      name: 'Fat',
      value: fat,
      percentage: percentages.fat,
      color: '#FFC107',
      strokeDasharray: `${(percentages.fat / 100) * circumference} ${circumference}`,
      strokeDashoffset: -currentOffset,
    });

    return { segments, total, percentages };
  }, [protein, carbs, fat, size]);

  const radius = (size - 40) / 2;
  const center = size / 2;

  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getPlatformColor('systemGray5')}
          strokeWidth={8}
          fill="none"
        />
        
        {/* Segments */}
        {segments.map((segment, index) => (
          <Circle
            key={segment.name}
            cx={center}
            cy={center}
            r={radius}
            stroke={segment.color}
            strokeWidth={8}
            fill="none"
            strokeDasharray={segment.strokeDasharray}
            strokeDashoffset={segment.strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}
        
        {/* Center text */}
        <G>
          <SvgText
            x={center}
            y={center - 8}
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
            fill={getPlatformColor('label')}
          >
            {Math.round(total)}g
          </SvgText>
          <SvgText
            x={center}
            y={center + 12}
            fontSize="12"
            textAnchor="middle"
            fill={getPlatformColor('secondaryLabel')}
          >
            Total
          </SvgText>
        </G>
      </Svg>
      
      {/* Legend */}
      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.name} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: segment.color },
              ]}
            />
            <View style={styles.legendText}>
              <Text style={styles.legendName}>{segment.name}</Text>
              <Text style={styles.legendValue}>
                {segment.value}g ({Math.round(segment.percentage)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendName: {
    fontSize: 14,
    fontWeight: '500',
    color: getPlatformColor('label'),
    allowFontScaling: true,
  },
  legendValue: {
    fontSize: 12,
    color: getPlatformColor('secondaryLabel'),
    allowFontScaling: true,
  },
});

