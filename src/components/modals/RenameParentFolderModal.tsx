import React from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput, Modal, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store.tsx';
import {closeRenameParentFolderModal, setArtistName} from '../../redux/renameParentFolderSlice.ts';
import {auth, db} from '../../../firebaseConfig.tsx';
import {doc, updateDoc} from '@react-native-firebase/firestore';

// This is the parent folder Rename Folder Modal component.

export const RenameParentFolderModal = () => {
  const isVisible = useSelector(
    (state: RootState) => state.renameParentFolder.isRenameParentModalVisible,
  );
  const folderName = useSelector((state: RootState) => state.renameParentFolder.folderName);
  const artistName = useSelector((state: RootState) => state.renameParentFolder.artistName);
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(closeRenameParentFolderModal());
  };

  const folderId = useSelector((state: RootState) => state.renameParentFolder.folderID);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user || !folderId) return;

    try {
      const folderRef = doc(db, 'users', user.uid, 'folders', folderId);
      await updateDoc(folderRef, {
        name: folderName,
        artistName: artistName,
      });

      closeModal();
    } catch (error) {
      console.error('Failed to rename folder:', error);
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Rename Folder</Text>

          <TextInput
            style={styles.input}
            placeholder="Artist Name"
            placeholderTextColor="#ccc"
            value={artistName}
            onChangeText={text => dispatch(setArtistName(text))}
            cursorColor={'#ffffff'}
            selectionColor={'#ffffff'}
            // cursorColor is Android only
            // selectionColor is IOS only
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
