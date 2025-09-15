import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNutritionStore } from '../stores/nutritionStore';

interface WaterIntakeChartProps {
  style?: any;
}

type TimeRange = '7D' | '30D' | '90D';

export const WaterIntakeChart: React.FC<WaterIntakeChartProps> = ({ style }) => {
  const { dailyNutrition, goals } = useNutritionStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('7D');
  
  const waterGoal = goals.water || 2500;
  
  // Get data for selected time range
  const chartData = useMemo(() => {
    const now = new Date();
    const daysBack = selectedTimeRange === '7D' ? 7 : selectedTimeRange === '30D' ? 30 : 90;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);
    
    const data = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = dailyNutrition.find(day => day.date === dateStr);
      const waterIntake = dayData?.waterIntake || 0;
      const percentage = Math.min((waterIntake / waterGoal) * 100, 100);
      
      data.push({
        date: dateStr,
        dateObj: date,
        waterIntake,
        percentage,
        isToday: i === 0,
      });
    }
    
    return data;
  }, [dailyNutrition, selectedTimeRange, waterGoal]);
  
  // Calculate statistics
  const stats = useMemo(() => {
    const validDays = chartData.filter(d => d.waterIntake > 0);
    const totalIntake = chartData.reduce((sum, d) => sum + d.waterIntake, 0);
    const averageIntake = validDays.length > 0 ? totalIntake / validDays.length : 0;
    const goalAchievedDays = chartData.filter(d => d.waterIntake >= waterGoal).length;
    const goalAchievementRate = chartData.length > 0 ? (goalAchievedDays / chartData.length) * 100 : 0;
    
    return {
      totalIntake,
      averageIntake,
      goalAchievementRate,
      goalAchievedDays,
      totalDays: chartData.length,
    };
  }, [chartData, waterGoal]);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (selectedTimeRange === '7D') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (selectedTimeRange === '30D') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
  };
  
  const formatAmount = (ml: number) => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(1)}L`;
    }
    return `${ml}ml`;
  };
  
  const getBarColor = (percentage: number, isToday: boolean) => {
    if (isToday) {
      return percentage >= 100 ? '#34C759' : percentage >= 75 ? '#007AFF' : '#FF9500';
    }
    return percentage >= 100 ? '#34C759' : percentage >= 75 ? '#007AFF' : '#666';
  };
  
  const maxHeight = 120;
  
  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.chartIconContainer}>
            <Text style={styles.chartIcon}>📊</Text>
          </View>
          <Text style={styles.title}>Water Intake History</Text>
        </View>
        <View style={styles.timeRangeSelector}>
          {(['7D', '30D', '90D'] as TimeRange[]).map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                selectedTimeRange === range && styles.timeRangeButtonActive,
              ]}
              onPress={() => setSelectedTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeButtonText,
                  selectedTimeRange === range && styles.timeRangeButtonTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatAmount(stats.averageIntake)}</Text>
          <Text style={styles.statLabel}>Avg Daily</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(stats.goalAchievementRate)}%</Text>
          <Text style={styles.statLabel}>Goal Rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.goalAchievedDays}</Text>
          <Text style={styles.statLabel}>Goal Days</Text>
        </View>
      </View>
      
      {/* Chart */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartContainer}>
        <View style={styles.chart}>
          {chartData.map((data, index) => (
            <View key={data.date} style={styles.chartColumn}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (data.percentage / 100) * maxHeight,
                      backgroundColor: getBarColor(data.percentage, data.isToday),
                    },
                  ]}
                />
                {data.waterIntake > 0 && (
                  <View style={styles.barValue}>
                    <Text style={styles.barValueText}>
                      {Math.round(data.percentage)}%
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.dateLabel, data.isToday && styles.todayLabel]}>
                {formatDate(data.date)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Goal Line */}
      <View style={styles.goalLineContainer}>
        <View style={styles.goalLine} />
        <Text style={styles.goalLineText}>Daily Goal ({formatAmount(waterGoal)})</Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const chartItemWidth = 40;

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chartIcon: {
    fontSize: 18,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  timeRangeButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  timeRangeButtonTextActive: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  chartColumn: {
    alignItems: 'center',
    marginHorizontal: 2,
    width: chartItemWidth,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 2,
  },
  barValue: {
    position: 'absolute',
    top: -20,
    alignItems: 'center',
  },
  barValueText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  dateLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  todayLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  goalLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  goalLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
  },
  goalLineText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
});