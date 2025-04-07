import React, {useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import {useDispatch} from 'react-redux';
import {setActiveTrack} from '../redux/playerSlice';
import {PressableScaleButton} from './PressableScaleButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import {isIOS} from '../constants.ts';

//TrackPlayer States
/*
None: "none",
Ready: "ready",
Playing: "playing",
Paused: "paused",
Stopped: "stopped", a.k.a Reset
Buffering: "buffering",
Connecting: "connecting"
*/

export const AudioPlayer = ({activeTrack}: AudioPlayerProps) => {
  const dispatch = useDispatch(); // Redux dispatch function
  const playbackState = usePlaybackState(); // Automatically tracks playback state

  const trackToAdd = {
    id: activeTrack?.id,
    url: activeTrack?.url,
    name: activeTrack?.name,
  };

  const playSong = useCallback(async () => {
    try {
      await TrackPlayer.reset(); // Clears queue to avoid conflicts
      await TrackPlayer.add([trackToAdd]); // Adds the track
      dispatch(setActiveTrack(trackToAdd));
      await TrackPlayer.play();
    } catch (error) {
      console.error('🚨 Error in playSong:', error);
    }
  }, [dispatch, activeTrack]);

  const pauseSong = useCallback(async () => {
    await TrackPlayer.pause();
  }, [dispatch]);

  const handleSongAction = useCallback(async () => {
    if (playbackState.state === State.Playing) {
      await pauseSong();
    } else {
      await playSong();
    }
  }, [playbackState, playSong, pauseSong]);

  //For gettting the appropriate icon based on TrackPlayer state
  const getActionButton = () => {
    if (playbackState.state === State.Playing) {
      return <MaterialIcons name="pause-circle-outline" size={50} color="#fff" />;
    } else playbackState.state === State.Paused;
    return <MaterialIcons name="play-circle-outline" size={50} color="#fff" />;
  };

  return (
    <View style={isIOS ? styles.iosAudioPlayer : styles.androidAudioPlayer}>
      <View style={styles.vinylAndInfoContainer}>
        <View style={styles.recordContainer}>
          <FontAwesome name="record-vinyl" size={40} color="#0078D7" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">
            {trackToAdd.name}
          </Text>
        </View>
      </View>

      <View style={styles.rightSideButtons}>
        <PressableScaleButton scale={0.9} onPress={handleSongAction}>
          {getActionButton()}
        </PressableScaleButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  androidAudioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#151314',
    borderTopWidth: 2,
    borderColor: '#26272b',
  },

  iosAudioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#151314',
    borderTopWidth: 2,
    borderColor: '#26272b',
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
  },

  trackFolderName: {
    color: 'white',
    fontSize: 13,
  },

  trackTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 700,
  },

  recordContainer: {
    backgroundColor: '#26272b',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
});

// const restartSong = useCallback(async () => {
//   await TrackPlayer.seekTo(0); // Moves playback to the start of the track
//   await TrackPlayer.play();
// }, []);

type activeTrack = {
  id: string;
  url: string;
  name: string;
};

type AudioPlayerProps = {
  activeTrack: activeTrack;
};
