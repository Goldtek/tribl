// import * as firebase from 'firebase';
import firebase from '@react-native-firebase/app';
import rnCrashlytics from '@react-native-firebase/crashlytics';
import ENVIRONMENT_VARIABLES from '../config';

// Your web app's Firebase configuration
const firebaseConfig = {
  appId: ENVIRONMENT_VARIABLES.FIREBASE_APP_ID,
  apiKey: ENVIRONMENT_VARIABLES.FIREBASE_API_KEY,
  projectId: ENVIRONMENT_VARIABLES.FIREBASE_PROJECT_ID,
  authDomain: ENVIRONMENT_VARIABLES.FIREBASE_AUTH_DOMAIN,
  databaseURL: ENVIRONMENT_VARIABLES.FIREBASE_DATA_BASEURL,
  measurementId: ENVIRONMENT_VARIABLES.FIREBASE_MEASUREMENT_ID,
  storageBucket: ENVIRONMENT_VARIABLES.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENVIRONMENT_VARIABLES.FIREBASE_MESSAGING_SENDER_ID
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const crashlytics = rnCrashlytics();
