import { GET_USER_DETAILS } from './query';
import { StoreInterface, AppResolvers } from '../types';

export const cacheResolvers: AppResolvers = {
  Mutation: {
    // CHANGE USER DEFAULT DETAILS MUTATION
    addUserDetails: (_, payload, { cache }) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_USER_DETAILS
      });

      if (queryResult?.userDetails.countryCode) {
        const data = { ...queryResult, ...payload };
        cache.writeQuery({ query: GET_USER_DETAILS, data });
        return null;
      }
    }
  }
};
