import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';

import App from './App';

LogBox.ignoreLogs([
  'ReactNative.NativeModules.LottieAnimationView',
  'VirtualizedLists should never be nested'
]);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
