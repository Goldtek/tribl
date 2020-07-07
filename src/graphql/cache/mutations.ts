import { ApolloCache } from 'apollo-cache';
import { GET_USER_COUNTRY } from './query';
import { StoreInterface } from './types';

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

export interface ResolverMap {
  [field: string]: ResolverFn;
}

export const mutations: ResolverMap = {
  // CHANGE USER DEFAULT COUNTRY MUTATION
  changeUserCountry: (_, country, { cache }) => {
    const queryResult = cache.readQuery<StoreInterface>({
      query: GET_USER_COUNTRY
    });

    if (queryResult?.countryCode) {
      const data = { ...queryResult, ...country };
      cache.writeQuery({ query: GET_USER_COUNTRY, data });
      return null;
    }
  }
};
