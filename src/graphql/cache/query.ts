import gql from 'graphql-tag';

/*
 ****************************************************************
 ******************    APOLLO CACHE QUERIES   *******************
 ****************************************************************
 */

// GET USER DEFAULT COUNTRY
export const GET_USER_COUNTRY = gql`
  query GetUserCountry {
    countryCode @client
  }
`;

// CHANGE USER COUNTRY
export const CHANGE_USER_COUNTRY = gql`
  mutation ChangeUserCountry($countryCode: String!) {
    changeUserCountry(countryCode: $countryCode) @client
  }
`;
