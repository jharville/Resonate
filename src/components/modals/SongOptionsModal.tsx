import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  View,
  Modal,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {auth} from '../../../firebaseConfig.tsx';
import {closeSongOptionsModal} from '../../redux/songOptionsModalSlice.ts';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {clearSelectedSong} from '../../redux/selectedSongSlice.ts';
import {openRenameSongModal} from '../../redux/renameSongSlice.ts';

// This is the SONG Options Modal.
// It allows the user to rename, move, or delete a Song

export const SongOptionsModal = () => {
  const [isTrashModalVisible, setTrashModalVisible] = useState(false);

  const dispatch = useDispatch();
  const isVisible = useSelector(
    (state: RootState) => state.songOptionsModal.isSongOptionsModalVisible,
  );

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

  const handleRenamePress = () => {
    dispatch(openRenameSongModal());
    dispatch(closeSongOptionsModal());
  };

  const handleTrashPress = () => {
    setTrashModalVisible(true);
  };

  const selectedSong = useSelector((state: RootState) => state.selectedSong);
  const user = auth.currentUser;
  const handleYesDeletePress = async () => {
    try {
      if (!user || !selectedSong) throw new Error('Missing user or song');

      // 1. Delete file from Firebase Storage
      await storage().ref(selectedSong.storagePath).delete();

      // 2. Delete Firestore document
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('folders')
        .doc(selectedSong.folderId)
        .collection('songs')
        .doc(selectedSong.id)

        .delete();

      dispatch(clearSelectedSong());
      setTrashModalVisible(false);
      dispatch(closeSongOptionsModal());
    } catch (error) {
      console.error('Failed to delete song:', error);
      Alert.alert('Delete Failed', 'Could not delete the song.');
    }
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => dispatch(closeSongOptionsModal())}
          style={styles.backdrop}
        />
      )}
      <Animated.View style={[styles.menu, {transform: [{translateY: slideAnim}]}]}>
        <View style={styles.itemsContainer}>
          {/* Rename */}
          <TouchableOpacity style={styles.menuItem} onPress={handleRenamePress}>
            <View style={styles.renameIconContainerStyle}>
              <MaterialIcons name="drive-file-rename-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.menuText}>Rename</Text>
          </TouchableOpacity>

          {/* Move File */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => dispatch(closeSongOptionsModal())}>
            <View style={styles.fileMoveContainerStyle}>
              <MaterialCommunityIcons name="file-move-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.menuText}>Move To (Not Yet Available)</Text>
          </TouchableOpacity>

          {/* Trash */}
          <TouchableOpacity style={styles.menuItem} onPress={handleTrashPress}>
            <FontAwesome5 name="trash-alt" size={24} color="#fff" />
            <Text style={styles.menuText}>Move To Trash</Text>
          </TouchableOpacity>

          {/* Trash Modal */}
          {isTrashModalVisible && (
            <Modal transparent animationType="slide" visible={isTrashModalVisible}>
              <View style={styles.trashModalStyle}>
                <Text style={styles.areYouSureTextStyle}>
                  Are you sure you want to delete this folder? This action cannot be undone.
                </Text>
                {/* Yes Button */}
                <TouchableOpacity
                  onPress={() => {
                    handleYesDeletePress();
                  }}>
                  <Text style={styles.yesButtonTextStyle}>Yes</Text>
                </TouchableOpacity>
                {/* Cancel Button */}
                <TouchableOpacity onPress={() => setTrashModalVisible(false)}>
                  <Text style={styles.cancelButtonTextStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  menu: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '28%',
    backgroundColor: '#2e3133',
    paddingHorizontal: 40,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  itemsContainer: {
    gap: 35,
  },

  menuItem: {flexDirection: 'row', gap: 10, alignItems: 'center'},

  menuText: {color: 'white', fontSize: 18},

  renameIconContainerStyle: {
    marginRight: -3,
  },

  fileMoveContainerStyle: {marginLeft: -4, marginRight: -3},

  closeButtonContainer: {
    paddingHorizontal: 60,
  },

  closeButton: {
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
  },

  closeText: {color: 'white', fontSize: 18, fontWeight: 500},

  trashModalStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35%',
    backgroundColor: '#2e3133',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    textAlign: 'center',
    gap: 20,
  },

  areYouSureTextStyle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },

  yesButtonTextStyle: {
    backgroundColor: '#0078D7',
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 20,
    fontWeight: '500',
    width: 120,
    alignSelf: 'center',
  },

  cancelButtonTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
  },
});
