import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {CollectionScreen} from '../../screens/CollectionScreen';
import {SubFolderScreen} from '../../screens/SubFolderScreen';
import {CollectionStackParamList} from '../types/navigation.types';
import {RightSideHeader} from '../HeaderComponents/RightSideHeader';
import {LeftSideHeader} from '../HeaderComponents/LeftSideHeader';
import {PlayerScreen} from '../../screens/PlayerScreen';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AudioPlayer} from '../../components/AudioPlayer';
import {PlayerState} from '../../redux/playerSlice';
import {ProfileModal} from '../../components/modals/ProfileModal';
import {ParentFolderOptionsModal} from '../../components/modals/ParentFolderOptionsModal.tsx';
import {RenameParentFolderModal} from '../../components/modals/RenameParentFolderModal.tsx';
import {RenameSubFolderModal} from '../../components/modals/RenameSubFolderModal.tsx';
import {SubFolderOptionsModal} from '../../components/modals/SubFolderOptionsModal.tsx';

const Stack = createNativeStackNavigator<CollectionStackParamList>();

const CollectionScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerLeft: LeftSideHeader,
  headerRight: RightSideHeader,
  headerTitle: '',
  headerBackVisible: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: '#151314',
  },

  headerTintColor: 'white',
  headerTitleAlign: 'center',
};

const SubFolderScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerLeft: LeftSideHeader,
  headerRight: RightSideHeader,
  headerTitle: '',
  headerTitleStyle: {
    fontSize: 35,
    fontWeight: '500',
    color: 'white',
  },
  headerBackVisible: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: '#151314',
  },
  headerTintColor: 'white',
  headerTitleAlign: 'center',
};

const PlayerScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerLeft: LeftSideHeader,
  headerRight: RightSideHeader,
  headerTitle: '',
  headerTitleStyle: {
    fontSize: 35,
    fontWeight: '500',
    color: 'white',
  },
  headerBackVisible: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: '#151314',
  },
  headerTintColor: 'white',
  headerTitleAlign: 'center',
};

export const CollectionStack = () => {
  const activeTrack = useSelector(
    (state: {player: PlayerState}) => state.player.activeTrack || null,
  );

  return (
    <View style={styles.wholeContainer}>
      <Stack.Navigator screenOptions={CollectionScreenOptions}>
        <Stack.Screen
          name="CollectionScreen"
          component={CollectionScreen}
          options={CollectionScreenOptions}
        />
        <Stack.Screen
          name="SubFolderScreen"
          component={SubFolderScreen}
          options={SubFolderScreenOptions}
        />
        <Stack.Screen name="PlayerScreen" component={PlayerScreen} options={PlayerScreenOptions} />
      </Stack.Navigator>

      {/* For Conditionally rendering the music player at the bottom of the screen */}
      {activeTrack && (
        <View style={styles.footer}>
          <AudioPlayer activeTrack={activeTrack} />
        </View>
      )}

      <ProfileModal />

      <ParentFolderOptionsModal />

      <SubFolderOptionsModal />

      <RenameParentFolderModal />

      <RenameSubFolderModal />
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    paddingVertical: 10,
    backgroundColor: '#151314',
  },
});
