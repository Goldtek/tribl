import {
  GET_SIDE_MENU,
  GET_USER_DETAILS,
  GET_COMMUNITY_SEARCH_INDEX,
  GET_ACTIVE_SIDE_MENU_STATE,
  GET_MESSAGE_NOTIFICATION_BADGE,
  GET_CONNECTION_NOTIFICATION_BADGE,
  GET_TRIBE_REQUEST_NOTIFICATION_BADGE
} from './query';
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
    },

    // SHOW MESSAGE NOTIFICATION BADGE
    changeMessageNotificationBadge: (
      _,
      {
        showMessageNotificationBadge
      }: { showMessageNotificationBadge: Boolean },
      { cache }
    ) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_MESSAGE_NOTIFICATION_BADGE
      });

      const data = {
        ...queryResult,
        showMessageNotificationBadge
      } as StoreInterface;
      cache.writeQuery({ query: GET_MESSAGE_NOTIFICATION_BADGE, data });
      return null;
    },

    // TOGGLE SIDE MENU
    toggleSideMenu: (
      _,
      { showSideMenu }: { showSideMenu: Boolean },
      { cache }
    ) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_SIDE_MENU
      });

      const data = {
        ...queryResult,
        showSideMenu
      } as StoreInterface;
      cache.writeQuery({ query: GET_SIDE_MENU, data });
      return null;
    },

    // CHANGE ACTIVE SIDE MENU STATE
    changeActiveSideMenuState: (
      _,
      { activeSideMenu }: { activeSideMenu: String },
      { cache }
    ) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_ACTIVE_SIDE_MENU_STATE
      });

      const data = {
        ...queryResult,
        activeSideMenu
      } as StoreInterface;
      cache.writeQuery({ query: GET_ACTIVE_SIDE_MENU_STATE, data });
      return null;
    },

    // SHOW CONNECTION NOTIFICATION BADGE
    changeConnectionNotificationBadge: (
      _,
      {
        showConnectionNotificationBadge
      }: { showConnectionNotificationBadge: Boolean },
      { cache }
    ) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_CONNECTION_NOTIFICATION_BADGE
      });

      const data = {
        ...queryResult,
        showConnectionNotificationBadge
      } as StoreInterface;

      cache.writeQuery({ query: GET_CONNECTION_NOTIFICATION_BADGE, data });
      return null;
    },

    // SHOW TRIBE REQUEST NOTIFICATION BADGE
    changeTribeRequestNotificationBadge: (
      _,
      {
        showTribeRequestNotificationBadge
      }: { showTribeRequestNotificationBadge: Boolean },
      { cache }
    ) => {
      const queryResult = cache.readQuery<StoreInterface>({
        query: GET_TRIBE_REQUEST_NOTIFICATION_BADGE
      });

      const data = {
        ...queryResult,
        showTribeRequestNotificationBadge
      } as StoreInterface;

      cache.writeQuery({ query: GET_TRIBE_REQUEST_NOTIFICATION_BADGE, data });
      return null;
    }
  }
};

export default cacheResolvers;
