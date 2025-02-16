import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStack} from './Stacks/AuthStack';
import {CollectionStack} from './Stacks/CollectionStack';
import {RootNavigatorParamList} from './types/navigation.types';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {onAuthStateChanged, User} from 'firebase/auth';
import {clearUser, setUser} from '../redux/authSlice';
import {auth} from '../../firebaseConfig';
import {useSetupTrackPlayer} from '../useSetupTrackPlayer';

// RootNavigator contains all of the stacks going forward. This allows you to apply
// options over all of the stacks so you don't have to do it individually.

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const dispatch = useDispatch();
  const [isSetup, setupPlayer] = useSetupTrackPlayer();

  // For persisting the user authentication throughout the app. Use this code for auth on each screen.
  //  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
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
    });

    return () => unsubscribe();
  }, []);

  // This useEffect is for TrackPlayer and it runs when the component mounts
  //  and whenever `isSetup` or `setupPlayer` changes
  useEffect(() => {
    if (!isSetup) {
      setupPlayer();
    } else {
    }
  }, [isSetup, setupPlayer]);

  return (
    <Stack.Navigator initialRouteName="AuthStack" screenOptions={{headerShown: false}}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="CollectionStack" component={CollectionStack} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
