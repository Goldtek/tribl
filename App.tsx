import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { enableScreens } from 'react-native-screens';
import loadResources from './src/libs/loadResources';
import AppRouter from './src';
import './src/internationalization';

enableScreens();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      await SplashScreen.preventAutoHideAsync();
      await loadResources();
      SplashScreen.hideAsync();
      setIsAppReady(true);
    })();
  }, []);

  return isAppReady ? <AppRouter /> : null;
}
