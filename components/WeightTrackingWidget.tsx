import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
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
  
  const [scaleAnimation] = useState(new Animated.Value(1));
  
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
  
  const handlePress = () => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress?.();
  };
  
  const formatWeight = (weight: number) => {
    return `${Math.round(weight)} ${unit}`;
  };
  
  const formatChange = (change: { weight: number; percentage: number }) => {
    const sign = change.weight >= 0 ? '+' : '';
    return `${sign}${Math.round(change.weight)} ${unit} (${sign}${Math.round(change.percentage)}%)`;
  };
  
  return (
    <Animated.View style={[styles.container, style, { transform: [{ scale: scaleAnimation }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Weight</Text>
          <Text style={styles.subtitle}>Last 90 days</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
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
                    fill="#666"
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
                    stroke="#333"
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
                stroke="#4CAF50"
                strokeWidth="2"
              />
            )}
            
            {/* Data points */}
            {points.map((point, index) => (
              <Circle
                key={index}
                cx={point.x + 30}
                cy={point.y}
                r="3"
                fill="#4CAF50"
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
                    fill="#666"
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
                { color: weightChange.weight >= 0 ? '#4CAF50' : '#FF5722' }
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
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  subtitle: {
    color: '#999',
    fontSize: 14,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
  },
});
