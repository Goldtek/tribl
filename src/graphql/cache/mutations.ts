import gql from 'graphql-tag';

/*
 ****************************************************************
 ******************    APOLLO CACHE MUTATIONS   *******************
 ****************************************************************
 */

// ADD USER DETAILS TO STORE
export const ADD_USER_DETAILS = gql`
  mutation AddUserDetails($details: String!) {
    addUserDetails(details: $details) @client
  }
`;

// ADD COMMUNITY SEARCH INDEX
export const ADD_COMMUNITY_SEARCH_INDEX = gql`
  mutation AddCommunitySearchIndex($communitySearchIndex: Number!) {
    addCommunitySearchIndex(communitySearchIndex: $communitySearchIndex) @client
  }
`;

// SHOW MESSAGE NOTIFICATION BADGE
export const CHANGE_MESSAGE_NOTIFICATION_BADGE = gql`
  mutation changeMessageNotificationBadge(
    $showMessageNotificationBadge: Boolean!
  ) {
    changeMessageNotificationBadge(
      showMessageNotificationBadge: $showMessageNotificationBadge
    ) @client
  }
`;

// TOGGLE SIDE MENU
export const TOGGLE_SIDE_MENU = gql`
  mutation toggleSideMenu($showSideMenu: Boolean!) {
    toggleSideMenu(showSideMenu: $showSideMenu) @client
  }
`;

// SHOW CONNECTION NOTIFICATION BADGE
export const CHANGE_CONNECTION_NOTIFICATION_BADGE = gql`
  mutation changeConnectionNotificationBadge(
    $showConnectionNotificationBadge: Boolean!
  ) {
    changeConnectionNotificationBadge(
      showConnectionNotificationBadge: $showConnectionNotificationBadge
    ) @client
  }
`;

// SHOW TRIBE REQUEST NOTIFICATION BADGE
export const CHANGE_TRIBE_REQUEST_NOTIFICATION_BADGE = gql`
  mutation changeTribeRequestNotificationBadge(
    $showTribeRequestNotificationBadge: Boolean!
  ) {
    changeTribeRequestNotificationBadge(
      showTribeRequestNotificationBadge: $showTribeRequestNotificationBadge
    ) @client
  }
`;

// CHANGE ACTIVE SIDE MENU STATE
export const CHANGE_ACTIVE_SIDE_MENU_STATE = gql`
  mutation changeActiveSideMenuState($activeSideMenu: String!) {
    changeActiveSideMenuState(activeSideMenu: $activeSideMenu) @client
  }
`;
