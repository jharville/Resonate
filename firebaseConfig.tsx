// import { addDoc } from '@react-native-firebase/firestore';
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore, collection, getDocs, addDoc, initializeFirestore} from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyCGs58mMfrod4S0orRNMP0azBaayc8tvN4',
  authDomain: 'resonate-36c63.firebaseapp.com',
  projectId: 'resonate-36c63',
  storageBucket: 'resonate-36c63.appspot.com',
  messagingSenderId: '674318448062',
  appId: '1:674318448062:android:a2945117ba406e8e8a35ef',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export {db, auth};
