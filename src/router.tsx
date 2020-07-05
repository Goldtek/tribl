import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavigator from './navigator/bottomNavigator';
import AuthNavigator from './navigator/authNavigator';
import { useThemeContext } from './theme';
import Screens from './screens';

const RootStack = createStackNavigator();

export default function AppNavigator() {
  const { fonts, colors } = useThemeContext();

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="SignupScreen"
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

        <RootStack.Screen name="SignupScreen" component={AuthNavigator} />

        <RootStack.Screen name="LoginScreen" component={Screens.LoginScreen} />

        <RootStack.Screen name="CommunityScreen" component={BottomNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
