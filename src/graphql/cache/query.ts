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
