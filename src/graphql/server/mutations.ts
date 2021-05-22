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
      id_token
      verified
      passport {
        id
      }
    }
  }
`;

// VALIDATE USER OTP
export const CREATE_USER_PASSPORT = gql`
  mutation createPassport($payload: CreatePassportInput!) {
    createPassport(input: $payload) {
      success
      place_in_line
      invite_url
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
export const REFRESH_TOKEN = `
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

// REQUEST TO JOIN PRIVATE  COMMUNITY
export const JOIN_PRIVATE_COMMUNITY = gql`
  mutation requestToJoinCommunity($payload: JoinCommunityInput!) {
    requestToJoinCommunity(input: $payload) {
      success
    }
  }
`;

//LEAVE COMMUNITY
export const LEAVE_COMMUNITY = gql`
  mutation leaveCommunity($payload: LeaveCommunityInput!) {
    leaveCommunity(input: $payload) {
      success
    }
  }
`;

// REQUEST CONNECTION
export const REQUEST_CONNECTION = gql`
  mutation requestConnection($payload: RequestConnectionInput!) {
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
export const MARK_CHANNEL_CONVERSATION_MESSAGE_READ = gql`
  mutation markChannelConversationAsRead(
    $payload: MarkChannelConversationAsReadInput!
  ) {
    markChannelConversationAsRead(input: $payload) {
      success
    }
  }
`;

// MARK MESSAGE READ
export const MARK_MESSAGE_READ = gql`
  mutation markConversationAsRead($payload: MarkConversationAsReadInput!) {
    markConversationAsRead(input: $payload) {
      success
    }
  }
`;

// JOIN COMMUNITY CHANNEL
export const JOIN_COMMUNITY_CHANNEL = gql`
  mutation joinCommunityChannel($payload: ChannelActionInput!) {
    joinCommunityChannel(input: $payload) {
      success
    }
  }
`;

// LEAVE COMMUNITY CHANNEL
export const LEAVE_COMMUNITY_CHANNEL = gql`
  mutation leaveCommunityChannel($payload: ChannelActionInput!) {
    leaveCommunityChannel(input: $payload) {
      success
    }
  }
`;

// GENERATE STREAMS TOKEN
export const GENERATE_STREAMS_TOKEN = gql`
  mutation generateStreamsToken {
    generateStreamsToken {
      streams_token
    }
  }
`;

// CREATE A NEW TRIBE
export const CREATE_NEW_TRIBE = gql`
  mutation createCommunity($payload: CreateCommunityInput!) {
    createCommunity(input: $payload) {
      success
      id
    }
  }
`;

// INVITE FRIENDS TO COMMUNITY
export const INVITE_TO_TRIBE = gql`
  mutation inviteToCommunity($payload: JoinCommunityInput!) {
    inviteToCommunity(input: $payload) {
      success
    }
  }
`;

// INVITE FRIENDS TO CHANNEL
export const INVITE_TO_CHANNEL = gql`
  mutation inviteToChannel($payload: JoinChannelInput!) {
    inviteToChannel(input: $payload) {
      success
    }
  }
`;

// ACCEPT OR DECLINE TRIBE INVITE
export const TRIBE_INVITE_ACTION = gql`
  mutation communityInviteAction($payload: CommunityInviteActionInput!) {
    communityInviteAction(input: $payload) {
      success
    }
  }
`;

// CREATE NEW CHANNEL
export const CREATE_NEW_CHANNEL = gql`
  mutation addChannelToCommunity($payload: AddChannelInput!) {
    addChannelToCommunity(input: $payload) {
      success
      id
    }
  }
`;

// BLOCK/REPORT A USER
export const BLOCK_REPORT_USER = gql`
  mutation passportPrivacyAction($payload: PassportPrivacyAction!) {
    passportPrivacyAction(input: $payload) {
      success
    }
  }
`;

// GENERATE INVITE LINK
export const GENERATE_INVITE_LINK = gql`
  mutation createRecordInKickOff($payload: PassportActionInput!) {
    createRecordInKickOff(input: $payload) {
      success
    }
  }
`;

// INVITE USER TO APP
export const INVITE_USER_TO_APP = gql`
  mutation inviteUserToApp($payload: InviteUserInput!) {
    inviteUserToApp(input: $payload) {
      success
    }
  }
`;

// APPROVE OR REJECT A NEW TRIBE
export const APPROVE_REJECT_NEW_TRIBE = gql`
  mutation communityCreationAction($payload: CommunityCreationActionInput!) {
    communityCreationAction(input: $payload) {
      success
    }
  }
`;

// APPROVE OR REJECT A NEW CHANNEL
export const APPROVE_REJECT_NEW_CHANNEL = gql`
  mutation channelCreationAction($payload: CommunityCreationActionInput!) {
    channelCreationAction(input: $payload) {
      success
    }
  }
`;

// ONBOARD USER
export const ONBOARD_USER = gql`
  mutation onBoardUser($payload: OnBoardUserInput!) {
    onBoardUser(input: $payload) {
      status
      tags
      required {
        message
        tags
      }
      optional {
        message
        tags
      }
    }
  }
`;

// REMOVE USER FROM CHANNEL
export const REMOVE_USER_FROM_CHANNEL = gql`
  mutation removeUserFromChannel($payload: RemoveUserFromChannelInput!) {
    removeUserFromChannel(input: $payload) {
      success
    }
  }
`;

// REMOVE USER FROM TRIBE
export const REMOVE_USER_FROM_TRIBE = gql`
  mutation removeUserFromCommunity($payload: LeaveCommunityInput!) {
    removeUserFromCommunity(input: $payload) {
      success
    }
  }
`;

export const SAVE_CARD_DETAILS = gql`
  mutation saveCardDetails($payload: CardDetailsInput!) {
    saveCardDetails(input: $payload) {
      success
      errorCode
    }
  }
`;

export const SAVE_BANK_DETAILS = gql`
  mutation saveBankDetails($payload: SaveBankDetailsInput!) {
    saveBankDetails(input: $payload) {
      success
      errorCode
    }
  }
`;

export const BUY_CRYPTO = gql`
  mutation buyCrypto($payload: FundWalletInput!) {
    fundWallet(input: $payload) {
      success
    }
  }
`;
