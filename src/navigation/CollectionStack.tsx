import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';

import {CollectionScreen} from '../screens/CollectionScreen';
import {CollectionStackParamList} from './types/navigation.types';
import {RightSideHeader} from './HeaderComponents/RightSideHeader';
import {LeftSideHeader} from './HeaderComponents/LeftSideHeader';
import {PlayerScreen} from '../screens/PlayerScreen';

// This stack will contain the bulk of the content related to music players and folders.
// The point of keeping these in a stack so you have control of the screens options in one place.

const Stack = createNativeStackNavigator<CollectionStackParamList>();

const CollectionScreenOptions: NativeStackNavigationOptions = {
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

const PlayerScreenOptions: NativeStackNavigationOptions = {
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

export const CollectionStack = () => {
  return (
    <Stack.Navigator screenOptions={CollectionScreenOptions}>
      <Stack.Screen
        name="CollectionScreen"
        component={CollectionScreen}
        options={CollectionScreenOptions}
      />
      <Stack.Screen name="PlayerScreen" component={PlayerScreen} options={PlayerScreenOptions} />
    </Stack.Navigator>
  );
};
