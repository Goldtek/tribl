import gql from 'graphql-tag';

/*
 ****************************************************************
 ****************    APOLLO SERVER MUTATIONS   ******************
 ****************************************************************
 */

// SEND USER OTP
export const SEND_USER_OTP = gql`
  mutation sendOtp($payload: SendOtpInput!) {
    sendOtp(input: $payload) {
      success
    }
  }
`;

// VALIDATE USER OTP
export const VALIDATE_USER_OTP = gql`
  mutation validateOtp($payload: ValidateOtpInput!) {
    validateOtp(input: $payload) {
      id_token
      refresh_token
      verified
    }
  }
`;

// VALIDATE USER OTP
export const CREATE_USER_ACCOUNT = gql`
  mutation createPassport($payload: CreatePassportInput!) {
    createPassport(input: $payload) {
      success
    }
  }
`;

// refresh token
export const REFRESH_TOKEN = gql`
  mutation refreshToken($payload: RefreshTokenInput!) {
    refreshToken(input: $payload) {
      id_token
    }
  }
`;

// JOIN COMMUNITY
export const JOIN_COMMUNITY = gql`
  mutation joinCommunity($payload: JoinCommunityInput!) {
    joinCommunity(input: $payload) {
      success
    }
  }
`;

// REQUEST CONNECTION
export const REQUEST_CONNECTION = gql`
  mutation requestConnection($payload: ConnectionInput!) {
    requestConnection(input: $payload) {
      success
    }
  }
`;
