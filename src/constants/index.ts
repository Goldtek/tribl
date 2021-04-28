/*
 ****************************************************************
 ******************    ALL APP CONSTANTS   **********************
 ****************************************************************
 */

import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

// ALL ASYNC STORAGE CONSTANTS
export const USER_EULA = '@USER_EULA';
export const USER_FIRST_LAUNCH = '@FIRST_TIME_LAUNCH';
export const USER_REG_INFO: string = '@USER_REG_INFO';
export const USER_FCM_TOKEN: string = '@USER_FCM_TOKEN';
export const USER_PASSPORT_INFO: string = '@USER_PASSPORT_INFO';
export const LOCAL_GIPHY_CACHE: string = '@LOCAL_GIPHY_CACHE';
export const SHOW_MODAL: string = '@SHOW_MODAL';

// EXPO RELEASE CHANNELS UPDATE CONSTANTS
const DEVELOPMENT = 'development_channel';
const STAGING: string = 'staging_channel';
const PRODUCTION: string = 'production_channel';
const CURRENTLY_USED_STAGING_CHANNEL: string = `staging_channel_with_ota`;
const CURRENTLY_USED_PRODUCTION_CHANNEL: string = `production_channel_with_ota`;
const CURRENTLY_USED_DEVELOPMENT_CHANNEL: string = `development_channel_with_ota`;

// ALL PAGE LOGICAL CONSTANTS
export const PAGINATION_DEFAULT: number = 20;
export const LANGUAGE_DEFAULT: string = 'en';

// APP HEADER SETTING
export const GLOBAL_HEADER_STYLE = {
  shadowOpacity: 0,
  shadowOffset: { height: 0, width: 0 },
  shadowRadius: 0,
  elevation: 0
};

// DEFAULT ANDROID PUSH NOTIFICATION CHANNEL_ID
export const DEFAULT_NOTIFICATION_CHANNEL_ID = 'TRiBL_default_channel';

// USER DEFAULT AVATAR
export const USER_DEFAULT_AVATAR = `https://drive.google.com/uc?view=&id=14SY6cRWX2ojTeynq1d_E9O1aIA-2l5Jp`;

// GIHPY DEFAULT URL
export const GIHPY_DEFAULT_URL = `https://api.giphy.com/v1`;

// CLOUDINARY BANNER FIX
export const CLOUDINARY_BANNER = `upload/c_fill,g_auto,h_350,w_970/b_rgb:000000,y_-0.60/c_scale,co_rgb:ffffff,fl_relative,w_0.9,y_1/`;

// CLOUDINARY THUMBNAIL FIX
export const CLOUDINARY_THUMBNAIL = 'upload/c_thumb,w_200,g_face/';

// GLOBAL ROOT NAVIGATOR
export const navigationRef = React.createRef<NavigationContainerRef>();

// PRIVACY_POLICY_LINK
export const PRIVACY_POLICY_LINK = `https://www.privacypolicies.com/live/b2a8dff8-b285-46ab-af15-c53623008a86`;

export const rootNavigator = {
  navigate(name: string, params: object = {}) {
    navigationRef.current?.navigate(name, params);
  }
};
