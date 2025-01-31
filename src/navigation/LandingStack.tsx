import React from 'react';
import {LandingScreen} from '../screens/LandingScreen';
import {LandingStackParamList} from './types/navigation.types';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {HeaderBarsButton} from './HeaderComponents/HeaderBarsButton';
import {RightSideHeader} from './HeaderComponents/RightSideHeader';
import {LeftSideHeader} from './HeaderComponents/LeftSideHeader';

const Stack = createNativeStackNavigator<LandingStackParamList>();

const landingScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerLeft: LeftSideHeader,
  headerRight: RightSideHeader,
  headerTitle: '',
  headerTitleStyle: {
    fontFamily: '',
    fontSize: 35,
    fontWeight: '500',
    color: 'white',
  },
  headerBackVisible: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: '#26272b',
  },
  headerTintColor: 'white',
  headerTitleAlign: 'center',
};

export const LandingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={landingScreenOptions}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} options={landingScreenOptions} />
    </Stack.Navigator>
  );
};
