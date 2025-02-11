import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFetchSongs} from '../useFetchSongs.tsx';
import {SongList} from '../components/SongList.tsx';
import {useDispatch} from 'react-redux';
import {setActiveTrack} from '../features/playerSlice.tsx';

// This is the "Player Screen" this will only render players.
// Players should only have song list functionality and options.
// No folder funcitonality

export const PlayerScreen = () => {
  const dispatch = useDispatch();
  const songs = useFetchSongs();

  const handleSelectSong = (song: any) => {
    dispatch(setActiveTrack(song)); // Sets selected track in Redux
  };

  return (
    <View style={styles.wholePage}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.folderContainer}>
          <SongList songs={songs} onSelectSong={handleSelectSong} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.iconContainer}>
          <Entypo name="plus" size={40} color="white" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
  },

  playerScreenText: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'grey',
    fontSize: 20,
  },

  folderContainer: {
    gap: 25,
    paddingBottom: 20,
  },

  scrollContent: {
    paddingTop: 20,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  songContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  songText: {
    color: 'white',
    fontSize: 16,
  },
});
