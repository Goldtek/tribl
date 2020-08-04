import React, { useEffect } from 'react';
import * as Updates from 'expo-updates';
import codePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ApolloProvider from './graphql';
import ThemeProvider from './theme';
import Router from './router';

export default function AppRouter() {
  useEffect(() => {
    (async () => {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert('UPDATE AVAILABLE', 'DOWNLOADING UPDATES NOW...');
        // ... notify user of update ...
        await Updates.reloadAsync();
      }
      // Prompt the user when an update is available
      // and then display a "downloading" modal
    })();

    // codePush.sync(
    //   {
    //     deploymentKey: '23b6df88-75df-4a81-be10-dbb5798089f3',
    //     updateDialog: { title: 'An update is available!' },
    //     installMode: codePush.InstallMode.IMMEDIATE
    //   },
    //   (status) => {
    //     switch (status) {
    //       case codePush.SyncStatus.DOWNLOADING_PACKAGE:
    //         // Show "downloading" modal
    //         Alert.alert('DOWNLOADING_PACKAGE', JSON.stringify(status));

    //         break;
    //       case codePush.SyncStatus.INSTALLING_UPDATE:
    //         // Hide "downloading" modal
    //         Alert.alert('INSTALLING_UPDATE', JSON.stringify(status));
    //         break;
    //     }
    //   },
    //   ({ receivedBytes, totalBytes }) => {
    //     /* Update download modal progress */
    //     console.log({ receivedBytes, totalBytes });
    //   }
    // );
  }, []);

  return (
    <ApolloProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar translucent animated style="dark" />
          <Router />
        </ThemeProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
