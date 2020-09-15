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

type DirectMessage = {
  id: String;
  conversationId: String;
  senderId: String;
  receiverId: String;
  content: String;
  createdAt: Date;
  readAt: Date;
};

type MessageRequest = {
  id: String;
  senderId: String;
  approvedAt: Date;
  createdAt: !Date;
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
  createdAt: Date;
  updatedAt: Date;
};

export interface PassportInterface {
  id: string;
  dob: {
    day: number;
    month: number;
    year: number;
    formatted: string | null;
    __typename: string;
  };
  email: string;
  avatar: string;
  countryCode: string;
  firstName: string;
  lastName: string;
  status: UserAvailability | null;
  phoneNumber: string;
  citizenShip: string | null;
  connected: Status | null;
  conversation: Conversation | null;
  interest: string[];
  identity: string[];
  connectionCount: number;
  communityCount: number;
  currentLocation: Location[];
  birthPlace: Location[];
  __typename: string;
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
  updateMessageRequest: { success: boolean; __typename: string };
};

// DELETE MESSAGE REQUEST (RESPONSE) TYPE
export type DeleteMessageRequestInterface = {
  deleteMessageRequest: { success: boolean; __typename: string };
};
