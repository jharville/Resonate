import React, {useCallback} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import TrackPlayer, {AddTrack, State, usePlaybackState} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {PressableScaleButton} from './PressableScaleButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import {isIOS} from '../constants.ts';
import {DotIndicator} from 'react-native-indicators';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {toggleAudioPlayerModal} from '../redux/audioPlayerModalSlice.ts';
import {PlayerState} from '../redux/playerSlice.tsx';

//TrackPlayer States
/*
Undefined: "undefined",
None: "none",
Ready: "Track is ready to play",
Playing: "Track is playing",
Paused: "Track is paused",
Stopped: "Track has been stopped a.k.a Reset"
Buffering: "Track is buffering",
*/

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
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('🚨 Error in playSong:', error);
    }
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
  }, [playbackState, playSong, pauseSong]);

  //For getting the appropriate icon based on TrackPlayer state
  const getActionButton = () => {
    if (playbackState.state === State.Playing) {
      return <MaterialIcons name="pause-circle-outline" size={50} color="#fff" />;
    } else if (playbackState.state === State.Paused) {
      return <MaterialIcons name="play-circle-outline" size={50} color="#fff" />;
    } else if (playbackState.state === State.Buffering)
      return <DotIndicator color="white" size={7} count={3} />;
    else if (playbackState.state === State.Loading) {
      return <DotIndicator color="white" size={7} count={3} />;
    } else if (playbackState.state === State.None) {
      return <MaterialIcons name="play-circle-outline" size={50} color="#fff" />;
    } else if (playbackState.state === State.Stopped) {
      return <MaterialIcons name="play-circle-outline" size={50} color="#fff" />;
    } else if (playbackState.state === State.Ready) {
      return <MaterialIcons name="play-circle-outline" size={50} color="#fff" />;
    } else if (playbackState.state === State.Ended) {
      return <MaterialIcons name="play-circle-outline" size={50} color="#fff" />;
    } else if (playbackState.state === State.Error) {
      return <Text>ERROR</Text>;
    } else if (playbackState.state === undefined) {
      return null;
    }
  };

  const handleAudioPlayerModalPress = () => {
    dispatch(toggleAudioPlayerModal());
  };

  return (
    <View style={isIOS ? styles.iosAudioPlayer : styles.androidAudioPlayer}>
      <View style={styles.vinylAndInfoContainer}>
        <View style={styles.recordContainer}>
          <FontAwesome name="record-vinyl" size={40} color="#0078D7" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">
            {userHighlightedTrack.name}
          </Text>
          <Text style={styles.trackSubFolder} numberOfLines={1} ellipsizeMode="tail">
            {subFolderName}
          </Text>
        </View>
      </View>

      <View style={styles.rightSideButtons}>
        <PressableScaleButton
          style={styles.actionButtonStyle}
          scale={0.9}
          onPress={handleSongAction}>
          {getActionButton()}
        </PressableScaleButton>
        <PressableScaleButton scale={0.9} onPress={handleAudioPlayerModalPress}>
          <AntDesign name="up" size={40} color="#fff" />
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
