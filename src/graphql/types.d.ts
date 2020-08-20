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

export interface StoreInterface {
  userDetails: {
    DOB: string;
    email: string;
    avatar: string;
    userId: string;
    countryCode: string;
    firstName: string;
    lastName: string;
    number: string;
    citizenship: string;
    identities: string[];
    interests: string[];
    currentLocation: Location;
    birthPlace: Location;
    __typename: string;
  };
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

export type VerifyOTPInterface = {
  validateOtp: VerifyOTPIT;
};

export type RefreshTokenInterface = {
  refreshToken: VerifyOTPIT;
};

export type GenerateFirebaseTokenIT = {
  generateFirebaseToken: VerifyOTPIT;
};

// SERVER CREATE ACCOUNT (RESPONSE) TYPE
export type CreateAccountInterface = {
  createPassport: {
    success: boolean;
    _id: string;
  };
};

// USER SELECTABLE IDENTITIES (RESPONSE) TYPE
export type IdentitiesInterface = {
  Identity: { name: string; id: string }[];
};

// SERVER UPDATE USER PASSPORT (RESPONSE) TYPE
export type UpdatePassportInterface = {
  success: boolean;
  _id: string;
};
