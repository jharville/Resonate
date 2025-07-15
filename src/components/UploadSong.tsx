import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {pick, types} from '@react-native-documents/picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import RNFS from 'react-native-fs';
import {useDispatch} from 'react-redux';
import {setUploadProgress} from '../redux/songProgressSlice';
import {auth} from '../../firebaseConfig';
import Entypo from 'react-native-vector-icons/Entypo';
import {FFprobeKit, FFmpegKit, ReturnCode, FFmpegSession} from 'ffmpeg-kit-react-native';
import {AudioContext} from 'react-native-audio-api';
import {isIOS} from '../utilities/constants.ts';

export const UploadSong = ({
  parentFolderName,
  parentFolderId,
  subFolderName,
  subFolderId,
  onUploadSuccess,
  onUploadingFile,
}: UploadSongProps) => {
  const dispatch = useDispatch();
  const user = auth.currentUser;
  if (!user) return;

  const handleChooseAudioFiles = async () => {
    try {
      const response = await pick({
        allowMultiSelection: true,
        type: [types.audio],
        mode: 'import',
      });

      const user = auth.currentUser;
      const userName = user?.displayName;
      if (!user || !userName) {
        console.error('User not found');
        return;
      }

      for (const file of response) {
        await uploadFileToFirebase(
          user.uid,
          userName,
          parentFolderName,
          parentFolderId,
          subFolderName,
          subFolderId,
          file,
        );
        console.log('file.uri:', file.uri);
      }
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };

  const uploadFileToFirebase = async (
    userId: string,
    displayName: string,
    parentFolderName: string,
    parentFolderId: string,
    subFolderName: string,
    subFolderId: string,
    file: any,
  ) => {
    dispatch(setUploadProgress(0));

    try {
      const localFilePath = await copyToCacheDirectory(file.fileCopyUri || file.uri);

      if (!localFilePath) {
        console.log('File path conversion failed');
        return;
      }

      const fileExtension = file.name?.split('.').pop() || 'mp3';
      const baseName = file.name?.replace(/\.[^/.]+$/, '') || 'audio';
      const timestamp = Date.now();
      const fileName = `${baseName}_${timestamp}.${fileExtension}`;

      const storagePath = `uploadedSongs/users/${displayName}: ${userId}/parentfolders/${parentFolderName}: ${parentFolderId}/subfolders/${subFolderName}: ${subFolderId}/song name: ${fileName}`;
      const storageRef = storage().ref(storagePath);
      onUploadingFile?.();
      // This is to show the progress bar when a song is being uploaded
      const metadata = await extractAudioMetadata(localFilePath);
      const waveform = await generateWaveformArray(localFilePath);

      //Stores metadata in Firebase Storage
      const task = storageRef.putFile(localFilePath, {
        customMetadata: {
          songName_current: fileName,
          songName_original: fileName,
          uploadedBy: `${displayName}: ${userId}`,
          parentFolder: parentFolderName,
          subFolder: subFolderName,
          uploadedAt: new Date().toISOString(),
          sampleRate: metadata?.sampleRate
            ? (Number(metadata.sampleRate) / 1000).toFixed(1)
            : 'N/A',
          bitRate: metadata?.bitRate
            ? Math.round(Number(metadata.bitRate) / 1000).toString()
            : 'N/A',
          bitDepth: metadata?.bitDepth ? metadata.bitDepth.toString() : 'N/A',
          channelCount: metadata?.channelCount ? metadata.channelCount.toString() : 'N/A',
          duration: metadata?.duration ? metadata.duration.toString() : 'N/A',
          loudnessLufs: metadata?.loudnessLufs ? metadata.loudnessLufs.toFixed(1) : 'N/A',
          fileType: metadata?.fileType ? metadata.fileType.toString() : 'N/A',
          waveform: waveform ? JSON.stringify(waveform) : 'N/A',
        },
      });

      task.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        dispatch(setUploadProgress(progress));
      });

      await task;

      dispatch(setUploadProgress(null));

      const downloadURL = await storageRef.getDownloadURL();
      console.log('File uploaded successfully:', downloadURL);

      // Store the file metadata in Firestore Database, NOT the same as Storage
      await firestore()
        .collection('users')
        .doc(`${user.displayName}: ${user.uid}`)
        .collection('parentfolders')
        .doc(parentFolderId)
        .collection('subfolders')
        .doc(subFolderId)
        .collection('songs')
        .add({
          songName_current: fileName,
          songName_original: fileName,
          url: downloadURL,
          storagePath: storagePath,
          createdAt: firestore.FieldValue.serverTimestamp(),
          order: Date.now(),
        });
    } catch (error) {
      console.error('Upload failed for file:', file, error);
      Alert.alert('Upload Failed', 'Something went wrong while uploading.');
    }
  };

  // Function to generate waveform array from audio file
  const generateWaveformArray = async (filePath: string): Promise<number[] | null> => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await RNFS.readFile(filePath, 'base64');
      const binaryData = Uint8Array.from(atob(arrayBuffer), c => c.charCodeAt(0)).buffer;
      const audioBuffer = await audioContext.decodeAudioData(binaryData);

      const rawData = audioBuffer.getChannelData(0);
      const samplesPerBar = Math.floor(rawData.length / 512);
      const waveform: number[] = [];

      for (let i = 0; i < 512; i++) {
        const start = i * samplesPerBar;
        let sum = 0;
        for (let j = 0; j < samplesPerBar; j++) {
          sum += Math.abs(rawData[start + j]);
        }
        const avg = sum / samplesPerBar;
        waveform.push(avg * 100);
      }

      return waveform;
    } catch (error) {
      console.error('Error generating waveform:', error);
      return null;
    }
  };

  // Function to extract audio metadata using FFmpegKit
  const extractAudioMetadata = async (filePath: string) => {
    try {
      const session = await FFprobeKit.getMediaInformation(filePath);
      const mediaInfo = session.getMediaInformation();
      const streams = mediaInfo.getStreams();
      const audioStream = streams.find(stream => stream.getType() === 'audio');
      const props = audioStream?.getAllProperties();
      const bitDepth = props?.bits_per_sample;
      const loudnessSession: FFmpegSession = await FFmpegKit.execute(
        `-hide_banner -i "${filePath}" -filter_complex ebur128=peak=true:framelog=verbose -f null -`,
      );
      const returnCode = await loudnessSession.getReturnCode();
      if (!ReturnCode.isSuccess(returnCode)) {
        console.error('FFmpegKit failed, returnCode=' + returnCode);
        return null;
      }

      const logsText = await loudnessSession.getLogsAsString();

      let integratedLufs: number | null = null;
      const matches = [...logsText.matchAll(/I:\s*(-?\d+(\.\d+)?)\s*LUFS/g)];
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        integratedLufs = parseFloat(lastMatch[1]);
      }

      return {
        sampleRate: audioStream?.getSampleRate() || null,
        channelCount: audioStream?.getChannelLayout() || null,
        bitRate: audioStream?.getBitrate() || null,
        bitDepth: bitDepth || null,
        duration: mediaInfo?.getDuration() || 'null',
        fileType: mediaInfo.getFormat() || null,
        loudnessLufs: integratedLufs,
      };
    } catch (error) {
      console.error('Error extracting metadata:', error);
      return null;
    }
  };

  const copyToCacheDirectory = async (fileUri: string): Promise<string | null> => {
    try {
      let sourcePath = fileUri;

      if (isIOS) {
        // On iOS, decode the URI and remove 'file://' or else pathing will fail
        const decodedUri = decodeURIComponent(fileUri.replace('file://', ''));
        sourcePath = '/' + decodedUri;
      }

      const destPath = `${RNFS.TemporaryDirectoryPath}/${Date.now()}_audio.wav`;

      await RNFS.copyFile(sourcePath, destPath);
      return destPath;
    } catch (error) {
      console.error('Failed to copy file:', error);
      return null;
    }
  };

  // This is to update the Queue when a song is uploaded. Otherwise,
  // the newly uploaded song won't show up in the AudioPlayerModal Queue
  onUploadSuccess?.();

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

type UploadSongProps = {
  parentFolderName: string;
  parentFolderId: string;
  subFolderName: string;
  subFolderId: string;
  onUploadingFile?: () => void; // For showing the progress bar when a file is being uploaded
  onUploadSuccess?: () => void; //For updating the queue in TrackPlayer upon song upload
};
