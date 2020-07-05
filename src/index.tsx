import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApolloProvider from './graphql';
import ThemeProvider from './theme';
import Router from './router';

export default function AppRouter() {
  return (
    <ApolloProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}
