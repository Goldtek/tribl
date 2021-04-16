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
  CONNECTION_REQUEST_RECEIVED = 'CONNECTION_REQUEST_RECEIVED',
  CONNECTION_REQUEST_ACCEPTED = 'CONNECTION_REQUEST_ACCEPTED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED'
}

type NotificationMessage = {
  channelType: string;
  channelId: string;
  sender_id: string;
  sender_image: string;
  sender_title: string;
  message: string;
  link_url: string;
  message: string;
  link_url: string;
  type: IFCMMessageTypes;
};

type NotificationMetaData = {
  route: string;
  data: {
    id?: string;
    title?: string;
    chatId?: string;
    senderId?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    communityCount?: number;
    connectionCount?: number;
    phoneNumber?: string;
    receiverId?: string;
  };
};

type Citizenship = {
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

export interface PassportInterface {
  id: string;
  bio: string;
  email: string;
  avatar: string;
  dob: string;
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
  community: CommunityInterface;
  participants: PassportInterface[];
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

type Citizenship = {
  name: string;
  flag: string;
};

export interface CommunityInterface {
  id: string;
  name: string;
  avatar: string;
  isMember: boolean;
  isModerator: boolean;
  isPrivate: boolean;
  isRequested: boolean;
  isInvited: boolean;
  description: string;
  membersCount: number;
  channels: ChannelInterface[];
  tags: Interest[];
  uniqueInterests: {
    name;
    id;
  }[];
  privacy: CommunityPrivacy;
  moderators: PassportInterface[];
  participants: PassportInterface[];
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
interface VerifyOTPIT extends JwtTokenResult {
  __typename: string;
}

// LOCAL REGISTRATION OBJECT TYPE
interface RegistrationInfo {
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

interface ShowModal {
  community: string[];
}

export type VerifyOTPInterface = { validateOtp: VerifyOTPIT };

export type RefreshTokenInterface = { refreshToken: VerifyOTPIT };

export type GenerateFirebaseTokenIT = { generateFirebaseToken: VerifyOTPIT };

// GENERATE STREAMS TOKEN REQUEST (RESPONSE) TYPE
export type GenerateStreamsTokenRequestInterface = {
  generateStreamsToken: VerifyOTPIT;
};

// SERVER CREATE ACCOUNT (RESPONSE) TYPE
export type CreateAccountInterface = {
  createPassport: { success: boolean; _id: string };
};

// USER PASSPORT (RESPONSE) TYPE
export type MyPassportInterface = { myPassport: PassportInterface };

// USER CONNECTIONS (RESPONSE) TYPE
export type MyConnectionsInterface = {
  myConnections: { data: PassportInterface[]; metadata: QueryMetadata };
};

// COMMUNITY USER SINGLE PASSPORT (RESPONSE) TYPE
export type UserPassportInterface = { singlePassport: PassportInterface };

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
