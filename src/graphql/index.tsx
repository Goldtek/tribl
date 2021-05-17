import React, { FunctionComponent, useEffect, useState } from 'react';
import { ApolloLink, Observable, Operation } from 'apollo-link';
import { ApolloProvider as Provider } from '@apollo/react-hooks';
import AsyncStorage from '@react-native-community/async-storage';
import { CachePersistor } from 'apollo-cache-persist';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import checkRefreshToken from '../utils/checkRefreshToken';
import { useNetInfo } from '@react-native-community/netinfo';
import { crashlytics } from '../firebase/config';
import { RetryLink } from 'apollo-link-retry';
import QueueLink from 'apollo-link-queue';
import ENVIRONMENT_VARIABLES from '../config';
import { ApolloClient } from 'apollo-client';
import { SCHEMA_VERSION_KEY } from '../constants';
import { APP_VERSION } from '../utils/device';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import resolvers from './cache/resolvers';
import Storage from '../libs/storage';
import { VerifyOTPIT } from './types';
import cache from './cache';

// Create a Http link:
const httpLink = new HttpLink({
  uri: ENVIRONMENT_VARIABLES.TRIBL_SERVER_BASE_URI
});

const queueLink = new QueueLink();
const retryLink = new RetryLink({
  delay: { max: 2000, initial: 100, jitter: true },
  attempts: { max: 3, retryIf: (error, _operation) => !!error }
});

const request = async (operation: Operation) => {
  const storageData = await Storage.getUserCredentials();

  if (!storageData) {
    return operation.setContext({ headers: { authorization: {} } });
  }

  const credentials = JSON.parse(storageData) as VerifyOTPIT;
  operation.setContext({ headers: { authorization: credentials?.id_token } });
  checkRefreshToken(credentials);
};

const authLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any = undefined;
      Promise.resolve(operation)
        .then((resOperation) => request(resOperation))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => handle && handle.unsubscribe();
    })
);

const handleErrors = onError(({ graphQLErrors, networkError }) => {
  // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      crashlytics.recordError(
        new Error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    );
  }

  // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
  if (networkError) {
    crashlytics.recordError(new Error(`[Network error]: ${networkError}`));
  }
});

const link = ApolloLink.from([
  handleErrors,
  authLink,
  //@ts-ignore
  queueLink,
  retryLink,
  httpLink
]);

const ApolloProvider: FunctionComponent = ({ children }) => {
  const SCHEMA_VERSION = APP_VERSION;

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    {} as ApolloClient<NormalizedCacheObject>
  );

  const { isConnected } = useNetInfo();

  useEffect(() => {
    async function setupApollo() {
      const persistor = new CachePersistor({
        cache,
        //@ts-ignore
        storage: AsyncStorage
      });

      // Read the current schema version from AsyncStorage.
      const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

      if (currentVersion === SCHEMA_VERSION) {
        // If the current version matches the latest version,
        // we're good to go and can restore the cache.
        await persistor.restore();
      } else {
        // Otherwise, we'll want to purge the outdated persisted cache
        // and mark ourselves as having updated to the latest version.
        await persistor.purge();
        await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
      }

      const client = new ApolloClient<NormalizedCacheObject>({
        link,
        cache,
        resolvers
      });

      setClient(client);
    }

    if (!client.version) setupApollo();
  }, []);

  useEffect(() => {
    isConnected ? queueLink.open() : queueLink.close();
  }, [isConnected]);

  if (!client.version) return null;

  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
