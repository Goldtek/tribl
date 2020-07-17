import React, { FunctionComponent } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
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
import { USER_AUTH_KEYS, JwtTokenResult } from '../constants';
import typeDefs from './schema';

const resolvers = {
  Mutation: {
    ...cacheResolvers.Mutation,
    ...serverResolvers.Mutation
  }
};

const request = async (operation: Operation) => {
  const authKeys = (await AsyncStorage.getItem(USER_AUTH_KEYS)) as string;
  const { id_token } = JSON.parse(authKeys) as JwtTokenResult;

  console.tron('USER ID TOKEN TO GET REFRESH TOKEN', { id_token });

  operation.setContext({ headers: { authorization: id_token } });
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
      if (graphQLErrors) console.tron(graphQLErrors);

      // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
      if (networkError) console.tron(networkError);
    }),
    requestLink,
    new HttpLink({ uri: ENVIRONMENT_VARIABLES.TRIBL_SERVER_BASE_URI })
  ]),
  typeDefs,
  cache,
  resolvers
});

const ApolloProvider: FunctionComponent = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
