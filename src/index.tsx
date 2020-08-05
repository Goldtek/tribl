import React, { useEffect } from 'react';
import * as Updates from 'expo-updates';
import { RootToaster } from './components/rootToaster';
import { Host } from 'react-native-portalize';
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
  }, []);

  return (
    <ApolloProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar translucent animated style="dark" />
          <RootToaster />
          <Host>
            <Router />
          </Host>
        </ThemeProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
