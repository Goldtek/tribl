import React, { useState, useLayoutEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import codePush from 'react-native-code-push';
import Storage from './src/storage';
import AppRouter from './src';
import './src/internationalization';

enableScreens();

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useLayoutEffect(() => {
    (async () => {
      await SplashScreen.preventAutoHideAsync();
      await loadResources();
      Storage.checkInitialLaunch();
      Storage.checkUserCredentials();
      await SplashScreen.hideAsync();
      setIsAppReady(true);
    })();
  }, []);

  return isAppReady ? <AppRouter /> : null;
}

export default codePush({
  deploymentKey: '23b6df88-75df-4a81-be10-dbb5798089f3',
  updateDialog: { title: 'An update is available!' },
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  appendReleaseDescription: true
})(App);
