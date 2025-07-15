import React, {useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {useFetchSongs} from '../Hooks/useFetchSongs.tsx';
import {SongList} from '../components/SongList.tsx';
import {useDispatch, useSelector} from 'react-redux';
import {UploadSong} from '../components/UploadSong.tsx';
import {SongUploadProgress} from '../components/SongUploadProgress.tsx';
import {CollectionStackScreenProps} from '../navigation/types/navigation.types.ts';
import {toggleSongOptionsModal} from '../redux/songOptionsModalSlice.ts';
import {setSelectedSong} from '../redux/selectedSongSlice.ts';
import Entypo from 'react-native-vector-icons/Entypo';
import {isIOS} from '../utilities/constants.ts';
import {
  closePlayerScreenMainOptionsModal,
  openPlayerScreenMainOptionsModal,
} from '../redux/playerScreenMainOptionsModalSlice.ts';
import {PlayerScreenMainOptionsModal} from '../components/modals/PlayerScreenMainOptionsModal.tsx';
import {setFullRouteInfo} from '../redux/routeParamsSlice.ts';
import {openReorderSongsModal} from '../redux/reorderSongsModalSlice.ts';
import {RootState} from '../../store.tsx';
import {CustomAlert} from '../components/CustomAlert.tsx';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useFormatTime} from '../Hooks/useFormatTime.ts';
import TrackPlayer from 'react-native-track-player';
import {setUploadProgress} from '../redux/songProgressSlice.tsx';

// This is the "Player Screen". This will only render the player at the bottom
// and songs listed from Firebase per User.
// No folder funcitonality

export const PlayerScreen = ({route}: CollectionStackScreenProps<'PlayerScreen'>) => {
  const dispatch = useDispatch();
  const {parentFolderName, parentFolderId, subFolderId, subFolderName} = route.params;
  const hasReorderedSongs = useSelector(
    (state: RootState) => state.reorderSongsModal.hasReorderedSongs,
  );

  // Setting the route params here in Redux for use elsewhere
  useEffect(() => {
    dispatch(setFullRouteInfo({parentFolderId, parentFolderName, subFolderId, subFolderName}));
  }, [parentFolderId, parentFolderName, subFolderId, subFolderName, dispatch]);

  // Fetches the songs from firebase using the route params and we use that in SongList in the JSX
  const songs = useFetchSongs({parentFolderId, subFolderId});

  const handleSongOptionsPress = (song: any) => {
    dispatch(toggleSongOptionsModal());
    dispatch(
      setSelectedSong({
        id: song.id,
        storagePath: song.storagePath,
        parentFolderId: parentFolderId,
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

  //Song Times from the metaData set in Redux
  const metaDataMap = useSelector((state: RootState) => state.player.metaData);
  const mappedSongTimes = (song: any) => useFormatTime(metaDataMap[song.name]?.duration ?? 0);

  return (
    <>
      <View style={styles.wholePage}>
        <SongUploadProgress />
        <View style={styles.namesAndSettingsButtonContainer}>
          <View>
            {/* Placeholders for subFolder and parentFolder Name */}
            {songs === null ? (
              <SkeletonPlaceholder
                borderRadius={4}
                backgroundColor="rgba(123, 123, 125, 0.5)"
                highlightColor="rgba(255, 255, 255, 1)">
                <View style={{gap: 10}}>
                  <SkeletonPlaceholder.Item
                    style={{
                      marginLeft: 10,
                      marginTop: 4,
                    }}
                    width={100}
                    height={18}
                  />
                  <SkeletonPlaceholder.Item
                    style={{
                      marginLeft: 10,
                      marginBottom: 4,
                    }}
                    width={90}
                    height={13}
                  />
                </View>
              </SkeletonPlaceholder>
            ) : (
              <>
                <Text style={styles.subFolderName}>{subFolderName}</Text>
                <Text style={styles.parentFolderNameStyle}>{parentFolderName}</Text>
              </>
            )}
          </View>
          <View>
            <TouchableOpacity
              hitSlop={isIOS ? null : {top: 20, bottom: 20, left: 20, right: 20}}
              // I'm not sure why but flexDirection:"row" is displacing hit detection
              // of pressables in this component on Android but not IOS. Expanded hitSlop fixes
              // the issue for now but this needs to be sorted. I've already diagnosed that
              // it's not a higher level styling issue. It's specifc to this Screen/Component.
              onPress={handlePlayerScreenMainOptionsPress}>
              <Entypo name="dots-three-vertical" size={30} color={'white'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Song PlaceHolders */}
        {songs === null ? (
          <SkeletonPlaceholder
            borderRadius={4}
            backgroundColor="rgba(123, 123, 125, 0.5)"
            highlightColor="rgba(255, 255, 255, 1)">
            <View>
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingTop: 30,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <SkeletonPlaceholder.Item
                  style={{
                    marginLeft: 10,
                  }}
                  width={100}
                  height={26}
                />
                <SkeletonPlaceholder.Item
                  style={{
                    marginLeft: 10,
                  }}
                  width={20}
                  height={26}
                />
              </View>
            </View>
          </SkeletonPlaceholder>
        ) : songs?.length === 0 ? (
          <>
            <View style={styles.noSongsContainer}>
              <Text style={styles.addASongText}>Upload A Song!</Text>
            </View>
            <UploadSong
              parentFolderName={parentFolderName}
              parentFolderId={parentFolderId}
              subFolderName={subFolderName}
              subFolderId={subFolderId}
            />
          </>
        ) : (
          <>
            <View style={styles.songListContainer}>
              <SongList
                songs={songs}
                onSongOptionsPress={handleSongOptionsPress}
                subFolderName={subFolderName}
                parentFolderName={parentFolderName}
                mappedSongTimes={mappedSongTimes}
                showActionButton={true}
                showOptionsButton={true}
                mappedOptionsIcon={() => (
                  <Entypo name="dots-three-vertical" size={30} color={'white'} />
                )}
              />
            </View>
            <UploadSong
              parentFolderName={parentFolderName}
              parentFolderId={parentFolderId}
              subFolderName={subFolderName}
              subFolderId={subFolderId}
              onUploadSuccess={async () => {
                await TrackPlayer.setQueue(songs);
              }}
            />
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

  parentFolderNameStyle: {
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
