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
