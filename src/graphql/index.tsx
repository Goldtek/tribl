import React, { FunctionComponent } from 'react';
import { Alert } from 'react-native';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloLink, Observable, Operation } from 'apollo-link';
import { ApolloProvider as Provider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import cache from './cache';
import { cacheResolvers } from './cache/resolvers';
import { serverResolvers } from './server/resolvers';
import ENVIRONMENT_VARIABLES from '../config';
import Storage from '../storage';

const resolvers = {
  Mutation: {
    ...cacheResolvers.Mutation,
    ...serverResolvers.Mutation
  }
};

const request = async (operation: Operation) => {
  const auth = await Storage.getUserCredentials();

  if (!auth) return;
  operation.setContext({ headers: { authorization: auth.username } });
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
        Alert.alert(
          'graphQLErrors',
          JSON.stringify({ ENVIRONMENT_VARIABLES, graphQLErrors })
        );
      }

      // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
      if (networkError) {
        Alert.alert(
          'networkError',
          JSON.stringify({ ENVIRONMENT_VARIABLES, networkError })
        );
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
