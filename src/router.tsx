import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupNavigator from './navigator/signupNavigator';
import { useThemeContext } from './theme';
import Screens from './screens';
import DrawerStackNavigator from './navigator/sideNavigator';

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const { fonts, colors } = useThemeContext();

  return (
    <NavigationContainer>
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
