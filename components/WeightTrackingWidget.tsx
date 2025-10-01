import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { colors, shadows } from '../constants/theme';
import { useWeightStore } from '../stores/weightStore';

interface WeightTrackingWidgetProps {
  style?: any;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const widgetWidth = screenWidth - 32; // Account for padding
const chartHeight = 120;
const chartWidth = widgetWidth - 40; // Account for padding and margins

export const WeightTrackingWidget: React.FC<WeightTrackingWidgetProps> = ({ 
  style, 
  onPress 
}) => {
  const { 
    entries, 
    unit, 
    getWeightEntriesForPeriod, 
    getCurrentWeight, 
    getStartWeight, 
    getWeightChange 
  } = useWeightStore();
  
  // Get 90 days of data for the chart
  const chartData = getWeightEntriesForPeriod(90);
  const currentWeight = getCurrentWeight();
  const startWeight = getStartWeight(90);
  const weightChange = getWeightChange(90);
  
  // Calculate chart dimensions and data points
  const getChartData = () => {
    if (chartData.length === 0) return { points: [], minWeight: 0, maxWeight: 0 };
    
    const weights = chartData.map(entry => entry.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    
    // Add some padding to the range
    const weightRange = maxWeight - minWeight;
    const padding = weightRange * 0.1 || 5; // 10% padding or 5 lbs minimum
    const chartMinWeight = minWeight - padding;
    const chartMaxWeight = maxWeight + padding;
    
    const points = chartData.map((entry, index) => {
      const x = (index / Math.max(chartData.length - 1, 1)) * chartWidth;
      const y = chartHeight - ((entry.weight - chartMinWeight) / (chartMaxWeight - chartMinWeight)) * chartHeight;
      return { x, y, weight: entry.weight, date: entry.date };
    });
    
    return { points, minWeight: chartMinWeight, maxWeight: chartMaxWeight };
  };
  
  const { points, minWeight, maxWeight } = getChartData();
  
  // Generate Y-axis labels
  const getYAxisLabels = () => {
    const labels = [];
    const steps = 4;
    const step = (maxWeight - minWeight) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const weight = maxWeight - (step * i);
      labels.push(Math.round(weight));
    }
    
    return labels;
  };
  
  const yAxisLabels = getYAxisLabels();
  
  // Generate X-axis labels (dates)
  const getXAxisLabels = () => {
    if (chartData.length === 0) return [];
    
    const labels = [];
    const step = Math.max(1, Math.floor(chartData.length / 4));
    
    for (let i = 0; i < chartData.length; i += step) {
      const date = new Date(chartData[i].date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      labels.push(`${month}/${day}`);
    }
    
    // Always include the last point
    if (chartData.length > 0 && labels[labels.length - 1] !== `${new Date(chartData[chartData.length - 1].date).getMonth() + 1}/${new Date(chartData[chartData.length - 1].date).getDate()}`) {
      const lastDate = new Date(chartData[chartData.length - 1].date);
      labels.push(`${lastDate.getMonth() + 1}/${lastDate.getDate()}`);
    }
    
    return labels;
  };
  
  const xAxisLabels = getXAxisLabels();
  
  
  const formatWeight = (weight: number) => {
    return `${Math.round(weight)} ${unit}`;
  };
  
  const formatChange = (change: { weight: number; percentage: number }) => {
    const sign = change.weight >= 0 ? '+' : '';
    return `${sign}${Math.round(change.weight)} ${unit} (${sign}${Math.round(change.percentage)}%)`;
  };
  
  return (
    <View style={[styles.container, style]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.weightIconContainer}>
              <Text style={styles.weightIcon}>⚖️</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Weight Tracking</Text>
              <Text style={styles.subtitle}>Last 90 days</Text>
            </View>
          </View>
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </View>
        </View>
        
        {/* Chart */}
        <View style={styles.chartContainer}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* Y-axis labels */}
            <G>
              {yAxisLabels.map((label, index) => {
                const y = (index / (yAxisLabels.length - 1)) * chartHeight;
                return (
                  <SvgText
                    key={label}
                    x={0}
                    y={y + 4}
                    fontSize="12"
                    fill={colors.textTertiary}
                    textAnchor="start"
                  >
                    {label}
                  </SvgText>
                );
              })}
            </G>
            
            {/* Grid lines */}
            <G>
              {yAxisLabels.map((_, index) => {
                const y = (index / (yAxisLabels.length - 1)) * chartHeight;
                return (
                  <Line
                    key={index}
                    x1={30}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke={colors.glassBackground}
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                );
              })}
            </G>
            
            {/* Weight line */}
            {points.length > 1 && (
              <Line
                x1={points[0].x + 30}
                y1={points[0].y}
                x2={points[points.length - 1].x + 30}
                y2={points[points.length - 1].y}
                stroke={colors.primary}
                strokeWidth="3"
              />
            )}
            
            {/* Data points */}
            {points.map((point, index) => (
              <Circle
                key={index}
                cx={point.x + 30}
                cy={point.y}
                r="4"
                fill={colors.primary}
                stroke={colors.text}
                strokeWidth="2"
              />
            ))}
            
            {/* X-axis labels */}
            <G>
              {xAxisLabels.map((label, index) => {
                const x = (index / Math.max(xAxisLabels.length - 1, 1)) * (chartWidth - 30) + 30;
                return (
                  <SvgText
                    key={label}
                    x={x}
                    y={chartHeight + 15}
                    fontSize="10"
                    fill={colors.textTertiary}
                    textAnchor="middle"
                  >
                    {label}
                  </SvgText>
                );
              })}
            </G>
          </Svg>
        </View>
        
        {/* Summary */}
        {currentWeight && startWeight && weightChange && (
          <View style={styles.summary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Start</Text>
              <Text style={styles.summaryValue}>{formatWeight(startWeight)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Current</Text>
              <Text style={styles.summaryValue}>{formatWeight(currentWeight)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Change</Text>
              <Text style={[
                styles.summaryValue,
                { color: weightChange.weight >= 0 ? colors.primary : colors.textSecondary }
              ]}>
                {formatChange(weightChange)}
              </Text>
            </View>
          </View>
        )}
        
        {/* Empty state */}
        {chartData.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No weight data yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap + to add your first entry</Text>
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weightIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    ...shadows.medium,
  },
  weightIcon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.medium,
  },
  addButtonText: {
    color: colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: colors.glassBackground,
    borderRadius: 12,
    padding: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.glassBackground,
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    color: colors.textTertiary,
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
});