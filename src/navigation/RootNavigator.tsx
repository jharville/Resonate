import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './Stacks/AuthStack';
import {CollectionStack} from './Stacks/CollectionStack';
import {RootNavigatorParamList} from './types/navigation.types';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {onAuthStateChanged, FirebaseAuthTypes} from '@react-native-firebase/auth';
import {clearUser, setUser} from '../redux/authSlice';
import {auth} from '../../firebaseConfig';
import {useSetupTrackPlayer} from '../useSetupTrackPlayer';
import {RootState} from '../../store';
import {ActivityIndicator, View} from 'react-native';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isSetup, setupPlayer] = useSetupTrackPlayer();
  const [isLoading, setIsLoading] = useState(true);

  // For persisting the user authentication throughout the app and on close/open
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseAuthTypes.User | null) => {
      if (user) {
        const userData = {
          uid: user.uid,
          displayName: user.displayName || null,
          email: user.email,
        };
        dispatch(setUser(userData));
      } else {
        dispatch(clearUser());
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // This useEffect is for TrackPlayer and it runs when the component mounts
  //  and whenever `isSetup` or `setupPlayer` changes
  useEffect(() => {
    if (!isSetup) {
      setupPlayer();
    }
  }, [isSetup, setupPlayer]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? 'CollectionStack' : 'AuthStack'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="CollectionStack" component={CollectionStack} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
