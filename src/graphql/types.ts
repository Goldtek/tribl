import { Resolvers } from 'apollo-client';
import { ApolloCache } from 'apollo-cache';
import { RootStackParamScreensList } from '../screens/types';

/*
 *************************************************************
 ******************    APOLLO CACHE    ***********************
 *******************   STORE TYPES     ***********************
 *************************************************************
 */

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: ApolloCache<any> }
) => any;

export interface ResolverMap {
  [field: string]: ResolverFn;
}

// APP RESOLVERS INTERFACE
export interface AppResolvers extends Resolvers {
  Mutation: ResolverMap;
}

// STORE (LOCAL STATE) INTERFACE
type Location = {
  state: string;
  country: string;
  city: string;
  lat: number | null;
  __typename: string;
  long: number | null;
};

enum UserAvailability {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

enum PrivacyStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export enum Status {
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
  ACCEPTED = 'ACCEPTED',
  CONNECTED = 'CONNECTED',
  NOT_CONNECTED = 'NOT_CONNECTED'
}

enum SubscriptionEventType {
  USER_PRESENCE
}

type _Neo4jDate = {
  day: number | null;
  year: number | null;
  hour: number | null;
  month: number | null;
  minute: number | null;
  second: number | null;
  __typename: string;
  formatted: string | null;
  timeZoneId: number | null;
  nanosecond: number | null;
  millisecond: number | null;
  timeZoneOffsetSeconds: number | null;
};

type UserPresence = {
  _id: String;
  lastSeen: _Neo4jDate;
  status: UserAvailability;
  type: SubscriptionEventType;
};

type DirectMessage = {
  id: String;
  content: String;
  senderId: String;
  receiverId: String;
  readAt: _Neo4jDate;
  createdAt: _Neo4jDate;
  conversationId: String;
};

type MessageRequest = {
  id: String;
  senderId: String;
  createdAt: _Neo4jDate;
  approvedAt?: _Neo4jDate;
};

type Spam = {
  id: String;
  directMessage: DirectMessage;
};

type Conversation = {
  spam: Spam;
  id: string;
  senderId: String;
  createdAt: _Neo4jDate;
  updatedAt: _Neo4jDate;
  messageRequest: MessageRequest;
  participants: PassportInterface;
};

type Connection = {
  id: String;
  status: Status;
  createdAt: _Neo4jDate;
  updatedAt: _Neo4jDate;
};

export enum IFCMMessageTypes {
  TRIBE_INVITE_ACCEPTED = 'TRIBE_INVITE_ACCEPTED',
  CHANNEL_INVITE_ACCEPTED = 'CHANNEL_INVITE_ACCEPTED',
  DIRECT_MESSAGE_RECEIVED = 'DIRECT_MESSAGE_RECEIVED',
  THREAD_MESSAGE_RECEIVED = 'THREAD_MESSAGE_RECEIVED',
  CHANNEL_INVITE_REQUESTED = 'CHANNEL_INVITE_REQUESTED',
  CHANNEL_MESSAGE_RECEIVED = 'CHANNEL_MESSAGE_RECEIVED',
  COMMUNITY_INVITE_RECEIVED = 'COMMUNITY_INVITE_RECEIVED',
  COMMUNITY_INVITE_ACCEPTED = 'COMMUNITY_INVITE_ACCEPTED',
  COMMUNITY_REQUEST_RECEIVED = 'COMMUNITY_REQUEST_RECEIVED',
  COMMUNITY_REQUEST_ACCEPTED = 'COMMUNITY_REQUEST_ACCEPTED',
  CHANNEL_INVITATION_RECEIVED = 'CHANNEL_INVITATION_RECEIVED',
  CONNECTION_REQUEST_ACCEPTED = 'CONNECTION_REQUEST_ACCEPTED',
  CONNECTION_REQUEST_RECEIVED = 'CONNECTION_REQUEST_RECEIVED',
  NEARBY_USER_JOINED_COMMUNITY = 'NEARBY_USER_JOINED_COMMUNITY'
}

export type NotificationMessageType = keyof typeof IFCMMessageTypes;

export type NotificationMessage = {
  message: string;
  link_url: string;
  senderId: string;
  channelId: string;
  sender_id: string;
  receiverId: string;
  senderName: string;
  communityId: string;
  channelType: string;
  channelName: string;
  sender_image: string;
  sender_title: string;
  receiverName: string;
  senderAvatar: string;
  communityName: string;
  receiverAvatar: string;
  communityAvatar: string;
  channelIsPrivate: boolean;
  communityIsPrivate: boolean;
  type: NotificationMessageType;
};

export type Citizenship = {
  id: string;
  name: string;
  flag: string;
  createdAt: string;
  updatedAt: string;
  passports: PassportInterface[];
};

type Tags = {
  id: string;
  name: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

type PassportPrivacy = {
  identity: string;
  age: string;
  interest: string;
  locality: string;
  visibility: string;
  blocked: PassportInterface[];
};

enum CurrencyStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  PENDING = 'PENDING',
  DEACTIVATED = 'DEACTIVATED',
  FROZEN = 'FROZEN'
}

type WalletActivity = {
  id: string;
  description: string;
  entityName: string;
  visible: boolean;
  wallet: Wallet;
  createdAt: Date;
  updatedAt: Date;
};

type FundingBillingAddress = {
  id: string;
  addressLine: string;
  addressLine2: string;
  countryCode: string;
  stateCode: string;
  city: string;
  postCode: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  wallet: Wallet;
};

type FundingCard = {
  id: string;
  billingDetails: FundingBillingAddress;
  network: string;
  source: FundingSource;
  last4: string;
  expYear: string;
  expMonth: string;
  createdAt: string;
  updatedAt: string;
};

enum FundingBankType {
  WIRE = 'WIRE',
  ACH = 'ACH'
}

type FundingBank = {
  id: string;
  description: string;
  type: FundingBankType;
  trackingRef: string;
  billingDetails: FundingBillingAddress;
  bankAddress: FundingBillingAddress;
  source: FundingSource;
  createdAt: string;
  updatedAt: string;
};

enum FundingSourceType {
  CARD = 'CARD',
  BANK = 'BANK'
}

type FundingSource = {
  id: string;
  entityName: string;
  wallet: Wallet;
  card: FundingCard;
  bank: FundingBank;
  status: string;
  errorCode: string;
  type: FundingSourceType;
  createdAt: string;
  updatedAt: string;
};

type BillingAddress = {
  id: string;
  addressLine: string;
  addressLine2: string;
  countryCode: string;
  stateCode: string;
  city: string;
  postCode: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  country: string;
  state: string;
  wallet: Wallet;
};

type Wallet = {
  id: string;
  status: string;
  currencies: {
    id: string;
    availableBalance: string;
    ledgerBalance: string;
    status: CurrencyStatus;
    name: string;
    entityName: string;
  };
  entityName: string;
  passport: PassportInterface;
  community: CommunityInterface;
  activities: WalletActivity;
  fundingSources: FundingSource[];
  billingDetails: BillingAddress[];
};

export interface PassportInterface {
  id: string;
  bio: string;
  email: string;
  avatar: string;
  dob: string;
  invite_url: string;
  isAdmin: boolean;
  lastName: string;
  verified: boolean;
  firstName: string;
  __typename: string;
  interest: Tags[];
  identity: Tags[];
  countryCode: string;
  phoneNumber: string;
  birthPlace: Location;
  presence: UserPresence;
  communityCount: number;
  connectionCount: number;
  connected: Status | null;
  citizenship: Citizenship[];
  currentLocation: Location;
  connection: Connection | null;
  status: UserAvailability | null;
  conversation: Conversation | null;
  myConnections: PassportInterface[];
  moderatorOf?: CommunityInterface[];
  participantOf?: CommunityInterface[];
  channelParticipantOf?: ChannelInterface[];
  recentChannels?: ChannelInterface[];
  pendingConnections: ConnectionStatusInterface[];
  connectionRequests: ConnectionStatusInterface[];
  connectionDetails: ConnectionStatusInterface;
  pending: string;
  privacy: PassportPrivacy;
  blocked: PassportPrivacy;
  wallet: Wallet;
}

export interface ConnectionStatusInterface {
  status: string;
  id: string;
}

export interface StoreInterface {
  communitySearchIndex: number;
  userDetails: PassportInterface;
  showMessageNotificationBadge: boolean;
  showSideMenu: boolean;
  showConnectionNotificationBadge: boolean;
}

export type ChannelInterface = {
  id: string;
  name: string;
  isMember: boolean;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  isPrivate: boolean;
  creator: PassportInterface;
  community: CommunityInterface;
  participants: PassportInterface[];
  moderators: PassportInterface[];
};

type Interest = {
  id: string;
  name: string;
  createdAt: _Neo4jDate;
  updatedAt: _Neo4jDate;
};

type CommunityPrivacy = {
  id: string;
  visibility: PrivacyStatus;
};

export interface CommunityInterface {
  id: string;
  name: string;
  avatar: string;
  wallet: Wallet;
  tags: Interest[];
  isMember: boolean;
  isPrivate: boolean;
  isInvited: boolean;
  description: string;
  membersCount: number;
  isRequested: boolean;
  isModerator: boolean;
  creator: PassportInterface;
  privacy: CommunityPrivacy;
  channels: ChannelInterface[];
  moderators: PassportInterface[];
  participants: PassportInterface[];
  uniqueInterests: { name: string; id: string }[];
}

/*
 *************************************************************
 ******************    APOLLO SERVER    **********************
 *******************   STORE TYPES     ***********************
 *************************************************************
 */

// SERVER JWT (RESPONSE) TYPE
export interface JwtTokenResult {
  _id: string;
  scope: string;
  exists: boolean;
  id_token: string;
  verified: boolean;
  appVersion: string;
  expires_in: number;
  access_token: string;
  streams_token: string;
  refresh_token: string;
  firebase_token: string;
  passport: PassportInterface;
}

// SERVER OTP (RESPONSE) TYPE
export type OTPInterface = {
  sendOtp: { __typename: string; success: boolean };
};

type QueryMetadata = {
  totalCount: number;
};

// SERVER VERIFY OTP (RESPONSE) TYPE
export interface VerifyOTPIT extends JwtTokenResult {
  __typename: string;
}

// LOCAL REGISTRATION OBJECT TYPE
export interface RegistrationInfo {
  route: RootStackParamScreensList;
  completed?: boolean;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    identity?: string[];
    identityName?: string[];
    birthPlace?: Location;
    currentLocation?: Location;
  };
}

