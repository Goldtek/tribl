import { GET_USER_DETAILS, GET_COMMUNITY_SEARCH_INDEX } from './query';
import { StoreInterface, AppResolvers } from '../types';

const cacheResolvers: AppResolvers = {
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
    },

    // ADD COMMUNITY SEARCH INDEX
    addCommunitySearchIndex: (
      _,
      { communitySearchIndex }: { communitySearchIndex: Number },
      { cache }
    ) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_COMMUNITY_SEARCH_INDEX
      });

      const data = { ...queryResult, communitySearchIndex } as StoreInterface;
      cache.writeQuery({ query: GET_COMMUNITY_SEARCH_INDEX, data });
      return null;
    }
  }
};

export default cacheResolvers;
