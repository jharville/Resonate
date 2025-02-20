import {getApp, getApps, initializeApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import {getFirestore} from '@react-native-firebase/firestore';
import {getStorage} from '@react-native-firebase/storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyCGs58mMfrod4S0orRNMP0azBaayc8tvN4',
  authDomain: 'resonate-36c63.firebaseapp.com',
  projectId: 'resonate-36c63',
  storageBucket: 'resonate-36c63.appspot.com',
  messagingSenderId: '674318448062',
  appId: '1:674318448062:android:a2945117ba406e8e8a35ef',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initializes Firebase Authentication
const auth = getAuth(app);

// Initializes Firebase Storage (for large files e.g. WAV., mp3)
const storageRef = getStorage(app);

// Initializes Firestore (database)
const db = getFirestore(app);

export {app, auth, db, storageRef};
