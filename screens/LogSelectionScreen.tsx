import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LogSelectionScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      mealName: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
    };
  };
};

export const LogSelectionScreen = ({ navigation, route }: LogSelectionScreenProps) => {
  const { mealName } = route.params;
  
  const getMealDisplayName = (meal: string) => {
    switch (meal) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snacks': return 'Snacks';
      default: return meal;
    }
  };
  
  const handleLogMeal = () => {
    navigation.navigate('LogMeal', { mealName });
  };
  
  const handleLogItem = () => {
    navigation.navigate('LogItem', { mealName });
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log to {getMealDisplayName(mealName)}</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>What would you like to log?</Text>
        
        {/* Log Meal Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleLogMeal}>
          <View style={styles.optionIcon}>
            <Text style={styles.optionEmoji}>🍽️</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log a Meal</Text>
            <Text style={styles.optionDescription}>
              Add multiple food items to create a complete meal
            </Text>
          </View>
          <Text style={styles.optionArrow}>→</Text>
        </TouchableOpacity>
        
        {/* Log Item Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleLogItem}>
          <View style={styles.optionIcon}>
            <Text style={styles.optionEmoji}>🍎</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Log an Item</Text>
            <Text style={styles.optionDescription}>
              Add a single food item or quick snack
            </Text>
          </View>
          <Text style={styles.optionArrow}>→</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionEmoji: {
    fontSize: 28,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
  optionArrow: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
