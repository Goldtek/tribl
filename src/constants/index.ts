/*
 ****************************************************************
 ******************    ALL APP CONSTANTS   **********************
 ****************************************************************
 */

import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

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

// GLOBAL ROOT NAVIGATOR

export const navigationRef = React.createRef<NavigationContainerRef>();

export const rootNavigator = {
  navigate(name: string, params: object = {}) {
    navigationRef.current?.navigate(name, params);
  }
};
