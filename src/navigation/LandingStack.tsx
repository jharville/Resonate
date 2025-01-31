import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LandingScreen} from '../screens/LandingScreen';
import {LandingStackParamList} from './types/navigation.types';

const Stack = createStackNavigator<LandingStackParamList>();

export const LandingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
    </Stack.Navigator>
  );
};