export interface ShowModal {
  community: string[];
}

export type VerifyOTPInterface = { validateOtp: VerifyOTPIT };

export type RefreshTokenInterface = { refreshToken: VerifyOTPIT };

// GENERATE STREAMS TOKEN REQUEST (RESPONSE) TYPE
export type GenerateStreamsTokenRequestInterface = {
  generateStreamsToken: VerifyOTPIT;
};

// SERVER CREATE ACCOUNT (RESPONSE) TYPE
export type CreateAccountInterface = {
  createPassport: {
    success: boolean;
    _id: string;
    place_in_line: number;
    invite_url: string;
  };
};

// USER PASSPORT (RESPONSE) TYPE
export type MyPassportInterface = { myPassport: PassportInterface };

// USER CONNECTIONS (RESPONSE) TYPE
export type MyConnectionsInterface = {
  myConnections: { data: PassportInterface[]; metadata: QueryMetadata };
};

enum InvitationStatus {
  ACCEPTED,
  PENDING,
  DECLINED
}

enum InvitationType {
  REQUEST,
  INVITE
}

// USER COMMUNITY INVITE (RESPONSE) TYPE
export type CommunityInviteInterface = {
  communityInvites: {
    data: {
      id: string;
      status: InvitationStatus;
      type: InvitationType;
      community: CommunityInterface;
      sender: PassportInterface;
      receipient: PassportInterface;
      createdAt: string;
      updatedAt: string;
    }[];
    metadata: QueryMetadata;
  };
};

