import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {useSetupTrackPlayer} from './src/useSetupTrackPlayer';

const App: React.FC = () => {
  const [isSetup, setupPlayer] = useSetupTrackPlayer();

  useEffect(() => {
    if (!isSetup) {
      console.log('Track Player Not Setup');
      setupPlayer();
    } else {
      console.log('Track Player Setup');
    }
  }, [isSetup, setupPlayer]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
