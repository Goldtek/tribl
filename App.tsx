import React, { useState, useEffect, useLayoutEffect } from 'react';
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import Storage from './src/storage';
import AppRouter from './src';
import './src/internationalization';

enableScreens();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useLayoutEffect(() => {
    loadApp();
  }, []);

  useEffect(() => {
    checkAppUpdates();
  }, []);

  const loadApp = async () => {
    await loadResources();
    Storage.checkInitialLaunch();
    Storage.checkUserCredentials();
    setIsAppReady(true);
  };

  const checkAppUpdates = async () => {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      Alert.alert('UPDATE AVAILABLE', 'DOWNLOADING UPDATES NOW...');
      // ... notify user of update ...
      await Updates.reloadAsync();
    }
    // Prompt the user when an update is available
    // and then display a "downloading" modal
  };

  return isAppReady ? <AppRouter /> : null;
}
