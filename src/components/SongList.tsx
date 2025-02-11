import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {PressableScaleButton} from './PressableScaleButton';
import {State, usePlaybackState} from 'react-native-track-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {PlayerState} from '../features/playerSlice';
import Entypo from 'react-native-vector-icons/Entypo';

export const SongList = ({songs, onSelectSong}: SongListProps) => {
  const playbackState = usePlaybackState();
  const activeTrack = useSelector((state: {player: PlayerState}) => state.player.activeTrack);

  const getActionButton = (song: Song) => {
    if (activeTrack?.id === song.id && playbackState.state === State.Playing) {
      return <MaterialIcons name="pause-circle-outline" size={40} color="#fff" />;
    }
    return <MaterialIcons name="play-circle-outline" size={40} color="#fff" />;
  };

  return (
    <View>
      {songs.map(song => (
        <>
          <View style={styles.wholeContainer}>
            <View key={song.id} style={styles.iconAndSongContainer}>
              <View>
                <PressableScaleButton scale={0.9}>{getActionButton(song)}</PressableScaleButton>
              </View>
              <TouchableOpacity
                style={styles.songContainer}
                onPress={() => onSelectSong(song)} // Passes selected song to parent
              >
                <Text style={styles.songText} numberOfLines={1} ellipsizeMode="tail">
                  {song.name}
                </Text>
              </TouchableOpacity>
            </View>
            <Entypo name="dots-three-vertical" style={styles.settingsButtonStyle} />
          </View>
        </>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconAndSongContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  songContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  songText: {
    flexShrink: 1,
    color: 'white',
    fontSize: 15,
  },
  settingsButtonStyle: {
    color: 'white',
    fontSize: 28,
    paddingRight: 10,
  },
});

type Song = {
  id: string;
  name: string;
  url: string;
};

type SongListProps = {
  songs: Song[];
  onSelectSong: (song: Song) => void | null;
};
