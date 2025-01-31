import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ResultScreen} from '../screens/ResultScreen';
import {MainStackParamList} from './types/navigation.types';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<MainStackParamList>();

const resultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  // headerLeft: HeaderBackButton,
  headerTitle: '',
  // headerRight: HeaderSettingsButton,
  headerBackVisible: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: '#121944',
  },
  headerTintColor: 'white',
  headerTitleAlign: 'center',
};

export const MainStack = () => {
  return (
    <View style={styles.container}>
      <View style={styles.stackContainer}>
        <Stack.Navigator screenOptions={resultScreenOptions}>
          <Stack.Screen
            name="ResultScreen"
            component={ResultScreen}
            options={resultScreenOptions}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
  },
});
