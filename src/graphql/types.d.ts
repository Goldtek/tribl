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
  receiverAvatar: string;
  receiverId: string;
  receiverName: string;
  senderAvatar: string;
  senderId: string;
  senderName: string;
  type: IFCMMessageTypes;
};

export interface PassportInterface {
  id: string;
  bio: string;
  email: string;
  avatar: string;
  dob: _Neo4jDate;
  lastName: string;
  verified: boolean;
  firstName: string;
  identity: string[];
  interest: string[];
  __typename: string;
  countryCode: string;
  phoneNumber: string;
  birthPlace: Location[];
  presence: UserPresence;
  communityCount: number;
  connectionCount: number;
  connected: Status | null;
  citizenShip: string | null;
  currentLocation: Location[];
  connection: Connection | null;
  status: UserAvailability | null;
  conversation: Conversation | null;
  myConnections: PassportInterface[];
  participantOf?: CommunityInterface[];
}

export interface StoreInterface {
  communitySearchIndex: number;
  userDetails: PassportInterface;
  showMessageNotificationBadge: boolean;
  showConnectionNotificationBadge: boolean;
}

export type ChannelInterface = {
  id: string;
  name: string;
  isMember: boolean;
  isDefault: boolean;
  isPrivate: boolean;
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

export interface CommunityInterface {
  id: string;
  name: string;
  avatar: string;
  isMember: boolean;
  isModerator: boolean;
  description: string;
  membersCount: number;
  channels: ChannelInterface[];
  interests: Interest[];
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
  expires_in: number;
  token_type: string;
  access_token: string;
  refresh_token: string;
  firebase_token: string;
  passport: PassportInterface;
}

// SERVER OTP (RESPONSE) TYPE
export type OTPInterface = {
  sendOtp: { __typename: string; success: boolean };
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

export type VerifyOTPInterface = { validateOtp: VerifyOTPIT };

export type RefreshTokenInterface = { refreshToken: VerifyOTPIT };

export type GenerateFirebaseTokenIT = { generateFirebaseToken: VerifyOTPIT };

// SERVER CREATE ACCOUNT (RESPONSE) TYPE
export type CreateAccountInterface = {
  createPassport: { success: boolean; _id: string };
};

// USER PASSPORT (RESPONSE) TYPE
export type MyPassportInterface = { myPassport: PassportInterface };

// USER CONNECTIONS (RESPONSE) TYPE
export type MyConnectionsInterface = { myConnections: PassportInterface[] };

// COMMUNITY USER SINGLE PASSPORT (RESPONSE) TYPE
export type UserPassportInterface = { singlePassport: PassportInterface };

// USER SELECTABLE IDENTITIES (RESPONSE) TYPE
export type IdentitiesInterface = {
  Identity: { name: string; id: string }[];
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
  recommendedMembers: PassportInterface[];
};

// RECOMMENDED COMMUNITIES REQUEST (RESPONSE) TYPE
export type RecommendedCommunitiesRequestInterface = {
  recommendedCommunities: CommunityInterface[];
};

// MY COMMUNITIES REQUEST (RESPONSE) TYPE
export type MyCommunitiesRequestInterface = {
  myCommunities: CommunityInterface[];
};

// NEARBY MEMBERS REQUEST (RESPONSE) TYPE
export type NearbyMembersRequestInterface = {
  nearbyMembers: PassportInterface[];
};

// COMMUNITY MEMBERS REQUEST (RESPONSE) TYPE
export type CommunityMembersRequestInterface = {
  communityMembers: PassportInterface[];
};

// ALL MEMBERS REQUEST (RESPONSE) TYPE
export type AllMembersRequestInterface = {
  Passport: PassportInterface[];
};

// ALL MEMBERS REQUEST (RESPONSE) TYPE
export type SinglePassportRequestInterface = {
  singlePassport: PassportInterface;
};

// COMMUNITY CHANNEL REQUEST (RESPONSE) TYPE
export type CommunityChannelRequestInterface = {
  Channel: ChannelInterface[];
};

// SHOW MESSAGE NOTIFICATION REQUEST (RESPONSE) TYPE
export type ShowMessageNotificationBadge = {
  showMessageNotificationBadge: boolean;
};

// SHOW NOTIFICATION REQUEST (RESPONSE) TYPE
export type ShowConnectionNotificationBadge = {
  showConnectionNotificationBadge: boolean;
};

// USER COMMUNITY CHANNEL REQUEST LIST (RESPONSE) TYPE
export type MyChannelRequestInterface = {
  myChannels: { id: string; name: string }[];
};

// USER CONNECTIONS REQUESTS (RESPONSE) TYPE
export type ConnectionRequestsInterface = {
  connectionRequests: PassportInterface[];
};
