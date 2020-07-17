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
      number
      countryCode
      firstName
      lastName
      DOB
      citizenship
      locality
      identity
      interest
      __typename
    }
  }
`;
