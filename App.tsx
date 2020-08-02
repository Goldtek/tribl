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

export default codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  appendReleaseDescription: true
})(App);
