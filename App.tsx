import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import codePush from 'react-native-code-push';
import { Platform } from 'react-native';
import AppRouter from './src';
import './src/internationalization';

Platform.select({ ios: enableScreens() });

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      await SplashScreen.preventAutoHideAsync();
      await loadResources();
      await SplashScreen.hideAsync();
      setIsAppReady(true);
    })();
  }, []);

  return isAppReady ? <AppRouter /> : null;
}

// Prompt the user when an update is available
// and then display a "downloading" modal
codePush.sync(
  {
    deploymentKey: '23b6df88-75df-4a81-be10-dbb5798089f3',
    updateDialog: { title: 'An update is available!' },
    installMode: codePush.InstallMode.ON_NEXT_RESUME
  },
  (status) => {
    switch (status) {
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        // Show "downloading" modal
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        // Hide "downloading" modal
        break;
    }
  },
  ({ receivedBytes, totalBytes }) => {
    /* Update download modal progress */
    console.log({ receivedBytes, totalBytes });
  }
);

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  appendReleaseDescription: true
})(App);
