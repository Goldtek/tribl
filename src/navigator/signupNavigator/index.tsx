import React, { useState } from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import { Button } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Screens from '../../screens/signup';
import GetStartedNavigator from './getStartedNavigator';
import { useThemeContext } from '../../theme';
import { useTranslation } from 'react-i18next';
import { DEVICE_OS } from '../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { GET_USER_DETAILS } from '../../graphql/cache/query';
import { StoreInterface, UpdatePassportInterface } from '../../graphql/types';
import { UPDATE_USER_PASSPORT } from '../../graphql/server/mutations';

const SignupStack = createStackNavigator();
let routeNames = [] as string[];

export default function SignupNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);

  const [update, setUpdate] = useState(false);

  const userDetails = data?.userDetails;

  const currentLocation = userDetails?.currentLocation[0];
  const birthPlace = userDetails?.birthPlace[0];

  const [updatePassport] = useMutation<UpdatePassportInterface>(
    UPDATE_USER_PASSPORT,
    {
      variables: {
        payload: {
          dob: {
            day: userDetails?.dob.day,
            month: userDetails?.dob.month,
            year: userDetails?.dob.year
          },
          avatar: userDetails?.avatar,
          lastName: userDetails?.lastName,
          firstName: userDetails?.firstName,
          interest: userDetails?.interest,
          identity: userDetails?.identity,
          currentLocation: {
            lat: currentLocation?.lat,
            long: currentLocation?.long,
            country: currentLocation?.country,
            state: currentLocation?.state
          },
          birthPlace: {
            lat: birthPlace?.lat,
            long: birthPlace?.long,
            country: birthPlace?.country,
            state: birthPlace?.state
          }
        }
      }
    }
  );

  return (
    <SignupStack.Navigator
      screenOptions={({ route, navigation }) => {
        const headerTitle = t(`signup.userRegSteps.${[route.name]}`);

        const navigationState = navigation.dangerouslyGetState() as {
          routeNames: string[];
        };

        if (!routeNames.length) {
          routeNames = navigationState.routeNames;
        }

        const handleNavigation = async () => {
          const nextRoute = Number(headerTitle.split(' ')[0]) + 1;

          if (headerTitle) {
            return navigation.navigate(routeNames[nextRoute]);
          }

          setUpdate(!update);
          const { data } = await updatePassport();

          if (data?.updatePassport.success) {
            setUpdate(!update);
            navigation.reset({
              index: 0,
              routes: [{ name: 'PassportScreen' }]
            });
          }
        };

        return {
          headerShown: true,
          headerTitle: headerTitle,
          headerTitleStyle: { color: colors.SECONDARY_TEXT },
          headerTintColor: colors.PRIMARY,
          headerBackTitleVisible: false,
          headerPressColorAndroid: colors.PRIMARY,
          headerRight: () => (
            <Button
              mode="text"
              loading={update}
              color={colors.PRIMARY}
              labelStyle={{
                fontSize: fonts.MEDIUM_SIZE,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                color: headerTitle ? colors.PRIMARY : colors.WHITE
              }}
              onPress={handleNavigation}
            >
              {t(headerTitle ? 'signup.skipSignup' : 'signup.finishSignup')}
            </Button>
          ),
          headerLeftContainerStyle: {
            marginLeft: DEVICE_OS === 'ios' ? 13 : 3
          },
          headerRightContainerStyle: { marginRight: 5 },
          headerStyle: GLOBAL_HEADER_STYLE,
          ...TransitionPresets.SlideFromRightIOS
        };
      }}
    >
      <SignupStack.Screen
        name="SignupScreen"
        component={GetStartedNavigator}
        options={{ headerShown: false }}
      />

      <SignupStack.Screen
        name="OTPScreen"
        component={Screens.OTPScreen}
        options={{ headerRight: () => null }}
      />

      <SignupStack.Screen
        name="CreateAccountScreen"
        component={Screens.CreateAccountScreen}
        options={{
          headerRight: () => null,
          headerTitleStyle: {
            marginLeft: DEVICE_OS === 'android' ? RFValue(7) : 0
          }
        }}
      />

      <SignupStack.Screen
        name="AvatarUploadScreen"
        component={Screens.AvatarUploadScreen}
        options={{
          headerTitleStyle: {
            marginLeft: DEVICE_OS === 'android' ? RFValue(7) : 0
          }
        }}
      />

      <SignupStack.Screen
        name="IdentifyUserScreen"
        component={Screens.IdentifyUserScreen}
      />

      <SignupStack.Screen
        name="UserLocationScreen"
        component={Screens.UserLocationScreen}
      />

      <SignupStack.Screen
        name="PassportScreen"
        component={Screens.PassportScreen}
        options={{
          headerTitle: () => null,
          headerStyle: {
            backgroundColor: colors.PRIMARY,
            ...GLOBAL_HEADER_STYLE
          }
        }}
      />
    </SignupStack.Navigator>
  );
}
