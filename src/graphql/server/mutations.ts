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
      firebase_token
      refresh_token
      access_token
      expires_in
      token_type
      id_token
      verified
    }
  }
`;

// VALIDATE USER OTP
export const CREATE_USER_PASSPORT = gql`
  mutation createPassport($payload: CreatePassportInput!) {
    createPassport(input: $payload) {
      success
    }
  }
`;

// UPDATE USER PASSPORT
export const UPDATE_USER_PASSPORT = gql`
  mutation updatePassport($payload: UpdatePassportInput!) {
    updatePassport(input: $payload) {
      success
    }
  }
`;

// REFRESH TOKEN
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

// ACCEPT CONNECTION
export const ACCEPT_CONNECTION = gql`
  mutation acceptConnection($payload: ConnectionInput!) {
    acceptConnection(input: $payload) {
      success
    }
  }
`;

// REJECT CONNECTION
export const REJECT_CONNECTION = gql`
  mutation declineConnection($payload: ConnectionInput!) {
    declineConnection(input: $payload) {
      success
    }
  }
`;

// UPLOAD USER AVATAR
export const UPLOAD_USER_AVATAR = gql`
  mutation uploadCloudinaryFile($payload: Upload!) {
    uploadCloudinaryFile(file: $payload) {
      success
      url
    }
  }
`;

// UPDATE PASSPORT
export const UPDATE_PASSPORT = gql`
  mutation updatePassport($payload: UpdatePassportInput!) {
    updatePassport(input: $payload) {
      success
    }
  }
`;

// SEND DIRECT MESSAGE
export const SEND_DIRECT_MESSAGE = gql`
  mutation createDirectMessage($payload: ComposeDirectMessageInput!) {
    createDirectMessage(input: $payload) {
      success
    }
  }
`;

// DELETE MESSAGE REQUEST
export const DELETE_MESSAGE_REQUEST = gql`
  mutation deleteMessageRequest($payload: DeleteMessageRequestInput!) {
    deleteMessageRequest(input: $payload) {
      success
    }
  }
`;

// BLOCK MESSAGE REQUEST
export const BLOCK_MESSAGE_REQUEST = gql`
  mutation blockMessageRequest($payload: BlockMessageRequestInput!) {
    blockMessageRequest(input: $payload) {
      success
    }
  }
`;

// ACCEPT MESSAGE REQUEST
export const ACCEPT_MESSAGE_REQUEST = gql`
  mutation acceptMessageRequest($payload: AcceptMessageRequestInput!) {
    acceptMessageRequest(input: $payload) {
      success
    }
  }
`;

// MARK MESSAGE READ
export const MARK_MESSAGE_READ = gql`
  mutation markConversationAsRead($payload: MarkMessageAsReadInput!) {
    markConversationAsRead(input: $payload) {
      success
    }
  }
`;
