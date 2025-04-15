import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useFetchSongs} from '../useFetchSongs.tsx';
import {SongList} from '../components/SongList.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {UploadSong} from '../components/UploadSong.tsx';
import {SongUploadProgress} from '../components/SongUploadProgress.tsx';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types.ts';
import {loadingStatuses, useLoadingStatus} from '../useLoadingStatuses.tsx';
import {toggleSongOptionsModal} from '../redux/songOptionsModalSlice.ts';
import {setSelectedSong} from '../redux/selectedSongSlice.ts';
import Entypo from 'react-native-vector-icons/Entypo';
import {isIOS} from '../constants.ts';
import {
  closePlayerScreenMainOptionsModal,
  openPlayerScreenMainOptionsModal,
} from '../redux/playerScreenMainOptionsModalSlice.ts';
import {PlayerScreenMainOptionsModal} from '../components/modals/PlayerScreenMainOptionsModal.tsx';
import {setFullRouteInfo} from '../redux/routeParamsSlice.ts';
import {openReorderSongsModal, setHasReorderedSongs} from '../redux/reorderSongsModalSlice.ts';
import {RootState} from '../../store.tsx';
import {CustomAlert} from '../components/CustomAlert.tsx';

// This is the "Player Screen". This will only render the player at the bottom
// and songs listed from Firebase per User.
// No folder funcitonality

export const PlayerScreen = ({route}: CollectionStackScreenProps<'PlayerScreen'>) => {
  const dispatch = useDispatch();
  const {folderId, artistName, subFolderName} = route.params;
  const hasReorderedSongs = useSelector(
    (state: RootState) => state.reorderSongsModal.hasReorderedSongs,
  );

  useEffect(() => {
    dispatch(setFullRouteInfo({folderId, artistName, subFolderName}));
  }, [folderId, artistName, subFolderName, dispatch]);

  const songs = useFetchSongs(folderId);
  const {status} = useLoadingStatus();

  const handleSongOptionsPress = (song: any) => {
    dispatch(toggleSongOptionsModal());
    dispatch(
      setSelectedSong({
        id: song.id,
        storagePath: song.storagePath,
        folderId: folderId,
      }),
    );
  };

  const handlePlayerScreenMainOptionsPress = async () => {
    dispatch(openPlayerScreenMainOptionsModal());
  };

  const handleReorderPress = () => {
    dispatch(closePlayerScreenMainOptionsModal());
    dispatch(openReorderSongsModal());
  };

  return (
    <>
      <View style={styles.wholePage}>
        <SongUploadProgress />
        <View style={styles.namesAndSettingsButtonContainer}>
          <View>
            <Text style={styles.subFolderName}>{subFolderName}</Text>
            <Text style={styles.artistNameStyle}>{artistName}</Text>
          </View>
          <View>
            <TouchableOpacity
              hitSlop={isIOS ? null : {top: 20, bottom: 20, left: 20, right: 20}}
              //I'm not sure why but flexDirection:"row" is displacing hit detection
              //of pressables in this component on Android but not IOS. Expanded hitSlop fixes
              //  the issue for now but this needs to be sorted. I've already diagnosed that
              //  it's not a higher level styling issue. It's specifc to this Screen/Component.
              onPress={handlePlayerScreenMainOptionsPress}>
              <Entypo name="dots-three-vertical" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
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
            <View style={styles.songListContainer}>
              <SongList
                songs={songs}
                onSongOptionsPress={handleSongOptionsPress}
                subFolderName={subFolderName}
                artistName={artistName}
                showActionButton={true}
                showOptionsButton={true}
                mappedOptionsIcon={() => (
                  <Entypo name="dots-three-vertical" size={30} color={'white'} />
                )}
              />
            </View>
            <UploadSong folderId={folderId} />
            <PlayerScreenMainOptionsModal
              route={route.params}
              onReorderPress={handleReorderPress}
            />
            <CustomAlert message="Order saved!" triggerAlert={hasReorderedSongs} />
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

  namesAndSettingsButtonContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2F33',
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

  songListContainer: {
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
