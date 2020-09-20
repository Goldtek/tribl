import React, { FunctionComponent } from 'react';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloLink, Observable, Operation, split } from 'apollo-link';
import * as Sentry from '@sentry/react-native';
import { ApolloProvider as Provider } from '@apollo/react-hooks';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import cache from './cache';
import resolvers from './cache/resolvers';
import ENVIRONMENT_VARIABLES from '../config';
import Storage from '../storage';

// Create a Http link:
const httpLink = new HttpLink({
  uri: `https://${ENVIRONMENT_VARIABLES.TRIBL_SERVER_BASE_URI}`
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `wss://${ENVIRONMENT_VARIABLES.TRIBL_SERVER_BASE_URI}`,
  lazy: true,
  options: { reconnect: true }
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

const request = (operation: Operation) => {
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
      if (graphQLErrors) Sentry.captureException(graphQLErrors);

      // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
      if (networkError) Sentry.captureException(networkError);
    }),
    requestLink,
    link
  ]),
  cache,
  resolvers
});

const ApolloProvider: FunctionComponent = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
