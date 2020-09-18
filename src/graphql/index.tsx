import React, { FunctionComponent } from 'react';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloLink, Observable, Operation } from 'apollo-link';
import * as Sentry from '@sentry/react-native';
import { ApolloProvider as Provider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import cache from './cache';
import resolvers from './cache/resolvers';
import ENVIRONMENT_VARIABLES from '../config';
import Storage from '../storage';

const request = async (operation: Operation) => {
  const credentials = Storage.getUserCredentials();
  operation.setContext({ headers: { authorization: credentials?.id_token } });
};

const requestLink = new ApolloLink(
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

export const client = new ApolloClient<NormalizedCacheObject>({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
      if (graphQLErrors) {
        // send error via sentry
        Sentry.captureException(graphQLErrors);
      }

      // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
      if (networkError) {
        // send error via sentry
        Sentry.captureException(networkError);
      }
    }),
    requestLink,
    new HttpLink({ uri: ENVIRONMENT_VARIABLES.TRIBL_SERVER_BASE_URI })
  ]),
  cache,
  resolvers
});

const ApolloProvider: FunctionComponent = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
