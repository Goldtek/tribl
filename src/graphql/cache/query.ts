import gql from 'graphql-tag';

/*
 ****************************************************************
 ******************    APOLLO CACHE QUERIES   *******************
 ****************************************************************
 */

// GET USER DETAILS
export const GET_USER_DETAILS = gql`
  query GetUserDetails {
    userDetails @client {
      bio
      dob
      email
      phoneNumber
      countryCode
      firstName
      lastName
      citizenship {
        name
        flag
      }
      currentLocation {
        lat
        long
        country
        state
        city
      }
      birthPlace {
        lat
        long
        country
        state
        city
      }
      identity {
        id
        name
      }
      interest {
        id
        name
      }
      avatar
      participantOf {
        id
        name
        avatar
        isPrivate
        isModerator
        membersCount
      }
      myConnections {
        id
        avatar
        lastName
        firstName
        phoneNumber
      }
      myChannels {
        id
        name
        isMember
        isPrivate
        community {
          id
          name
          avatar
        }
      }
    }
  }
`;

// GET COMMUNITY SEARCH INDEX
export const GET_COMMUNITY_SEARCH_INDEX = gql`
  query GetCommunitySearchIndex {
    communitySearchIndex @client
  }
`;

// SHOW MESSAGE NOTIFICATION BADGE
export const GET_MESSAGE_NOTIFICATION_BADGE = gql`
  query GetMessageNotificationBadge {
    showMessageNotificationBadge @client
  }
`;

// SHOW SIDE MENU
export const GET_SIDE_MENU = gql`
  query GetSideMenu {
    showSideMenu @client
  }
`;

// SHOW CONNECTION NOTIFICATION BADGE
export const GET_CONNECTION_NOTIFICATION_BADGE = gql`
  query GetConnectionNotificationBadge {
    showConnectionNotificationBadge @client
  }
`;

// GET ACTIVE SIDE MENU STATE
export const GET_ACTIVE_SIDE_MENU_STATE = gql`
  query ActiveSideMenuState {
    activeSideMenu @client
  }
`;
