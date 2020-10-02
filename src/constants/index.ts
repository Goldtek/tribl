/*
 ****************************************************************
 ******************    ALL APP CONSTANTS   **********************
 ****************************************************************
 */

import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

// ALL ASYNC STORAGE CONSTANTS
export const USER_FIRST_LAUNCH = '@FIRST_TIME_LAUNCH';
export const USER_REG_INFO: string = '@USER_REG_INFO';

// ALL PAGE LOGICAL CONSTANTS
export const PAGINATION_DEFAULT: number = 15;
export const LANGUAGE_DEFAULT: string = 'en';

// APP HEADER SETTING
export const GLOBAL_HEADER_STYLE = {
  shadowOpacity: 0,
  shadowOffset: { height: 0, width: 0 },
  shadowRadius: 0,
  elevation: 0
};

// USER DEFAULT AVATAR
export const USER_DEFAULT_AVATAR = `https://drive.google.com/uc?view=&id=14SY6cRWX2ojTeynq1d_E9O1aIA-2l5Jp`;

// GLOBAL ROOT NAVIGATOR
export const navigationRef = React.createRef<NavigationContainerRef>();

export const rootNavigator = {
  navigate(name: string, params: object = {}) {
    navigationRef.current?.navigate(name, params);
  }
};
