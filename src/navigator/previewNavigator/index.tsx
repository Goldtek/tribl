import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/signup';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { DEVICE_OS } from '../../utils/device';
import { useThemeContext } from '../../theme';

const PreviewStack = createStackNavigator();

export default function GetStartedNavigator() {
  const { colors, fonts } = useThemeContext();

  return (
    <PreviewStack.Navigator
      headerMode="screen"
      screenOptions={{ headerStyle: { height: RFValue(80) } }}
    >
      <PreviewStack.Screen
        name="PreviewScreen"
        options={{
          headerShown: true,
          headerLeft: () => null,
          headerTitle: () => (
            <Image
              source={require('../../../assets/images/logo.png')}
              style={{
                width: RFValue(40),
                height: RFValue(40),
                resizeMode: 'contain'
              }}
            />
          ),
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: {
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 10
          }
        }}
        component={Screens.PreviewScreen}
      />

      <PreviewStack.Screen
        name="TribeDetailScreen"
        component={Screens.TribeDetailScreen}
        options={({ route }: any) => ({
          headerShown: true,
          headerTitle: route.params?.title,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_BOLD
          },
          headerTitleContainerStyle: {
            flex: 1,
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 0
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerStyle: GLOBAL_HEADER_STYLE
        })}
      />

      <PreviewStack.Screen
        name="MemberPassportDetailScreen"
        options={{
          headerShown: true,
          headerTitle: () => null,
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerLeftContainerStyle: {
            paddingLeft: DEVICE_OS === 'ios' ? 20 : 10
          }
        }}
        component={Screens.MemberPassportDetailScreen}
      />

      <PreviewStack.Screen
        name="WaitlistScreen"
        options={{
          headerShown: false
        }}
        component={Screens.WaitlistScreen}
      />
    </PreviewStack.Navigator>
  );
}
