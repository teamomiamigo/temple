import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { useWeightStore, WeightEntry } from '../stores/weightStore';

type WeightTrackingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const chartHeight = 200;
const chartWidth = screenWidth - 60; // Account for padding

export const WeightTrackingScreen = ({ navigation }: WeightTrackingScreenProps) => {
  const {
    entries,
    unit,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    setUnit,
    getWeightEntriesForPeriod,
    getCurrentWeight,
    getStartWeight,
    getWeightChange,
  } = useWeightStore();

  const [selectedPeriod, setSelectedPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [weightInput, setWeightInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();

  const getPeriodDays = (period: string) => {
    switch (period) {
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      default: return 90;
    }
  };

  const periodDays = getPeriodDays(selectedPeriod);
  const chartData = getWeightEntriesForPeriod(periodDays);
  const currentWeight = getCurrentWeight();
  const startWeight = getStartWeight(periodDays);
  const weightChange = getWeightChange(periodDays);

  const getChartData = () => {
    if (chartData.length === 0) return { points: [], minWeight: 0, maxWeight: 0 };

    const weights = chartData.map(entry => entry.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);

    // Add some padding to the range
    const weightRange = maxWeight - minWeight;
    const padding = weightRange * 0.1 || 5;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddWeight = () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight greater than 0');
      return;
    }

    addWeightEntry(weight, photoUri, notesInput);
    setWeightInput('');
    setNotesInput('');
    setPhotoUri(undefined);
    setShowAddModal(false);
  };

  const handleEditWeight = () => {
    if (!editingEntry) return;

    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight greater than 0');
      return;
    }

    updateWeightEntry(editingEntry.id, weight, photoUri, notesInput);
    setWeightInput('');
    setNotesInput('');
    setPhotoUri(undefined);
    setEditingEntry(null);
    setShowEditModal(false);
  };

  const handleDeleteEntry = (entry: WeightEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this weight entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteWeightEntry(entry.id),
        },
      ]
    );
  };

  const openEditModal = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setWeightInput(entry.weight.toString());
    setNotesInput(entry.notes || '');
    setPhotoUri(entry.photoUri);
    setShowEditModal(true);
  };

  const renderWeightEntry = ({ item }: { item: WeightEntry }) => (
    <TouchableOpacity
      style={styles.entryItem}
      onPress={() => openEditModal(item)}
      onLongPress={() => handleDeleteEntry(item)}
    >
      <View style={styles.entryInfo}>
        <Text style={styles.entryWeight}>{formatWeight(item.weight)}</Text>
        <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
        {item.notes && <Text style={styles.entryNotes}>{item.notes}</Text>}
      </View>
      {item.photoUri && (
        <View style={styles.entryPhotoContainer}>
          <Image source={{ uri: item.photoUri }} style={styles.entryPhoto} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Progress</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.navTabs}>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabIcon}>📊</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navTab, styles.activeTab]}>
          <Text style={[styles.navTabText, styles.activeTabText]}>Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab}>
          <Text style={styles.navTabIcon}>📅</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.periodTab, styles.activePeriodTab]}>
          <Text style={[styles.periodTabText, styles.activePeriodTabText]}>
            {selectedPeriod}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      {currentWeight && startWeight && weightChange && (
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatWeight(startWeight)}</Text>
            <Text style={styles.statLabel}>START</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatWeight(currentWeight)}</Text>
            <Text style={styles.statLabel}>CURRENT</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue,
              { color: weightChange.weight >= 0 ? '#4CAF50' : '#FF5722' }
            ]}>
              {formatChange(weightChange)}
            </Text>
            <Text style={styles.statLabel}>CHANGE</Text>
          </View>
        </View>
      )}

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

      {/* Entries Section */}
      <View style={styles.entriesSection}>
        <View style={styles.entriesHeader}>
          <Text style={styles.entriesTitle}>Entries</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.uploadButtonText}>↑</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={chartData}
          renderItem={renderWeightEntry}
          keyExtractor={(item) => item.id}
          style={styles.entriesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Add Weight Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Weight Entry</Text>
            
            <TextInput
              style={styles.weightInput}
              placeholder={`Enter weight in ${unit}`}
              placeholderTextColor="#666"
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="numeric"
              autoFocus
            />

            <TextInput
              style={styles.notesInput}
              placeholder="Notes (optional)"
              placeholderTextColor="#666"
              value={notesInput}
              onChangeText={setNotesInput}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddWeight}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Weight Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Weight Entry</Text>
            
            <TextInput
              style={styles.weightInput}
              placeholder={`Enter weight in ${unit}`}
              placeholderTextColor="#666"
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.notesInput}
              placeholder="Notes (optional)"
              placeholderTextColor="#666"
              value={notesInput}
              onChangeText={setNotesInput}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleEditWeight}
              >
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
  shareButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#007AFF',
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
  navTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  navTabIcon: {
    fontSize: 16,
    color: '#666',
  },
  navTabText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#333',
  },
  activePeriodTab: {
    backgroundColor: '#007AFF',
  },
  periodTabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activePeriodTabText: {
    color: '#fff',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  entriesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  entriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  entriesTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  entriesList: {
    flex: 1,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryWeight: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  entryDate: {
    color: '#999',
    fontSize: 14,
    marginBottom: 2,
  },
  entryNotes: {
    color: '#666',
    fontSize: 12,
  },
  entryPhotoContainer: {
    marginLeft: 12,
  },
  entryPhoto: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  weightInput: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  notesInput: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
