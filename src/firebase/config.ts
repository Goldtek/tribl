// import * as firebase from 'firebase';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firebaseDatabase from '@react-native-firebase/database';
import firebaseFirestore from '@react-native-firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDs1Q37-tCo16NzK5MkZn3Jp7WtgK_P8dA',
  authDomain: 'tribl-2020.firebaseapp.com',
  databaseURL: 'https://tribl-2020.firebaseio.com',
  projectId: 'tribl-2020',
  storageBucket: 'tribl-2020.appspot.com',
  messagingSenderId: '354137256334',
  appId: '1:354137256334:web:d1ebf6584c1b42ff94b4df',
  measurementId: 'G-S6QECWH2QH'
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const fireAuth = auth();
export const database = firebaseDatabase();
export const firechat = firebaseFirestore();
