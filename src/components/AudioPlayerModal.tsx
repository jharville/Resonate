import React, {useRef, useEffect, useCallback, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store.tsx';
import {closeAudioPlayerModal, openAudioPlayerModal} from '../redux/audioPlayerModalSlice.ts';
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
import Entypo from 'react-native-vector-icons/Entypo';
import {setActiveTrack} from '../redux/playerSlice.tsx';
import {isIOS} from '../utilities/constants.ts';
import {PressableScaleButton} from './PressableScaleButton.tsx';
import {WaveFormDisplay} from './WaveFormDisplay.tsx';
import {getActionButton} from '../utilities/getActionButton.tsx';
import {useFormatTime} from '../Hooks/useFormatTime.ts';
import {useSubFolderImageURL} from '../Hooks/useSubFolderImageURL.ts';

export const AudioPlayerModal = () => {
  const [loopEnabled, setLoopEnabled] = useState(false);

  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state: RootState) => state.audioPlayerModal.isAudioPlayerModalVisible,
  );
  const {parentFolderName, parentFolderId, subFolderName, subFolderId} = useSelector(
    (state: RootState) => state.routeParams,
  );

  const subFolderArt = useSubFolderImageURL({parentFolderId, subFolderId});

  const activeTrack = useSelector(
    (state: {player: {activeTrack: AddTrack}}) => state.player.activeTrack,
  );

  const metaData = useSelector(
    (state: RootState) => state.player.metaData[activeTrack?.name ?? 'ERROR: No Meta Data!'],
  );

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  const {position, duration} = useProgress(25);

  const playbackState = usePlaybackState();

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

  // Play Song
  const playSong = useCallback(async () => {
    await TrackPlayer.play();
  }, [dispatch]);

  // Pause Song
  const pauseSong = useCallback(async () => {
    await TrackPlayer.pause();
  }, [dispatch]);

  // Handle Song Action
  const handleSongAction = useCallback(async () => {
    if (playbackState.state === State.Playing) {
      await pauseSong();
    } else {
      await playSong();
    }
  }, [playbackState.state, playSong, pauseSong]);

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

  return (
    <Animated.View style={[styles.modal, {transform: [{translateY: slideAnim}]}]}>
      {/* All Content */}
      <View style={styles.content}>
        {/* Track Name and Close Button */}
        <View style={styles.trackNameAndCloseButton}>
          <View style={styles.trackTitleAndSubFolderName}>
            <Text style={styles.trackTitleStyle} numberOfLines={1}>
              Track: {activeTrack?.name}
            </Text>

            <Text style={styles.subFolderName} numberOfLines={1}>
              SubFolder: {subFolderName}
            </Text>

            <Text style={styles.parentFolderName} numberOfLines={1}>
              Folder: {parentFolderName}
            </Text>
          </View>

          {/* Close Modal Button */}
          <TouchableOpacity onPress={closeModal}>
            <AntDesign name="down" size={35} color="#0078D7" />
          </TouchableOpacity>
        </View>

        {/* Record Icon Container */}
        <View style={styles.artContainer}>
          {subFolderArt ? (
            <View style={styles.artStyle}>
              <Image source={{uri: subFolderArt}} style={{flex: 1}} resizeMode="cover" />
            </View>
          ) : (
            <View style={styles.recordStyle}>
              <FontAwesome name="record-vinyl" size={100} color="#0078D7" />
            </View>
          )}
        </View>

        <View style={styles.waveButtonsSliderMetaContainer}>
          {/* Wave Form */}
          <View style={styles.waveContainer}>
            <WaveFormDisplay waveformData={metaData.waveform} />
          </View>

          {/* Track Buttons */}
          <View style={styles.trackButtonsContainer}>
            {/* Comment Button */}
            <PressableScaleButton scale={0.8}>
              <FontAwesome
                name="comments"
                size={30}
                color="#fff"
                style={styles.forceCommentStyle}
              />
            </PressableScaleButton>

            {/* Previous Track Button */}
            <PressableScaleButton scale={0.8} onPress={handlePreviousTrackPress}>
              <FontAwesome
                name="backward-fast"
                size={35}
                color="#ffffff"
                style={styles.forceSkipForwardStyle}
              />
            </PressableScaleButton>

            {/* Main Action Button */}
            <TouchableOpacity onPress={handleSongAction}>
              <View style={styles.getActionButtonStyle}>
                {getActionButton({playPauseButtonSize: 60})}
              </View>
            </TouchableOpacity>

            {/* Skip Button */}
            <PressableScaleButton scale={0.8} onPress={handleNextTrackPress}>
              <FontAwesome
                name="forward-fast"
                size={35}
                color="#ffffff"
                style={styles.forceSkipForwardStyle}
              />
            </PressableScaleButton>

            {/* Loop Button */}
            <PressableScaleButton scale={0.8} onPress={handleLoopPress}>
              <Entypo
                name="loop"
                size={37}
                color={loopEnabled ? '#0078D7' : '#fff'}
                style={styles.forceLoopStyle}
              />
            </PressableScaleButton>
          </View>
          {/* Audio Slider */}
          <View style={styles.sliderTrackTimesMetaContainer}>
            <TouchableOpacity style={isIOS ? null : styles.androidSliderContainer}>
              <Slider
                key={activeTrack?.id}
                value={position}
                style={isIOS ? styles.iosSliderStyle : styles.androidSliderStyle}
                minimumValue={0}
                maximumValue={duration}
                onSlidingComplete={handleSeek}
                minimumTrackTintColor="#0078D7"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#0078D7"
                tapToSeek={true}
              />
              {/* Track Times */}
            </TouchableOpacity>
            <View style={styles.trackTimesRow}>
              <Text style={styles.timeText}>{useFormatTime(position)}</Text>
              <Text style={styles.timeText}>{useFormatTime(duration)}</Text>
            </View>
            {/* Meta Info */}
            <View style={styles.metaDataContainer}>
              <Text style={styles.metaDataStyle}>{metaData?.fileType}</Text>
              <Text style={styles.metaDataStyle}>•</Text>
              <Text style={styles.metaDataStyle}>LUFS: {metaData?.loudnessLufs}</Text>
              <Text style={styles.metaDataStyle}>•</Text>
              <Text style={styles.metaDataStyle}>{metaData?.sampleRate}kHz</Text>
              <Text style={styles.metaDataStyle}>•</Text>
              <Text style={styles.metaDataStyle}>
                {metaData?.fileType === 'mp3'
                  ? `${metaData?.bitRate}kbps`
                  : `${metaData?.bitDepth}bit`}
              </Text>
            </View>
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
    flex: 1,
    paddingTop: isIOS ? 20 : 5,
  },

  trackNameAndCloseButton: {
    flexDirection: 'row',
    paddingBottom: 20,
    gap: 15,
  },

  artContainer: {
    aspectRatio: 1,
    backgroundColor: '#2C2F33',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },

  artStyle: {
    flex: 1,
  },

  recordStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  waveButtonsSliderMetaContainer: {
    justifyContent: 'center',
    flex: 1,
    gap: 10,
  },

  waveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  sliderTrackTimesMetaContainer: {
    gap: isIOS ? 0 : 10,
  },

  trackTitleAndSubFolderName: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  trackTitleStyle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },

  subFolderName: {
    color: 'white',
    fontSize: 15,
  },

  parentFolderName: {
    color: 'white',
    fontSize: 15,
  },

  trackButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 35,
    paddingTop: isIOS ? 20 : 10,
  },

  getActionButtonStyle: {
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  forceSkipForwardStyle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  forceCommentStyle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },

  forceLoopStyle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },

  timeText: {
    color: 'white',
    fontSize: 18,
  },

  trackTimesRow: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  androidSliderContainer: {
    alignItems: 'center',
  },

  iosSliderStyle: {},

  androidSliderStyle: {
    transform: [{scaleY: 2.2}, {scaleX: 2.2}],
    width: '53%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  metaDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    paddingTop: isIOS ? 30 : 20,
  },

  metaDataStyle: {
    color: 'white',
    fontSize: 16,
  },
});
