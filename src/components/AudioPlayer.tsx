import React, {useCallback} from 'react';
import {View, Button} from 'react-native';
import TrackPlayer from 'react-native-track-player';

export const AudioPlayer = () => {
  // Define the playSong function using useCallback to ensure it does not re-create on every render
  const playSong = useCallback(async () => {
    console.log('adding song');

    // Add a song to TrackPlayer's queue
    await TrackPlayer.add([
      {
        id: 'trackId', // Unique identifier for the track
        url: 'https://firebasestorage.googleapis.com/v0/b/resonate-36c63.firebasestorage.app/o/Gasoline.mp3?alt=media&token=a95b61e7-6ba0-48b6-9ab5-2904816ffc12', // URL of the audio file
        title: 'Track Title', // Title of the track
        artist: 'Track Artist', // Artist of the track
        // artwork: require('track.png'), // Uncomment and provide a valid image if artwork is needed
      },
    ]);
    console.log('added song');

    // Start playing the track
    await TrackPlayer.play();
  }, []); // Empty dependency array ensures this function is memoized and does not recreate on re-renders

  return (
    <View style={{padding: 20}}>
      <Button title="Play" onPress={playSong} />
      <Button title="Pause" onPress={() => TrackPlayer.pause()} />
      <Button title="Stop" onPress={() => TrackPlayer.stop()} />
    </View>
  );
};
