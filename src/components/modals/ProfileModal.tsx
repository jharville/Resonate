import React, {useRef, useEffect} from 'react';
import {Text, TouchableOpacity, Animated, StyleSheet, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {closeProfileModal} from '../../redux/profileModalSlice';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootNavigatorParamList} from '../../navigation/types/navigation.types';

export const ProfileModal = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();
  const dispatch = useDispatch();
  const isVisible = useSelector((state: RootState) => state.profileModal.isProfileModalVisible);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  const app = getApp();
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userName = user?.displayName || 'No User Name Set';

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').width,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      dispatch(closeProfileModal());

      navigation.reset({
        index: 0,
        routes: [{name: 'AuthStack'}],
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <Animated.View style={[styles.menu, {transform: [{translateX: slideAnim}]}]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => dispatch(closeProfileModal())}>
          <Ionicons name="person" size={30} color="#fff" />
          <Text style={styles.menuText}>{userName}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => dispatch(closeProfileModal())}>
          <Ionicons name="person-outline" size={30} color="#fff" />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => dispatch(closeProfileModal())}>
          <FontAwesome name="cog" size={30} color="#fff" />
          <Text style={styles.menuText}>Preferences</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <FontAwesome name="sign-out" size={30} color="#fff" />
          <Text style={styles.menuText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={() => dispatch(closeProfileModal())}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 200,
    height: '100%',
    backgroundColor: '#333',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  menuItem: {paddingVertical: 15, flexDirection: 'row', gap: 10, alignItems: 'center'},

  menuText: {color: 'white', fontSize: 18},

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },

  closeText: {color: 'white', fontSize: 16},
});
