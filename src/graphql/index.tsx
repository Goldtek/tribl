import React, { FunctionComponent } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloLink, Observable, Operation } from 'apollo-link';
import { ApolloProvider as Provider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import cache from './cache';
import { resolvers, typeDefs } from './cache/resolvers';
import ENVIRONMENT_VARIABLES from '../config';
import { USER_TOKEN } from '../constants';

const request = async (operation: Operation) => {
  const userToken = await AsyncStorage.getItem(USER_TOKEN);
  operation.setContext({ headers: { authorization: userToken } });
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
      if (graphQLErrors) console.log(graphQLErrors);

      // SUBSCRIBE THIS TO A THIRD PARTY LOG ANALYTICS
      if (networkError) console.log(networkError);
    }),
    requestLink,
    new HttpLink({ uri: ENVIRONMENT_VARIABLES.TRIBL_SERVER_BASE_URI })
  ]),
  cache,
  typeDefs,
  resolvers
});

const ApolloProvider: FunctionComponent = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;