// USER COMMUNITY CREATION REQUEST (RESPONSE) TYPE
export type CommunityCreationRequestInterface = {
  communityCreationRequests: {
    data: CommunityInterface[];
    metadata: QueryMetadata;
  };
};

// USER CHANNEL CREATION REQUEST (RESPONSE) TYPE
export type ChannelCreationRequestInterface = {
  channelCreationRequests: {
    data: ChannelInterface[];
    metadata: QueryMetadata;
  };
};

//GET ALL CHANNEL CREATION REQUEST (RESPONSE) TYPE
export type AllChannelCreationRequestInterface = {
  myChannelCreationRequests: {
    data: ChannelInterface[];
    metadata: QueryMetadata;
  };
};

// COMMUNITY USER SINGLE PASSPORT (RESPONSE) TYPE
export type UserPassportInterface = { singlePassport: PassportInterface };

export interface UserDetails {
  name: string;
  id: string;
}

// USER SELECTABLE IDENTITIES (RESPONSE) TYPE
export type IdentitiesInterface = {
  Identity: {
    data: { name: string; id: string }[];
  };
};

// USER SELECTABLE INTEREST (RESPONSE) TYPE
export type InterestInterface = {
  Interest: {
    data: { name: string; id: string }[];
  };
};

// SERVER UPDATE USER PASSPORT (RESPONSE) TYPE
export type UpdatePassportInterface = {
  updatePassport: { success: boolean; __typename: string };
};

