// import * as firebase from 'firebase';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firebaseDatabase from '@react-native-firebase/database';
import firebaseFirestore from '@react-native-firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: 'tribl-staging',
  measurementId: 'G-TEDF6R5XCB',
  messagingSenderId: '971011241618',
  storageBucket: 'tribl-staging.appspot.com',
  authDomain: 'tribl-staging.firebaseapp.com',
  apiKey: 'AIzaSyBejHNRT6SCSgNFqWWpqsEyu5FlllXeBT0',
  appId: '1:971011241618:web:def6dc651e31a54ac4d84b',
  databaseURL: 'https://tribl-staging.firebaseio.com'
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const fireAuth = auth();
export const database = firebaseDatabase();
export const firechat = firebaseFirestore();
