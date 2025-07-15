import React, {useRef, useEffect, useState} from 'react';
import {Text, TouchableOpacity, Animated, StyleSheet, Dimensions, View, Modal} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store.tsx';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {auth} from '../../../firebaseConfig.ts';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {pickImage} from '../../utilities/imagePicker.ts';
import {openRenameParentFolderModal} from '../../redux/renameParentFolderSlice.ts';
import {closeParentFolderOptionsModal} from '../../redux/parentFolderOptionsModalSlice.ts';

export const ParentFolderOptionsModal = () => {
  const user = auth.currentUser;
  const [isTrashModalVisible, setTrashModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const dispatch = useDispatch();
  const parentFolderId = useSelector((state: RootState) => state.renameParentFolder.parentFolderID);
  const isVisible = useSelector(
    (state: RootState) => state.ParentFolderOptionsModal.isParentFolderOptionsModalVisible,
  );

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
    dispatch(openRenameParentFolderModal());
    dispatch(closeParentFolderOptionsModal());
  };

  const handleTrashPress = () => {
    setTrashModalVisible(true);
  };

  const handleYesDeletePress = async () => {
    try {
      if (!user || !parentFolderId) return;

      const parentFolderRef = firestore()
        .collection('users')
        .doc(`${user.displayName}: ${user.uid}`)
        .collection('parentfolders')
        .doc(parentFolderId);

      // Gets all subfolders inside the parent folder
      const subfoldersList = await parentFolderRef.collection('subfolders').get();
      // Loops through each subfolder
      for (const subfolderDoc of subfoldersList.docs) {
        const batch = firestore().batch();
        // Gets all songs within the current subfolder
        const songsSnapshot = await subfolderDoc.ref.collection('songs').get();
        // Array to hold async delete promises for Firebase Storage files
        const deleteStoragePromises: Promise<void>[] = [];
        // Loops through each song in the subfolder
        for (const songDoc of songsSnapshot.docs) {
          // Gets the storage path from the song's metadata
          const {storagePath} = songDoc.data();
          if (storagePath) {
            deleteStoragePromises.push(storage().ref(storagePath).delete());
          }
          // Adds the Firestore delete operation to the batch
          batch.delete(songDoc.ref);
        }

        // Deletes all song files from Firebase Storage. Then, deletes their Firestore records.
        // Then deletes subfolder they were in.
        await Promise.all(deleteStoragePromises);
        await batch.commit();
        await subfolderDoc.ref.delete();
      }

      await parentFolderRef.delete();
      setTrashModalVisible(false);
      dispatch(closeParentFolderOptionsModal());
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const parentFolderName = useSelector(
    (state: RootState) => state.renameParentFolder.parentFolderName,
  );
  const handleImagePress = () => {
    dispatch(closeParentFolderOptionsModal());
    pickImage(parentFolderName, parentFolderId);
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => dispatch(closeParentFolderOptionsModal())}
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

          {/* ArtWork */}
          <TouchableOpacity style={styles.menuItem} onPress={handleImagePress}>
            <FontAwesome name="picture-o" size={21} color="#fff" />
            <Text style={styles.menuText}>Artwork</Text>
          </TouchableOpacity>

          {/* Move File */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => dispatch(closeParentFolderOptionsModal())}>
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
    height: '35%',
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
