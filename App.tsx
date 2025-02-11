import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {useSetupTrackPlayer} from './src/useSetupTrackPlayer'; //  A custom hook for setting up TrackPlayer
import {Provider} from 'react-redux';
import {store} from './store';

const App = () => {
  const [isSetup, setupPlayer] = useSetupTrackPlayer();

  // useEffect runs when the component mounts and whenever `isSetup` or `setupPlayer` changes
  useEffect(() => {
    if (!isSetup) {
      setupPlayer();
    } else {
    }
  }, [isSetup, setupPlayer]); // Dependencies: Runs the effect when these values change

  return (
    <NavigationContainer>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </NavigationContainer>
  );
};

export default App;
