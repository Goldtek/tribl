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
      dob {
        formatted
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
      }
      birthPlace {
        lat
        long
        country
        state
      }
      identity
      interest
      avatar
    }
  }
`;
