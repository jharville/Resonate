import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './Stacks/AuthStack';
import {CollectionStack} from './Stacks/CollectionStack';
import {RootNavigatorParamList} from './types/navigation.types';
import React from 'react';

// RootNavigator contains all of the stacks going forward. This allows you to apply
// options over all of the stacks so you don't have to do it individually.

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AuthStack" screenOptions={{headerShown: false}}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="CollectionStack" component={CollectionStack} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
