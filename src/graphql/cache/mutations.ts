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

// ADD USER PHONE NUMBER TO STORE
export const ADD_USER_PHONE_NUMBER = gql`
  mutation AddUserPhoneNumber($number: String!) {
    addUserPhoneNumber(number: $number) @client
  }
`;

// ADD USER DETAILS TO STORE
export const ADD_USER_DETAILS = gql`
  mutation AddUserDetails($details: String!) {
    addUserDetails(details: $details) @client
  }
`;
