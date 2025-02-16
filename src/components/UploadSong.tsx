import React from 'react';
import {Alert, View, StyleSheet, TouchableOpacity} from 'react-native';
import {pick, types} from '@react-native-documents/picker';
import {requestStoragePermission} from '../utilities/requestStoragePermission';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch} from 'react-redux';
import {setUploadProgress} from '../redux/songProgressSlice';
// RNFS is a file system library for React Native that allows you to
// read, write, move, copy, and delete files on a device's local storage.

// This component is responsible for the uploading songs to Firebase based on the User/Folder.
// When this component is used for the first time, it will prompt the user for permissions.

export const UploadSong = () => {
  const dispatch = useDispatch();

  const handleChooseAudioFiles = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) return;

    try {
      const response = await pick({
        allowMultiSelection: true,
        type: [types.audio],
        mode: 'open', //Forces system file picker
      });

      for (const file of response) {
        await uploadFileToFirebase(file);
      }
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };

  const uploadFileToFirebase = async (file: any) => {
    try {
      const localFilePath = await copyToCacheDirectory(file.uri);

      if (!localFilePath) {
        console.log('File path conversion failed');
        return;
      }

      const fileName = file.name || `audio_${Date.now()}.mp3`;
      const storageRef = storage().ref(`songs/${fileName}`);
      // This storageRef will need to be dynamically created and maintained

      const task = storageRef.putFile(localFilePath);

      // Tracks Upload Progress and updates Redux state
      task.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        dispatch(setUploadProgress(progress)); // ✅ Store progress in Redux
      });

      await task;

      // ADD BACK IN FOR LOGS
      const downloadURL = await storageRef.getDownloadURL();
      console.log('File uploaded successfully:', downloadURL);

      // Alert.alert('Upload Success', `File uploaded! URL: ${downloadURL}`);

      dispatch(setUploadProgress(null));
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Upload Failed', 'Something went wrong while uploading.');
    }
  };

  // Function to copy `content://` file to app's cache directory
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
    <View style={styles.wholeContainer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleChooseAudioFiles}>
          <Entypo name="plus" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wholeContainer: {
    // backgroundColor: 'teal',
  },
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
    zIndex: 10,
  },
});
