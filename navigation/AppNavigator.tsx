import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { BodyScreen } from '../screens/BodyScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MindScreen } from '../screens/MindScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { TempleScreen } from '../screens/TempleScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Nutrition" 
          component={NutritionScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Mind" 
          component={MindScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Body" 
          component={BodyScreen}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen 
          name="Temple" 
          component={TempleScreen}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}; 