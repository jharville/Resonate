import React from 'react';
import {StyleSheet, View, ScrollView, Text, ActivityIndicator} from 'react-native';
import {useFetchSongs} from '../useFetchSongs.tsx';
import {SongList} from '../components/SongList.tsx';
import {useDispatch} from 'react-redux';
import {setActiveTrack} from '../redux/playerSlice.tsx';
import {UploadSong} from '../components/UploadSong.tsx';
import {SongUploadProgress} from '../components/SongUploadProgress.tsx';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types.ts';
import {loadingStatuses, useLoadingStatus} from '../useLoadingStatuses.tsx';

// This is the "Player Screen". This will only render the player at the bottom
// and songs listed from Firebase per User.
// No folder funcitonality

export const PlayerScreen = ({route}: CollectionStackScreenProps<'PlayerScreen'>) => {
  const dispatch = useDispatch();
  const {folderId, artistName, subFolderName} = route.params;
  const songs = useFetchSongs(folderId);
  const {status} = useLoadingStatus();

  const handleSelectSong = (song: any) => {
    dispatch(setActiveTrack(song)); // Sets selected track in Redux
  };

  return (
    <>
      <View style={styles.wholePage}>
        <SongUploadProgress />
        <View style={styles.folderAndArtistContainer}>
          <Text style={styles.subFolderName}>{subFolderName}</Text>
          <Text style={styles.artistNameStyle}>{artistName}</Text>
        </View>

        {status === loadingStatuses.LOADING ? (
          <ActivityIndicator size="large" color="#0078D7" />
        ) : songs.length === 0 ? (
          <>
            <View style={styles.noSongsContainer}>
              <Text style={styles.addASongText}>Upload A Song!</Text>
            </View>
            <UploadSong folderId={folderId} />
          </>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              <View style={styles.folderContainer}>
                <SongList songs={songs} onSelectSong={handleSelectSong} />
              </View>
            </ScrollView>
            <UploadSong folderId={folderId} />
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wholePage: {
    flex: 1,
    backgroundColor: '#151314',
  },

  noSongsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addASongText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  folderAndArtistContainer: {
    backgroundColor: '#2C2F33',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },

  subFolderName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 10,
  },

  artistNameStyle: {
    fontSize: 17,
    fontWeight: '300',
    color: 'white',
    paddingLeft: 10,
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
