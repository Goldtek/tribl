import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import codePush from 'react-native-code-push';
import AppRouter from './src';
import './src/internationalization';

enableScreens();

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
  {},
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
  updateDialog: { title: 'An update is available!' },
  appendReleaseDescription: true,
  installMode: codePush.InstallMode.ON_NEXT_RESUME
})(App);
