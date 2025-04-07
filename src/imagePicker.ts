import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {doc, updateDoc} from '@react-native-firebase/firestore';
import {auth, db} from '../firebaseConfig.tsx';
import RNFS from 'react-native-fs';

// Uploads the selected image to Firebase Storage and updates the Firestore doc with the imageURL
const uploadImageToFirebase = async (
  uri: string, // Path to the image on the device
  parentFolderId?: string, // ID of the parent folder (required for both parent and subfolder)
  subFolderId?: string, // ID of the subfolder (optional — only used if targeting a subfolder)
) => {
  // Using a consistent filename based on folder ID to prevent duplicate uploads to firebase
  const filename = subFolderId ? `${subFolderId}.jpg` : `${parentFolderId}.jpg`;

  // Creates a reference in Firebase Storage under "folderImages" using that filename
  const reference = storage().ref(`folderImages/${filename}`);

  // Gets the current signed-in user
  const user = auth.currentUser;
  if (!user) return;

  let folderReference;

  // If both parent and subfolder IDs are provided, it updates the subfolder document
  if (subFolderId && parentFolderId) {
    folderReference = doc(
      db,
      'users',
      user.uid,
      'folders',
      parentFolderId,
      'subfolders',
      subFolderId,
    );
  }
  // If only parent folder ID is provided, it updates the parent folder document
  else if (parentFolderId) {
    folderReference = doc(db, 'users', user.uid, 'folders', parentFolderId);
  } else {
    console.warn('Missing folder path');
    return;
  }

  // Uploads image to Firebase Storage
  await reference.putFile(uri);
  const downloadURL = await reference.getDownloadURL();

  await updateDoc(folderReference, {imageURL: downloadURL});
};

export const pickImage = async (parentFolderId?: string, subFolderId?: string) => {
  try {
    const image = await ImagePicker.openPicker({
      width: 331.4,
      height: 169.9,
      cropping: true,
      mediaType: 'photo',
      compressImageQuality: 0.5,
      cropperToolbarTitle: 'Adjust Folder Image',
      freeStyleCropEnabled: false,
      cropperCircleOverlay: false,
      cropperToolbarColor: '#000000',
      cropperToolbarWidgetColor: '#0078D7',
      cropperCancelColor: '#0078D7',
      cropperChooseColor: '#0078D7',
      cropperChooseText: 'Apply',
    });

    if (image.path) {
      // Gets file metadata (size) from the image
      const fileStats = await RNFS.stat(image.path);

      // Converts the size from bytes to kilobytes
      const fileSizeInKB = Number(fileStats.size) / 1024;
      console.log('Image Size:', fileSizeInKB, 'KB');

      // Display image size too large warning

      // If image size is greater than 100 KB, log a warning and stop the upload
      if (fileSizeInKB > 100) {
        console.warn('Image too large:', fileSizeInKB.toFixed(2), 'KB');
        // Optionally: prompt the user to crop again or reduce quality
        return;
      }

      // If the image is under the limit, proceed to upload it to Firebase
      await uploadImageToFirebase(image.path, parentFolderId, subFolderId);
    }
  } catch (err: any) {
    if (err.code !== 'E_PICKER_CANCELLED') {
      console.log('Image Picker Error:', err);
    }
  }
};
