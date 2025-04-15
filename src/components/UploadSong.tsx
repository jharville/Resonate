import React from 'react';
import {Alert, View, StyleSheet, TouchableOpacity} from 'react-native';
import {pick, types} from '@react-native-documents/picker';
import {requestStoragePermission} from '../utilities/requestStoragePermission';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch} from 'react-redux';
import {setUploadProgress} from '../redux/songProgressSlice';
import {auth} from '../../firebaseConfig';

// This component uploads songs to Firebase Storage and Firestore under the correct user and folder.

export const UploadSong = ({folderId}: {folderId: string}) => {
  const dispatch = useDispatch();

  const handleChooseAudioFiles = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    try {
      const response = await pick({
        allowMultiSelection: true,
        type: [types.audio],
        mode: 'open',
      });

      const user = auth.currentUser;
      if (!user) {
        console.error('User not found');
        return;
      }

      for (const file of response) {
        await uploadFileToFirebase(file, folderId, user.uid);
      }
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };

  const uploadFileToFirebase = async (file: any, folderId: string, userId: string) => {
    try {
      const localFilePath = await copyToCacheDirectory(file.uri);
      if (!localFilePath) {
        console.log('File path conversion failed');
        return;
      }

      const fileName = file.name || `audio_${Date.now()}.mp3`;
      const storagePath = `users/${userId}/folders/${folderId}/songs/${fileName}`;
      const storageRef = storage().ref(storagePath);

      const task = storageRef.putFile(localFilePath);

      // Tracks upload progress
      task.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        dispatch(setUploadProgress(progress));
      });

      await task;

      // Gets the song URL
      const downloadURL = await storageRef.getDownloadURL();
      console.log('File uploaded successfully:', downloadURL);

      // Stores metadata in Firestore
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('folders')
        .doc(folderId)
        .collection('songs')
        .add({
          name: fileName,
          url: downloadURL,
          storagePath: `users/${userId}/folders/${folderId}/songs/${fileName}`, //Added this line
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`Song metadata saved to Firestore: ${fileName}`);

      dispatch(setUploadProgress(null));
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Failed', 'Something went wrong while uploading.');
    }
  };

  // copies `content://` file to app's cache directory
  const copyToCacheDirectory = async (fileUri: string): Promise<string | null> => {
    try {
      const destPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}_audio.mp3`;
      await RNFS.copyFile(fileUri, destPath);
      return destPath;
    } catch (error) {
      console.error('Failed to copy file:', error);
      return null;
    }
  };

  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={handleChooseAudioFiles}>
        <Entypo name="plus" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0078D7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
