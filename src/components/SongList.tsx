import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {PlayerState, setActiveTrack, setSubFolderInfo} from '../redux/playerSlice';
import DraggableFlatList, {RenderItemParams} from 'react-native-draggable-flatlist';

export const SongList = ({
  songs,
  setSongs,
  onSongOptionsPress,
  subFolderName,
  parentFolderName,
  showOptionsButton,
  showActionButton,
  showCustomButton,
  mappedCustomButton,
  mappedOptionsIcon,
  showBottomBorders,
  borderColor,
  wholeSongContainerStyle,
  mappedSongTimes,
}: SongListProps) => {
  const playbackState = usePlaybackState();
  const activeTrack = useSelector((state: {player: PlayerState}) => state.player.activeTrack);
  const dispatch = useDispatch();

  const getActionButton = (song: Song) => {
    const isActiveTrack = activeTrack?.id === song.id;

    if (!isActiveTrack) {
      return <MaterialIcons name="play-circle-outline" size={40} color="#fff" />;
    }

    switch (playbackState.state) {
      case State.Playing:
      case State.Loading:
      case State.Buffering:
        return <MaterialIcons name="pause-circle-outline" size={40} color="#fff" />;
      case State.Paused:
      case State.Ready:
      case State.Stopped:
      case State.Ended:
      case State.None:
        return <MaterialIcons name="play-circle-outline" size={40} color="#fff" />;
      case State.Error:
        return <Text>ERROR</Text>;
      default:
        return null;
    }
  };

  const handleSongAction = useCallback(
    async (song: Song) => {
      const index = songs.findIndex(s => s.id === song.id);
      if (index === -1) return;

      const currentQueue = await TrackPlayer.getQueue();
      const currentTrackId = await TrackPlayer.getActiveTrackIndex();

      const isSameQueue =
        currentQueue.length === songs.length &&
        currentQueue.every((track, i) => track.id === songs[i].id);

      if (!isSameQueue || currentTrackId == null) {
        await TrackPlayer.reset();
        await TrackPlayer.setQueue(songs);
      }

      await TrackPlayer.skip(index);
      await TrackPlayer.play();

      dispatch(setActiveTrack(song));
      dispatch(setSubFolderInfo({subFolderName, parentFolderName}));
    },
    [songs, dispatch, subFolderName, parentFolderName],
  );

  return (
    <DraggableFlatList
      data={songs}
      keyExtractor={item => item?.id}
      onDragEnd={({data}) => {
        setSongs?.(data);
      }}
      indicatorStyle="white"
      renderItem={({item, drag}: RenderItemParams<Song>) => (
        <View
          style={[
            styles.mappedSongsStyle,
            showBottomBorders && {borderBottomWidth: 2, borderColor: borderColor || '#2C2F33'},
          ]}>
          <View style={styles.iconSongAndTimeContainer}>
            {showCustomButton && mappedCustomButton?.(item, drag)}

            {/* Main Action Button */}
            {showActionButton && (
              <TouchableOpacity onPress={() => handleSongAction(item)}>
                {getActionButton(item)}
              </TouchableOpacity>
            )}
            {/* Song Container */}
            <View style={styles.songContainer}>
              <Text style={styles.songText} numberOfLines={1} ellipsizeMode="tail">
                {item?.name}
              </Text>
            </View>

            {/* Times And Options Container */}
            <View style={styles.timesAndOptionsContainer}>
              {/* Song Times */}
              <View>
                <Text style={styles.songTime}>{mappedSongTimes?.(item)}</Text>
              </View>

              {/* Song Options on the Right */}
              {showOptionsButton && (
                <TouchableOpacity onPress={() => onSongOptionsPress?.(item)}>
                  {mappedOptionsIcon?.(item)}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
      contentContainerStyle={wholeSongContainerStyle ?? styles.wholeSongContainer}
    />
  );
};

const styles = StyleSheet.create({
  wholeSongContainer: {
    gap: 35,
    paddingBottom: 180,
    paddingHorizontal: 20,
  },

  mappedSongsStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconSongAndTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  songContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },

  songText: {
    flexShrink: 1,
    color: 'white',
    fontSize: 15,
  },

  songTime: {
    color: 'white',
    fontSize: 15,
  },

  timesAndOptionsContainer: {
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export type Song = {
  id: string;
  name: string;
  url: string;
};

type SongListProps = {
  songs: Song[];
  setSongs?: (songs: Song[]) => void;
  onSongOptionsPress?: (song: Song) => void | null;
  subFolderName: string;
  parentFolderName: string;
  mappedSongTimes?: (song: Song) => string;
  showOptionsButton?: boolean;
  showActionButton?: boolean;
  showCustomButton?: boolean;
  mappedCustomButton?: (song: Song, drag?: () => void) => React.ReactNode;
  mappedOptionsIcon?: (song: Song) => React.ReactNode;
  showBottomBorders?: boolean;
  borderColor?: string;
  wholeSongContainerStyle?: object;
};
