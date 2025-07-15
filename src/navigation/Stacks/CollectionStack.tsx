import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CollectionScreen} from '../../screens/CollectionScreen';
import {SubFolderScreen} from '../../screens/SubFolderScreen';
import {CollectionStackParamList} from '../types/navigation.types';
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
import {CustomHeader} from '../../components/CustomHeader.tsx';

const Stack = createNativeStackNavigator<CollectionStackParamList>();

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
      <Stack.Navigator>
        {/* Collection Screen */}
        <Stack.Screen
          name="CollectionScreen"
          component={CollectionScreen}
          options={({navigation, route}) => ({
            header: () => <CustomHeader route={route} navigation={navigation} options={{}} />,
          })}
        />

        {/* SubFolder Screen */}
        <Stack.Screen
          name="SubFolderScreen"
          component={SubFolderScreen}
          options={({navigation, route}) => ({
            header: () => <CustomHeader route={route} navigation={navigation} options={{}} />,
          })}
        />

        {/* Player Screen */}
        <Stack.Screen
          name="PlayerScreen"
          component={PlayerScreen}
          options={({navigation, route}) => ({
            header: () => <CustomHeader route={route} navigation={navigation} options={{}} />,
          })}
        />
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
    backgroundColor: '#151314',
  },
  footer: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    paddingBottom: 10,
    backgroundColor: '#151314',
  },
});