// ACCEPT MESSAGE REQUEST (RESPONSE) TYPE
export type AcceptMessageRequestInterface = {
  acceptMessageRequest: { success: boolean; __typename: string };
};

// DELETE MESSAGE REQUEST (RESPONSE) TYPE
export type DeleteMessageRequestInterface = {
  deleteMessageRequest: { success: boolean; __typename: string };
};

// BLOCK MESSAGE REQUEST (RESPONSE) TYPE
export type BlockMessageRequestInterface = {
  blockMessageRequest: { success: boolean; __typename: string };
};

// RECOMMENDED MEMBERS REQUEST (RESPONSE) TYPE
export type RecommendedMembersRequestInterface = {
  recommendedMembers: {
    data: PassportInterface[];
  };
};

// CHANNEL MEMBERS REQUEST (RESPONSE) TYPE
export type ChannelMembersRequestInterface = {
  channelMembers: {
    data: PassportInterface[];
    metadata: QueryMetadata;
  };
};

// RECOMMENDED COMMUNITIES REQUEST (RESPONSE) TYPE
export type RecommendedCommunitiesRequestInterface = {
  recommendedCommunities: {
    data: CommunityInterface[];
  };
};

// MY COMMUNITIES REQUEST (RESPONSE) TYPE
export type MyCommunitiesRequestInterface = {
  myCommunities: {
    data: CommunityInterface[];
    metadata: QueryMetadata;
  };
};

// NEARBY MEMBERS REQUEST (RESPONSE) TYPE
export type NearbyMembersRequestInterface = {
  nearbyMembers: {
    data: PassportInterface[];
    metadata: QueryMetadata;
  };
};

// COMMUNITY MEMBERS REQUEST (RESPONSE) TYPE
export type CommunityMembersRequestInterface = {
  communityMembers: {
    data: PassportInterface[];
  };
};

// ALL MEMBERS REQUEST (RESPONSE) TYPE
export type AllMembersRequestInterface = {
  Passport: {
    data: PassportInterface[];
    metadata: QueryMetadata;
  };
};

// ALL MEMBERS REQUEST (RESPONSE) TYPE
export type SinglePassportRequestInterface = {
  singlePassport: PassportInterface;
};

// SHOW MESSAGE NOTIFICATION REQUEST (RESPONSE) TYPE
export type ShowMessageNotificationBadge = {
  showMessageNotificationBadge: boolean;
};

// SHOW SIDE MENU REQUEST (RESPONSE) TYPE
export type ShowSideMenu = {
  showSideMenu: boolean;
};

// SHOW SIDE MENU REQUEST (RESPONSE) TYPE
export type ActiveSideMenuRequestInterface = {
  activeSideMenu: string;
};

// SHOW NOTIFICATION REQUEST (RESPONSE) TYPE
export type ShowConnectionNotificationBadge = {
  showConnectionNotificationBadge: boolean;
};

// SHOW SHOW TRIBE REQUEST (RESPONSE) TYPE
export type ShowTribeRequestNotificationBadge = {
  showTribeRequestNotificationBadge: boolean;
};

// USER COMMUNITY CHANNEL REQUEST LIST (RESPONSE) TYPE
export type MyChannelRequestInterface = {
  myChannels: { data: ChannelInterface[]; metadata: QueryMetadata };
};

// USER CONNECTIONS REQUESTS (RESPONSE) TYPE
export type ConnectionRequestsInterface = {
  connectionRequests: { data: PassportInterface[]; metadata: QueryMetadata };
};

// POPULAR COMMUNITIES REQUEST (RESPONSE) TYPE
export type PopularCommunitiesRequestInterface = {
  popularCommunities: { data: CommunityInterface[]; metadata: QueryMetadata };
};

// MY CONNECTIONS NEARBY REQUEST (RESPONSE) TYPE
export type MyConnectionNearbyRequestInterface = {
  nearbyConnections: {
    data: PassportInterface[];
    metadata: QueryMetadata;
  };
};

// COMMUNITY CHANNEL REQUEST LIST (RESPONSE) TYPE
export type CommunityChannelRequestInterface = {
  Channel: {
    data: ChannelInterface[];
    metadata: QueryMetadata;
  };
};

// GET SINGLE COMMUNITY REQUEST (RESPONSE) TYPE
export type SingleCommunityRequestInterface = {
  Community: {
    data: CommunityInterface[];
  };
};
