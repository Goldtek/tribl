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
      DOB
      email
      number
      countryCode
      firstName
      lastName
      citizenship
      currentLocation {
        lat
        long
        country
        state
      }
      birthPlace {
        lat
        long
        country
        state
      }
      identities
      interests
      userId
      avatar
    }
  }
`;
