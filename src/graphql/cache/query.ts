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
      dob {
        formatted
        day
        month
        year
      }
      email
      phoneNumber
      countryCode
      firstName
      lastName
      citizenShip
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
      identity
      interest
      avatar
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
export const GET_SIDE_MENU_STATE = gql`
  query GetSideMenuState {
    showSideMenu @client
  }
`;

// SHOW CONNECTION NOTIFICATION BADGE
export const GET_CONNECTION_NOTIFICATION_BADGE = gql`
  query GetConnectionNotificationBadge {
    showConnectionNotificationBadge @client
  }
`;
