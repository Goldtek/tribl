import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ApolloProvider from './graphql';
import ThemeProvider from './theme';
import Router from './router';

export default function AppRouter() {
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
