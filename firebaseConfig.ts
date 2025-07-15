import {getApp, getApps, initializeApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import {getFirestore} from '@react-native-firebase/firestore';
import {getStorage} from '@react-native-firebase/storage';
import {FIREBASE_API_KEY} from './privatekeys';

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: 'resonate-36c63.firebaseapp.com',
  projectId: 'resonate-36c63',
  storageBucket: 'resonate-36c63.appspot.com',
  messagingSenderId: '674318448062',
  appId: '1:674318448062:android:a2945117ba406e8e8a35ef',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initializes Firebase Authentication
const auth = getAuth();

// Initializes Firebase Storage (for large files e.g. WAV., mp3)
const storageRef = getStorage();

// Initializes Firestore (database)
const db = getFirestore();

export {app, auth, db, storageRef};
