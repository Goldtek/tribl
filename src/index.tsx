import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerStackNavigator from './navigator/sideNavigator';
import TriblPayNavigator from './navigator/triblPayNavigator';
import SignupNavigator from './navigator/signupNavigator';
import { navigationRef } from './constants';
import { useThemeContext } from './theme';
import Screens from './screens';
import linking from './linking';
import BottomNavigator from './navigator/bottomNavigator';
import CustomDrawer from './navigator/sideNavigator/customDrawer';
import AccountNavigator from './navigator/accountNavigator';

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const { fonts, colors } = useThemeContext();

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <RootStack.Navigator
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
          name="SplashScreen"
          component={Screens.SplashScreen}
        />

        <RootStack.Screen
          name="WalkThroughScreen"
          component={Screens.WalkThroughScreen}
        />

        <RootStack.Screen name="SignupScreen" component={SignupNavigator} />

        <RootStack.Screen
          name="DrawerScreen"
          component={DrawerStackNavigator}
        />
        <RootStack.Screen name="TriblPayScreen" component={TriblPayNavigator} />

        <RootStack.Screen
          name="AccountSettingScreen"
          component={AccountNavigator}
        />

        <RootStack.Screen name="CommunityScreen" component={BottomNavigator} />
      </RootStack.Navigator>

      <CustomDrawer />
    </NavigationContainer>
  );
}
