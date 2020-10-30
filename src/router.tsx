import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerStackNavigator from './navigator/sideNavigator';
import SignupNavigator from './navigator/signupNavigator';
import { navigationRef } from './constants';
import { useThemeContext } from './theme';
import Screens from './screens';
import { tagScreenName } from './utils/uxcamHelper';

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const { fonts, colors } = useThemeContext();

  useEffect(() => {
    tagScreenName('SplashScreen');
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
          headerBackTitleStyle: {
            fontFamily: fonts.WORK_SANS_MEDIUM,
            color: colors.PRIMARY_TEXT,
            fontSize: fonts.MEDIUM_SIZE,
            textTransform: 'capitalize'
          }
        }}
      >
        <RootStack.Screen
          name="WalkThroughScreen"
          component={Screens.WalkThroughScreen}
        />

        <RootStack.Screen
          name="SplashScreen"
          component={Screens.SplashScreen}
        />

        <RootStack.Screen name="SignupScreen" component={SignupNavigator} />

        <RootStack.Screen
          name="CommunityScreen"
          component={DrawerStackNavigator}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
