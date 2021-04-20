import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';

import App from './App';

LogBox.ignoreLogs([
  'ReactNative.NativeModules.LottieAnimationView',
  'VirtualizedLists should never be nested'
]);

// Register background handler
messaging().setBackgroundMessageHandler((message) => {
  if (message) {
    return AsyncStorage.setItem('BACK_GROUND_MESSAGE', JSON.stringify(message));
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
