import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LandingScreen from '../screens/LandingScreen';
import ResultScreen from '../screens/ResultScreen';
import {Text} from 'react-native';

// Create the Tab Navigator
const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide headers on individual screens (optional)
        tabBarStyle: {backgroundColor: '#fff'}, // Style the tab bar
        tabBarLabelStyle: {fontSize: 12}, // Style tab labels
      }}>
      {/* Tab for Landing Screen */}
      <Tab.Screen
        name="Home"
        component={LandingScreen}
        options={{
          tabBarIcon: () => <Text>🏠</Text>, // Add a simple icon
        }}
      />

      {/* Tab for Result Screen */}
      <Tab.Screen
        name="Results"
        component={ResultScreen}
        options={{
          tabBarIcon: () => <Text>📊</Text>, // Add a simple icon
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
