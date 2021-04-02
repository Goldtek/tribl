import React, { useEffect } from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  EventSubscription
} from 'react-native';
//@ts-ignore
import RNUxcam from 'react-native-ux-cam';
import { enableScreens } from 'react-native-screens';
import './src/internationalization';
import { Mixpanel } from './src/config';
import { useNetInfo } from '@react-native-community/netinfo';
import { QueryClientProvider, QueryClient, onlineManager } from 'react-query';
import * as SplashScreen from 'expo-splash-screen';
import {
  persistQueryClient,
  createLocalStoragePersistor
} from './src/libs/rn-react-query-offline-persist';
import { RootToaster } from './src/components/rootToaster';
import { Host as PortalHost } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalErrorBoundary from './src/libs/error';
import ApolloProvider from './src/graphql';
import StreamProvider from './src/stream';
import ThemeProvider from './src/theme';
import Router from './src';

enableScreens();

export default function App() {
  let uxcamEvent: EventSubscription;
  const { isConnected } = useNetInfo();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { cacheTime: 1000 * 60 * 60 * 24 } }
  });

  const localStoragePersistor = createLocalStoragePersistor();

  persistQueryClient({
    queryClient,
    persistor: localStoragePersistor
  });

  //Setup listener
  function _uxcamSessionStartListener() {
    const emitter = new NativeEventEmitter(NativeModules.RNUxcam);
    uxcamEvent = emitter.addListener('UXCam_Verification_Event', async () => {
      const userURL = await RNUxcam.urlForCurrentUser();
      const sessionURL = await RNUxcam.urlForCurrentSession();
      if (sessionURL) {
        Mixpanel.track('UXCam: Session Recording link', sessionURL as any);
      }

      if (userURL) {
        Mixpanel.people_set({ uxcam_user_url: userURL });
      }
    });
  }

  useEffect(() => {
    onlineManager.setOnline(isConnected);
  }, [isConnected]);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    _uxcamSessionStartListener();
    return () => uxcamEvent.remove();
  }, []);

  return (
    <GlobalErrorBoundary>
      <ApolloProvider>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <StreamProvider>
              <ThemeProvider>
                <RootToaster />
                <PortalHost>
                  <Router />
                </PortalHost>
              </ThemeProvider>
            </StreamProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </ApolloProvider>
    </GlobalErrorBoundary>
  );
}
