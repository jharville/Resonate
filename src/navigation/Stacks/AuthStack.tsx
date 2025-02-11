import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {AuthScreen} from '../../screens/AuthScreen';
import {AuthStackParamList} from '../types/navigation.types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const authScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={authScreenOptions}>
      <Stack.Screen name="AuthScreen" component={AuthScreen} />
    </Stack.Navigator>
  );
};

/*
The primary purpose of using an AuthStack is flexibility. 
In an authentication flow, you often have multiple screens, such as:

- Login screen
- Sign-up screen
- Password reset screen
- Two-factor authentication screen

By using an AuthStack, you group all these related screens under one navigator, 
making the authentication process modular and easier to manage. 

If your app's authentication process becomes more complex in the future, 
you can easily add or rearrange screens without needing to refactor the higher-level navigator.
*/
