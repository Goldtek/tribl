import React from 'react';
import { RootToaster } from './components/rootToaster';
import { Host as PortalHost } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalErrorBoundary from './libs/error';
import { StatusBar } from 'expo-status-bar';
import ApolloProvider from './graphql';
import StreamProvider from './stream';
import ThemeProvider from './theme';
import Router from './router';

export default function AppRouter() {
  return (
    <GlobalErrorBoundary>
      <ApolloProvider>
        <SafeAreaProvider>
          <StreamProvider>
            <ThemeProvider>
              <StatusBar translucent animated style="dark" />
              <RootToaster />
              <PortalHost>
                <Router />
              </PortalHost>
            </ThemeProvider>
          </StreamProvider>
        </SafeAreaProvider>
      </ApolloProvider>
    </GlobalErrorBoundary>
  );
}
