import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { AddMealScreen } from '../screens/AddMealScreen';
import { BodyScreen } from '../screens/BodyScreen';
import { BuildTemplateScreen } from '../screens/BuildTemplateScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { JournalEntryScreen } from '../screens/JournalEntryScreen';
import { LogItemScreen } from '../screens/LogItemScreen';
import { LogMealScreen } from '../screens/LogMealScreen';
import { LogSelectionScreen } from '../screens/LogSelectionScreen';
import { MindScreen } from '../screens/MindScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { PromptsScreen } from '../screens/PromptsScreen';
import { QuickLogScreen } from '../screens/QuickLogScreen';
import { SavedMealsScreen } from '../screens/SavedMealsScreen';
import { TempleScreen } from '../screens/TempleScreen';
import { UnifiedFoodLoggingScreen } from '../screens/UnifiedFoodLoggingScreen';
import { WeightTrackingScreen } from '../screens/WeightTrackingScreen';

const Tab = createBottomTabNavigator();
const BodyStack = createNativeStackNavigator();
const NutritionStack = createNativeStackNavigator();
const MindStack = createNativeStackNavigator();

const BodyStackNavigator = () => {
  return (
    <BodyStack.Navigator screenOptions={{ headerShown: false }}>
      <BodyStack.Screen name="BodyMain" component={BodyScreen} />
      <BodyStack.Screen name="BuildTemplate" component={BuildTemplateScreen} />
    </BodyStack.Navigator>
  );
};

const NutritionStackNavigator = () => {
  return (
    <NutritionStack.Navigator screenOptions={{ headerShown: false }}>
      <NutritionStack.Screen name="NutritionMain" component={NutritionScreen} />
      <NutritionStack.Screen name="UnifiedFoodLogging" component={UnifiedFoodLoggingScreen} />
      <NutritionStack.Screen name="LogSelection" component={LogSelectionScreen} />
      <NutritionStack.Screen name="LogMeal" component={LogMealScreen} />
      <NutritionStack.Screen name="LogItem" component={LogItemScreen} />
      <NutritionStack.Screen name="AddMeal" component={AddMealScreen} />
      <NutritionStack.Screen name="QuickLog" component={QuickLogScreen} />
      <NutritionStack.Screen name="SavedMeals" component={SavedMealsScreen} />
      <NutritionStack.Screen name="WeightTracking" component={WeightTrackingScreen} />
    </NutritionStack.Navigator>
  );
};

const MindStackNavigator = () => {
  return (
    <MindStack.Navigator screenOptions={{ headerShown: false }}>
      <MindStack.Screen name="MindMain" component={MindScreen} />
      <MindStack.Screen name="JournalEntry" component={JournalEntryScreen} />
      <MindStack.Screen name="Prompts" component={PromptsScreen} />
    </MindStack.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#333',
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#999',
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarIcon: () => <Text style={{ color: '#fff', fontSize: 20 }}>🏠</Text>,
          }}
        />
        <Tab.Screen 
          name="Nutrition" 
          component={NutritionStackNavigator}
          options={{
            tabBarIcon: () => <Text style={{ color: '#fff', fontSize: 20 }}>🍎</Text>,
          }}
        />
        <Tab.Screen 
          name="Mind" 
          component={MindStackNavigator}
          options={{
            tabBarIcon: () => <Text style={{ color: '#fff', fontSize: 20 }}>🧠</Text>,
          }}
        />
        <Tab.Screen 
          name="Body" 
          component={BodyStackNavigator}
          options={{
            tabBarIcon: () => <Text style={{ color: '#fff', fontSize: 20 }}>💪</Text>,
          }}
        />
        <Tab.Screen 
          name="Temple" 
          component={TempleScreen}
          options={{
            tabBarIcon: () => <Text style={{ color: '#fff', fontSize: 20 }}>🕉️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 