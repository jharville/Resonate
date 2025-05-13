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
import {SongOptionsModal} from '../../components/modals/SongOptionsModal.tsx';
import {RenameSongModal} from '../../components/modals/RenameSongModal.tsx';
import {AudioPlayerModal} from '../../components/AudioPlayerModal.tsx';
import {ReorderSongsModal} from '../../components/modals/ReorderSongsModal.tsx';
import {RootState} from '../../../store.tsx';
import {DebugGridOverlay} from '../../components/DebugGridOverlay.tsx';
import {useSyncActiveTrack} from '../../Hooks/useSyncActiveTrack.ts';
import {useRestartQueueAtEnd} from '../../Hooks/useRestartQueueAtEnd.ts';

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

export const CollectionStack = () => {
  const activeTrack = useSelector(
    (state: {player: PlayerState}) => state.player.activeTrack || null,
  );

  const isReorderSongsModalVisible = useSelector(
    (state: RootState) => state.reorderSongsModal.isReorderSongsModalVisible,
  );

  useSyncActiveTrack(); // Keeps Redux in sync with TrackPlayer, so the activeTrack is always up to date
  useRestartQueueAtEnd(); // Restarts the queue when the last song ends but doesn't play it (like spotify)

  return (
    <View style={styles.wholeContainer}>
      <Stack.Navigator screenOptions={CollectionScreenOptions}>
        <Stack.Screen
          name="CollectionScreen"
          component={CollectionScreen}
          options={CollectionScreenOptions}
        />
        <Stack.Screen name="SubFolderScreen" component={SubFolderScreen} />
        <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
      </Stack.Navigator>

      {/* For Conditionally rendering the music player at the bottom of the screen */}
      {activeTrack && (
        <View style={styles.footer}>
          <AudioPlayer />
        </View>
      )}

      <ProfileModal />

      <ParentFolderOptionsModal />

      <SubFolderOptionsModal />

      <RenameParentFolderModal />

      <RenameSubFolderModal />

      <SongOptionsModal />

      <RenameSongModal />

      {isReorderSongsModalVisible && <ReorderSongsModal />}

      {/* This is the EXPANDED AudioPlayerModal. Not the AudioPlayer */}
      {activeTrack && <AudioPlayerModal />}

      {/* <DebugGridOverlay /> */}
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
    paddingBottom: 10,
    backgroundColor: '#151314',
  },
});
