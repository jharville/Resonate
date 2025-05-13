import {ActivityIndicator, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {State, usePlaybackState} from 'react-native-track-player';
import React from 'react';
import {isIOS} from './constants.ts';

//TrackPlayer States
/*
Undefined: "undefined",
None: "none",
Ready: "Track is ready to play",
Playing: "Track is playing",
Paused: "Track is paused",
Ended: "Track has ended",
Stopped: "Track has been stopped a.k.a Reset"
Buffering: "Track is buffering",
*/

export const getActionButton = ({
  playPauseButtonSize: playPauseButtonSize,
}: GetActionButtonProps) => {
  const playbackState = usePlaybackState();

  if (playbackState.state === State.Playing) {
    return <MaterialIcons name="pause-circle-outline" size={playPauseButtonSize} color="#fff" />;
  } else if (playbackState.state === State.Paused) {
    return <MaterialIcons name="play-circle-outline" size={playPauseButtonSize} color="#fff" />;
  } else if (playbackState.state === State.Buffering)
    return <ActivityIndicator color="#0078D7" size={isIOS ? 'large' : 50} />;
  else if (playbackState.state === State.Loading) {
    return <ActivityIndicator color="#0078D7" size={isIOS ? 'large' : 50} />;
  } else if (playbackState.state === State.Stopped) {
    return <MaterialIcons name="play-circle-outline" size={playPauseButtonSize} color="#fff" />;
  } else if (playbackState.state === State.Ready) {
    return <MaterialIcons name="play-circle-outline" size={playPauseButtonSize} color="#fff" />;
  } else if (playbackState.state === State.Ended) {
    return <MaterialIcons name="play-circle-outline" size={playPauseButtonSize} color="#fff" />;
  } else if (playbackState.state === State.Error) {
    return <Text style={{color: 'white', fontSize: 14}}>ERROR!</Text>;
  } else if (playbackState.state === undefined) {
    return null;
  }
};

//I'm passing this prop because the size of the button is different in the PlayerScreen and AudioPlayerModal
type GetActionButtonProps = {
  playPauseButtonSize: number;
};
