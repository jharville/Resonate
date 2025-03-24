import React from 'react';
import {StyleSheet, View, ScrollView, Text} from 'react-native';
import {useFetchSongs} from '../useFetchSongs.tsx';
import {SongList} from '../components/SongList.tsx';
import {useDispatch} from 'react-redux';
import {setActiveTrack} from '../redux/playerSlice.tsx';
import {UploadSong} from '../components/UploadSong.tsx';
import {SongUploadProgress} from '../components/SongUploadProgress.tsx';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types.ts';

// This is the "Player Screen". This will only render the player at the bottom
// and songs listed from Firebase per User.
// No folder funcitonality

export const PlayerScreen = ({route}: CollectionStackScreenProps<'PlayerScreen'>) => {
  const dispatch = useDispatch();
  const {folderId} = route.params;
  const songs = useFetchSongs(folderId);

  const handleSelectSong = (song: any) => {
    dispatch(setActiveTrack(song)); // Sets selected track in Redux
  };

  return (
    <View style={styles.wholePage}>
      <SongUploadProgress />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.folderContainer}>
          <SongList songs={songs} onSelectSong={handleSelectSong} />
        </View>
      </ScrollView>
      <UploadSong folderId={folderId} />
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
