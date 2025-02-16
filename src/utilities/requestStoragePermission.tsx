import {PermissionsAndroid, Platform} from 'react-native';

export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        // Android 13+ requires READ_MEDIA_AUDIO for audio access
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Audio file access permission denied');
          return false;
        }
      } else {
        // Older versions require READ_EXTERNAL_STORAGE and WRITE_EXTERNAL_STORAGE
        const storageGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        const writeGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (
          storageGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          writeGranted !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Storage permission denied');
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn('Error requesting permission:', err);
      return false;
    }
  }
  return true; // iOS does not require this permission
};
