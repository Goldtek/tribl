import gql from 'graphql-tag';
import { GET_USER_COUNTRY } from './query';
import { StoreInterface, AppResolvers } from '../types';

export const typeDefs = gql`
  extend type Query {
    countryCode: String!
  }

  extend type Mutation {
    changeUserCountry(id: String!): [String!]!
  }
`;

export const resolvers: AppResolvers = {
  Mutation: {
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
  }
};
