/*
 ****************************************************************
 ******************    ALL APP CONSTANTS   **********************
 ****************************************************************
 */

// ALL ASYNC STORAGE CONSTANTS
export const USER_FIRST_LAUNCH = '@FIRST_TIME_LAUNCH';
export const USER_AUTH_KEYS: string = '@USER_AUTH_KEYS';

// ALL PAGE LOGICAL CONSTANTS
export const PAGINATION_DEFAULT: number = 15;
export const LANGUAGE_DEFAULT: string = 'en';

// APP HEADER SETTING
export const GLOBAL_HEADER_STYLE = {
  shadowOpacity: 0,
  shadowOffset: { height: 0 },
  shadowRadius: 0,
  elevation: 0
};

// SERVER JWT (RESPONSE) TYPE
export interface JwtTokenResult {
  access_token: string;
  refresh_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
  exists: boolean;
  verified: boolean;
  _id: string;
  refreshToken: {
    id_token: string;
  };
}
