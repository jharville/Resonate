import React, {useRef, useEffect, useCallback, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {closeAudioPlayerModal, openAudioPlayerModal} from '../../redux/audioPlayerModalSlice';
import TrackPlayer, {
  AddTrack,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {PacmanIndicator} from 'react-native-indicators';
import {PlayerState, setActiveTrack} from '../../redux/playerSlice.tsx';
import {isIOS} from '../../constants.ts';
import {PressableScaleButton} from '../PressableScaleButton.tsx';

export const AudioPlayerModal = () => {
  const [loopEnabled, setLoopEnabled] = useState(false);
  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state: RootState) => state.audioPlayerModal.isAudioPlayerModalVisible,
  );
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const activeTrack = useSelector(
    (state: {player: {activeTrack: AddTrack}}) => state.player.activeTrack,
  );
  const subFolderName = useSelector((state: {player: PlayerState}) => state.player.subFolderName);
  const artistName = useSelector((state: {player: PlayerState}) => state.player.artistName);

  const {position, duration} = useProgress();
  const playbackStatus = usePlaybackState();

  // Open Modal
  const openModal = () => {
    dispatch(openAudioPlayerModal());
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // Close Modal
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 400,
      useNativeDriver: true,
    }).start();
    dispatch(closeAudioPlayerModal());
  };

  // Display Modal
  useEffect(() => {
    if (isVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  //Play Song
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
    if (playbackStatus.state === State.Playing) {
      await pauseSong();
    } else if (playbackStatus.state === State.Paused) {
      await playSong();
    }
  }, [playbackStatus, playSong, pauseSong]);

  // Previous Track Button Logic
  const handlePreviousTrackPress = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getActiveTrackIndex();
      if (currentIndex === 0) {
        // At the beginning of queue, go to the last track
        await TrackPlayer.skip(queue.length - 1);
      } else {
        await TrackPlayer.skipToPrevious();
      }

      await TrackPlayer.play();
      const currentTrack = await TrackPlayer.getActiveTrack();
      if (currentTrack) {
        dispatch(setActiveTrack(currentTrack));
      }
    } catch (error) {
      console.warn('No previous track available:', error);
    }
  }, [dispatch]);

  // Skip Track Button Logic
  const handleNextTrackPress = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getActiveTrackIndex();
      if (currentIndex === queue.length - 1) {
        // At the end of queue, go to the first track
        await TrackPlayer.skip(0);
      } else {
        await TrackPlayer.skipToNext();
      }

      await TrackPlayer.play();
      const currentTrack = await TrackPlayer.getActiveTrack();
      if (currentTrack) {
        dispatch(setActiveTrack(currentTrack));
      }
    } catch (error) {
      console.warn('No next track available:', error);
    }
  }, [dispatch]);

  //Loop Button Handler
  const handleLoopPress = async () => {
    const currentMode = await TrackPlayer.getRepeatMode();
    if (currentMode === RepeatMode.Track) {
      await TrackPlayer.setRepeatMode(RepeatMode.Off);
      setLoopEnabled(false);
    } else {
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
      setLoopEnabled(true);
    }
  };

  // Scrub Song Function
  const handleSeek = async (value: number) => {
    await TrackPlayer.seekTo(value);
  };

  // Format Song Times
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Action Button in Middle
  const getActionButton = () => {
    if (playbackStatus.state === State.Playing) {
      return <MaterialIcons name="pause-circle-outline" size={60} color="#fff" />;
    } else if (playbackStatus.state === State.Paused) {
      return <MaterialIcons name="play-circle-outline" size={60} color="#fff" />;
    } else if (playbackStatus.state === State.Buffering)
      return <PacmanIndicator color="white" size={60} />;
    else if (playbackStatus.state === State.None) {
      return <MaterialIcons name="play-circle-outline" size={60} color="#fff" />;
    } else if (playbackStatus.state === State.Loading) {
      return <PacmanIndicator color="white" size={60} />;
    } else if (playbackStatus.state === State.Stopped) {
      return <MaterialIcons name="play-circle-outline" size={60} color="#fff" />;
    } else if (playbackStatus.state === State.Ready) {
      return <MaterialIcons name="play-circle-outline" size={60} color="#fff" />;
    } else if (playbackStatus.state === State.Ended) {
      return <MaterialIcons name="play-circle-outline" size={60} color="#fff" />;
    } else if (playbackStatus.state === State.Error) {
      return <Text>ERROR</Text>;
    } else if (playbackStatus.state === undefined) {
      return null;
    }
  };

  return (
    <Animated.View style={[styles.modal, {transform: [{translateY: slideAnim}]}]}>
      <View style={styles.content}>
        <View style={styles.trackNameAndCloseButton}>
          <View style={styles.trackTitleAndSubFolderName}>
            <Text style={styles.trackTitleStyle} numberOfLines={1}>
              {activeTrack?.name}
            </Text>
            <Text style={styles.trackFolderStyle} numberOfLines={1}>
              {subFolderName}
            </Text>
            <Text style={styles.trackFolderStyle} numberOfLines={1}>
              {artistName}
            </Text>
          </View>
          <TouchableOpacity onPress={closeModal}>
            <AntDesign name="down" size={35} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.defaultRecordContainer}>
          <FontAwesome name="record-vinyl" size={100} color="#0078D7" />
        </View>

        <View style={styles.trackButtonsContainer}>
          {/* Comment Button */}
          <PressableScaleButton scale={0.8}>
            <FontAwesome name="comments" size={30} color="#fff" />
          </PressableScaleButton>

          <PressableScaleButton scale={0.8} onPress={handlePreviousTrackPress}>
            {/* Previous Track Button */}
            <FontAwesome name="backward-fast" size={35} color="#ffffff" />
          </PressableScaleButton>

          {/* Main Action Button */}
          <TouchableOpacity onPress={handleSongAction}>
            <View style={styles.getActionButtonStyle}>{getActionButton()}</View>
          </TouchableOpacity>

          {/* Skip Button */}
          <PressableScaleButton scale={0.8} onPress={handleNextTrackPress}>
            <FontAwesome name="forward-fast" size={35} color="#ffffff" />
          </PressableScaleButton>

          {/* Loop Button */}
          <PressableScaleButton scale={0.8} onPress={handleLoopPress}>
            <Entypo name="loop" size={32} color={loopEnabled ? '#0078D7' : '#fff'} />
          </PressableScaleButton>
        </View>

        <View style={styles.sliderAndTrackTimes}>
          <TouchableOpacity style={isIOS ? null : styles.androidSliderContainer}>
            {/* Audio Slider */}
            <Slider
              key={activeTrack?.id}
              value={position}
              style={isIOS ? styles.IOSStyle : styles.androidStyle}
              minimumValue={0}
              maximumValue={duration}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#0078D7"
              maximumTrackTintColor="#ccc"
              thumbTintColor="#0078D7"
              tapToSeek={true}
            />
          </TouchableOpacity>
          <View style={styles.trackTimesRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 20,
  },

  content: {
    paddingTop: isIOS ? 100 : 70,
    gap: 50,
  },

  trackNameAndCloseButton: {
    flexDirection: 'row',
  },

  trackTitleAndSubFolderName: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  trackTitleStyle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  trackFolderStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '300',
  },

  defaultRecordContainer: {
    backgroundColor: '#2C2F33',
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },

  trackButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 35,
  },

  getActionButtonStyle: {
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sliderAndTrackTimes: {
    gap: 10,
  },

  timeText: {
    color: '#ccc',
  },

  trackTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  androidSliderContainer: {
    alignItems: 'center',
  },

  IOSStyle: {},

  androidStyle: {
    transform: [{scaleY: 2.2}, {scaleX: 2.2}],
    width: '53%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
