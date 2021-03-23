import React, { FunctionComponent } from 'react';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloLink, Observable, Operation, split } from 'apollo-link';
import { ApolloProvider as Provider } from '@apollo/react-hooks';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { RetryLink } from 'apollo-link-retry';
import { crashlytics } from '../firebase/config';
import ENVIRONMENT_VARIABLES from '../config';
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

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: ENVIRONMENT_VARIABLES.TRIBL_WSS_SERVER_BASE_URI,
  options: { reconnect: true }
});

const retryLink = new RetryLink({
  delay: {
    max: 2000,
    initial: 100,
    jitter: true
  },
  attempts: { max: 3, retryIf: (error, _operation) => !!error }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const request = async (operation: Operation) => {
  const storageData = await Storage.getUserCredentials();
  if (!storageData) {
    return operation.setContext({ headers: { authorization: undefined } });
  }
  const credentials = JSON.parse(storageData) as VerifyOTPIT;
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

const handleErrors = onError(({ graphQLErrors, networkError }) => {
  // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
  // @ts-ignore
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

export const client = new ApolloClient<NormalizedCacheObject>({
  link: ApolloLink.from([handleErrors, requestLink, retryLink, link]),
  cache,
  resolvers
});

const ApolloProvider: FunctionComponent = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
