import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {Provider} from 'react-redux';
import {store} from './store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

const App = () => {
  return (
    <GestureHandlerRootView>
      <StatusBar barStyle="light-content" backgroundColor="#1f1f1f" />
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Provider store={store}>
            <RootNavigator />
          </Provider>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1f1f1f', // Fills the iOS status bar area with the same color
  },
});

export default App;
