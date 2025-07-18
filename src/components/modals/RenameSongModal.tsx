import React from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput, Modal, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store.tsx';
import {closeRenameSongModal, setSongName} from '../../redux/renameSongSlice.ts';
import {auth, db} from '../../../firebaseConfig.ts';
import {doc, updateDoc} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const RenameSongModal = () => {
  const dispatch = useDispatch();
  const isVisible = useSelector((state: RootState) => state.renameSong.isRenameSongModalVisible);
  const newName = useSelector((state: RootState) => state.renameSong.songName);
  const selectedSong = useSelector((state: RootState) => state.selectedSong);
  const parentFolderId = useSelector((state: RootState) => state.routeParams.parentFolderId);
  const subFolderId = useSelector((state: RootState) => state.routeParams.subFolderId);

  const closeModal = () => {
    dispatch(closeRenameSongModal());
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !selectedSong?.id || !selectedSong?.parentFolderId) return;

    try {
      const songRef = doc(
        db,
        'users',
        `${user.displayName}: ${user.uid}`,
        'parentfolders',
        parentFolderId,
        'subfolders',
        subFolderId,
        'songs',
        selectedSong.id,
      );

      //Updates FireStore Database metadata
      await updateDoc(songRef, {
        songName_current: newName,
      });

      // Updates Firebase Storage metadata
      const storageRef = storage().ref(selectedSong.storagePath);
      const currentMetaData = await storageRef.getMetadata();
      const existingCustom = currentMetaData.customMetadata || {};

      await storageRef.updateMetadata({
        customMetadata: {
          ...existingCustom, // keep all previous metadata
          songName_current: newName,
          updatedAt: new Date().toISOString(),
          updatedBy: `${user.displayName}: ${user.uid}`,
        },
      });

      closeModal();
    } catch (error) {
      console.error('Failed to rename song:', error);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Rename Song</Text>

          <TextInput
            style={styles.input}
            placeholder="Song Name"
            placeholderTextColor="#ccc"
            value={newName}
            onChangeText={text => dispatch(setSongName(text))}
            cursorColor={'#ffffff'}
            selectionColor={'#ffffff'}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 10,
    gap: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  input: {
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#444',
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#666',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#0078D7',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
