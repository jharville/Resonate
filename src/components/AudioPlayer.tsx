import React, {useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import TrackPlayer, {AddTrack, State, usePlaybackState} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {PressableScaleButton} from './PressableScaleButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {toggleAudioPlayerModal} from '../redux/audioPlayerModalSlice.ts';
import {PlayerState} from '../redux/playerSlice.tsx';
import {getActionButton} from '../utilities/getActionButton.tsx';

export const AudioPlayer = () => {
  const dispatch = useDispatch();
  const playbackState = usePlaybackState();

  const activeTrack = useSelector(
    (state: {player: {activeTrack: AddTrack}}) => state.player.activeTrack,
  );

  const subFolderName = useSelector((state: {player: PlayerState}) => state.player.subFolderName);

  const userHighlightedTrack = {
    id: activeTrack?.id,
    url: activeTrack?.url,
    name: activeTrack?.name,
  };

  // Play Song
  const playSong = useCallback(async () => {
    await TrackPlayer.play();
  }, [dispatch]);

  // Pause Song
  const pauseSong = useCallback(async () => {
    await TrackPlayer.pause();
  }, [dispatch]);

  //Handle Song Action
  const handleSongAction = useCallback(async () => {
    if (playbackState.state === State.Playing) {
      await pauseSong();
    } else {
      await playSong();
    }
  }, [playbackState.state, playSong, pauseSong]);

  const handleAudioPlayerModalPress = () => {
    dispatch(toggleAudioPlayerModal());
  };

  return (
    <View style={styles.wholeContainer}>
      <View style={styles.vinylAndInfoContainer}>
        <View style={styles.recordContainer}>
          <FontAwesome name="record-vinyl" size={40} color="#0078D7" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">
            {userHighlightedTrack.name}
          </Text>
          <Text style={styles.trackSubFolder} numberOfLines={1} ellipsizeMode="tail">
            {subFolderName || '???'}
          </Text>
        </View>
      </View>

      <View style={styles.rightSideButtons}>
        <PressableScaleButton
          style={styles.actionButtonStyle}
          scale={0.9}
          onPress={handleSongAction}>
          {getActionButton({playPauseButtonSize: 50})}
        </PressableScaleButton>
        <PressableScaleButton scale={0.9} onPress={handleAudioPlayerModalPress}>
          <AntDesign name="up" size={40} color="#fff" />
        </PressableScaleButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#151314',
    borderTopWidth: 3,
    borderColor: '#4e555d',
  },

  vinylAndInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },

  rightSideButtons: {
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },

  actionButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
  },

  trackTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 700,
  },

  trackSubFolder: {
    color: 'white',
    fontSize: 15,
    fontWeight: 400,
  },

  recordContainer: {
    backgroundColor: '#26272b',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});
