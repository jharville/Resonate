import React, {useRef, useEffect, useState} from 'react';
import {Text, TouchableOpacity, Animated, StyleSheet, Dimensions, View} from 'react-native';
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
  const [shouldRender, setShouldRender] = useState(false);

  const app = getApp();
  const auth = getAuth(app);
  const user = auth.currentUser;
  const userName = user?.displayName || 'No User Name Set';

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
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
      {shouldRender && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={() => dispatch(closeProfileModal())}>
          <Animated.View
            style={[styles.menu, {transform: [{translateX: slideAnim}]}]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.itemsContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => dispatch(closeProfileModal())}>
                <Ionicons name="person" size={30} color="#fff" />
                <Text style={styles.menuText}>{userName}</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.menuItem} onPress={() => dispatch(closeProfileModal())}>
                <Ionicons name="person-outline" size={30} color="#fff" />
                <Text style={styles.menuText}>Edit Profile</Text>
              </TouchableOpacity> */}
              {/* 
              <TouchableOpacity style={styles.menuItem} onPress={() => dispatch(closeProfileModal())}>
                <FontAwesome name="cog" size={30} color="#fff" />
                <Text style={styles.menuText}>Preferences</Text>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
                <FontAwesome name="sign-out" size={30} color="#fff" />
                <Text style={styles.menuText}>Sign Out</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => dispatch(closeProfileModal())}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.423)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },

  menu: {
    width: 200,
    height: '100%',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  itemsContainer: {
    gap: 30,
  },

  menuItem: {flexDirection: 'row', gap: 10, alignItems: 'center'},

  menuText: {color: 'white', fontSize: 18},

  closeButton: {
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },

  closeText: {color: 'white', fontSize: 16},
});
