import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  View,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../../../firebaseConfig.tsx';
import firestore from '@react-native-firebase/firestore';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import {Song, SongList} from '../SongList.tsx';
import {useFetchSongs} from '../../Hooks/useFetchSongs.tsx';
import {RootState} from '../../../store.tsx';
import {closeReorderSongsModal, setHasReorderedSongs} from '../../redux/reorderSongsModalSlice.ts';
import {isIOS} from '../../utilities/constants.ts';

// This is the Reorder Songs Modal.
// It allows the user to Reorder the playlist and download the whole list.
// It allows the user to share the subFolder the songs are in
// (NOT to be confused with sharing the subfolder in the SubFolderScreen but it is the same functonality)

export const ReorderSongsModal = () => {
  const dispatch = useDispatch();
  const {parentFolderId, subFolderId, parentFolderName, subFolderName} = useSelector(
    (state: RootState) => state.routeParams,
  );
  const isVisible = useSelector(
    (state: RootState) => state.reorderSongsModal.isReorderSongsModalVisible,
  );
  const user = auth.currentUser;
  if (!user) return;
  const fetchedSongs = useFetchSongs({parentFolderId, subFolderId});
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (fetchedSongs && fetchedSongs.length > 0) {
      setSongs(fetchedSongs);
    }
  }, [fetchedSongs]);

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleSaveOrderPress = async () => {
    try {
      const songsRef = firestore()
        .collection('users')
        .doc(`${user.displayName}: ${user.uid}`)
        .collection('parentfolders')
        .doc(parentFolderId)
        .collection('subfolders')
        .doc(subFolderId)
        .collection('songs');

      const batch = firestore().batch();

      songs.forEach((song, index) => {
        const songRef = songsRef.doc(song.id);
        batch.update(songRef, {order: index});
      });

      await batch.commit();
      dispatch(setHasReorderedSongs(true));
      dispatch(closeReorderSongsModal());
    } catch (err) {
      console.error('Reordering failed', err);
      Alert.alert('Error', 'Could not reorder songs.');
    }
  };

  const handleExitPress = () => {
    dispatch(closeReorderSongsModal());
  };

  // To handle moving the songs in the DraggableFlatList in SongList
  const handleReorderSong = (song: Song, drag?: () => void) => {
    return (
      <TouchableOpacity onPressIn={drag}>
        <Octicons name="dot-fill" size={35} color="#666a6f" />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Animated.View style={[styles.menu, {transform: [{translateY: slideAnim}]}]}>
        <SafeAreaView style={{flex: 1}}>
          {/* Exit Button */}
          <TouchableOpacity style={styles.exitButtonContainer} onPress={handleExitPress}>
            <Feather name="x" size={34} color="white" />
          </TouchableOpacity>

          <View style={styles.titlesContainer}>
            {/* Reorder Playlist Text */}
            <Text style={styles.reorderText}>Reorder Playlist</Text>
            {/* SubFolder Name */}
            <Text style={styles.subFolderText}>{subFolderName}</Text>
          </View>

          {/* Songs from Firebase */}
          <View style={styles.songsContainer}>
            <SongList
              songs={songs}
              setSongs={setSongs}
              subFolderName={subFolderName}
              parentFolderName={parentFolderName}
              showOptionsButton={true}
              showBottomBorders={true}
              borderColor="#666a6f"
              showCustomButton={true}
              mappedCustomButton={handleReorderSong}
              wholeSongContainerStyle={styles.wholeSongContainerStyle}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleSaveOrderPress} style={styles.saveButtonStyle}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2e3133',
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
  },

  exitButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 10,
    paddingTop: isIOS ? 0 : 20,
  },

  titlesContainer: {
    paddingLeft: 35,
    paddingBottom: 20,
  },

  reorderText: {fontSize: 35, color: 'white', fontWeight: 500},

  subFolderText: {
    fontSize: 18,
    color: '#0078D7',
    fontWeight: 400,
  },

  wholeSongContainerStyle: {
    gap: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  songsContainer: {
    flex: 1,

    paddingHorizontal: 15,
  },

  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  pressableText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 500,
  },

  buttonContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },

  saveButtonStyle: {
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },

  saveText: {
    fontSize: 20,
    fontWeight: 700,
    color: 'white',
  },
});
