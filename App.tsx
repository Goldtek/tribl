import React, { useState, useEffect } from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  EventSubscription
} from 'react-native';
//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import database from '@react-native-firebase/database';
import { enableScreens } from 'react-native-screens';
import firestore from '@react-native-firebase/firestore';
import loadResources from './src/libs/loadResources';
import './src/internationalization';
import AppRouter from './src';
import { Mixpanel } from './src/config';
import { fireAuth } from './src/firebase/config';

enableScreens();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  useEffect(() => {
    loadApp();
  }, []);

  let uxcamEvent: EventSubscription;
  useEffect(() => {
    _uxcamSessionStartListener();
    return () => uxcamEvent.remove();
  }, []);

  //Setup listener
  function _uxcamSessionStartListener() {
    const emitter = new NativeEventEmitter(NativeModules.RNUxcam);
    uxcamEvent = emitter.addListener('UXCam_Verification_Event', async () => {
      const userURL = await RNUxcam.urlForCurrentUser();
      const sessionURL = await RNUxcam.urlForCurrentSession();
      if (sessionURL) {
        Mixpanel.track('UXCam: Session Recording link', sessionURL);
      }

      if (userURL) {
        Mixpanel.people_set({ uxcam_user_url: userURL });
      }
    });
  }

  useEffect(() => {
    // Assuming user is logged in
    const userId = fireAuth.currentUser?.uid;

    const reference = database().ref(`/presence/${userId}`);

    // Set the /users/:userId value to true
    reference.set({ lastSeen: Date.now(), status: 'ONLINE' });

    // Remove the node whenever the client disconnects
    return () => {
      reference
        .onDisconnect()
        .update({ lastSeen: Date.now(), status: 'OFFLINE' });
    };
  }, []);

  const loadApp = async () => {
    await loadResources();
    setIsAppReady(true);
  };

  return isAppReady ? <AppRouter /> : null;
}
