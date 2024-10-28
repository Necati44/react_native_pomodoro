import * as Application from 'expo-application';

import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyCRGrpfJWJdYy4Z34zRFhaBDASIqc4Nn4w',
    authDomain: 'pomodoro-b88d5.firebaseapp.com',
    // databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'pomodoro-b88d5',
    // storageBucket: 'pomodoro-b88d5.appspot.com',
    messagingSenderId: '535627715101',
    appId: Application.applicationId,
    // measurementId: 'G-measurement-id',
  };

  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  // Initialize Firebase Authentication and get a reference to the service
  const provider = new GoogleAuthProvider();

  export { auth, provider };