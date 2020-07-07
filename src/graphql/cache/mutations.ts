import gql from 'graphql-tag';

/*
 ****************************************************************
 ******************    APOLLO CACHE MUTATIONS   *******************
 ****************************************************************
 */

// CHANGE USER COUNTRY
export const CHANGE_USER_COUNTRY = gql`
  mutation ChangeUserCountry($countryCode: String!) {
    changeUserCountry(countryCode: $countryCode) @client
  }
`;
