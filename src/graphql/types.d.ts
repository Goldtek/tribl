import { Resolvers } from 'apollo-client';
import { ApolloCache } from 'apollo-cache';
import { JwtTokenResult } from '../constants';

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
