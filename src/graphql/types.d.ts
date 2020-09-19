import { Resolvers } from 'apollo-client';
import { ApolloCache } from 'apollo-cache';

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
  lat: number | null;
  long: number | null;
  country: string;
  state: string;
  __typename: string;
};

enum UserAvailability {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE'
}

export enum Status {
  PENDING = 'PENDING',
  NOT_CONNECTED = 'NOT_CONNECTED',
  BLOCKED = 'BLOCKED',
  ACCEPTED = 'ACCEPTED',
  CONNECTED = 'CONNECTED'
}

enum SubscriptionEventType {
  USER_PRESENCE
}

type _Neo4jDate = {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
  nanosecond: number;
  timeZoneOffsetSeconds: number;
  timeZoneId: number | null;
  formatted: string | null;
  __typename: string;
};

type UserPresence = {
  type: SubscriptionEventType;
  status: UserAvailability;
  lastSeen: _Neo4jDate;
  _id: String;
};

type DirectMessage = {
  id: String;
  conversationId: String;
  senderId: String;
  receiverId: String;
  content: String;
  createdAt: _Neo4jDate;
  readAt: _Neo4jDate;
};

type MessageRequest = {
  id: String;
  senderId: String;
  approvedAt?: _Neo4jDate;
  createdAt: _Neo4jDate;
};

type Spam = {
  id: String;
  directMessage: DirectMessage;
};

type Conversation = {
  id: string;
  spam: Spam;
  messageRequest: MessageRequest;
  participants: PassportInterface;
  createdAt: _Neo4jDate;
  updatedAt: _Neo4jDate;
};

export interface PassportInterface {
  id: string;
  email: string;
  avatar: string;
  dob: _Neo4jDate;
  lastName: string;
  interest: string[];
  identity: string[];
  firstName: string;
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
  status: UserAvailability | null;
  conversation: Conversation | null;
}

export interface StoreInterface {
  userDetails: PassportInterface;
  communitySearchIndex: number;
}

/*
 *************************************************************
 ******************    APOLLO SERVER    **********************
 *******************   STORE TYPES     ***********************
 *************************************************************
 */

// SERVER JWT (RESPONSE) TYPE
export interface JwtTokenResult {
  firebase_token: string;
  refresh_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
  verified: boolean;
  id_token: string;
  exists: boolean;
  scope: string;
  _id: string;
}

// SERVER OTP (RESPONSE) TYPE
export type OTPInterface = {
  sendOtp: { __typename: string; success: boolean };
};

// SERVER VERIFY OTP (RESPONSE) TYPE
interface VerifyOTPIT extends JwtTokenResult {
  __typename: string;
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
