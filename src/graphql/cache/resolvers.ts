import { GET_USER_DETAILS } from './query';
import { StoreInterface, AppResolvers } from '../types';

export const cacheResolvers: AppResolvers = {
  Mutation: {
    // CHANGE USER DEFAULT DETAILS MUTATION
    addUserDetails: (_, { details }: { details: Object }, { cache }) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_USER_DETAILS
      });

      if (queryResult?.userDetails.countryCode) {
        const data = {
          ...queryResult,
          userDetails: {
            ...queryResult.userDetails,
            ...details
          }
        } as StoreInterface;

        cache.writeQuery({ query: GET_USER_DETAILS, data });
        return null;
      }
    }
  }
};
