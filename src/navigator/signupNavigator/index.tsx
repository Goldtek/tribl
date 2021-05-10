import React, { useState } from 'react';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import { Button } from 'react-native-paper';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import Screens from '../../screens/signup';
import GetStartedNavigator from './getStartedNavigator';
import { useThemeContext } from '../../theme';
import { useTranslation } from 'react-i18next';
import { DEVICE_OS } from '../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { GLOBAL_HEADER_STYLE } from '../../constants';
import { GET_USER_DETAILS } from '../../graphql/cache/query';
import {
  RegistrationInfo,
  StoreInterface,
  UpdatePassportInterface
} from '../../graphql/types';
import { UPDATE_USER_PASSPORT } from '../../graphql/server/mutations';
import Storage from '../../libs/storage';
import { GET_USER_PASSPORT } from '../../graphql/server/query';

const SignupStack = createStackNavigator();
let routeNames = [] as string[];

export default function SignupNavigator() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);

  const [getUserProfile] = useLazyQuery(GET_USER_PASSPORT);

  const [update, setUpdate] = useState(false);

  const userDetails = data?.userDetails;

  const currentLocation = userDetails?.currentLocation;

  const [updatePassport] = useMutation<UpdatePassportInterface>(
    UPDATE_USER_PASSPORT
  );

  return (
    <SignupStack.Navigator
      initialRouteName="AvatarUploadScreen"
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

          const storageData = await Storage.getUserRegistration();

          if (storageData) {
            const userRegInfo = JSON.parse(storageData) as RegistrationInfo;

            const { data } = await updatePassport({
              variables: {
                payload: {
                  bio: userDetails?.bio,
                  dob: userDetails?.dob,
                  avatar: userRegInfo.user?.avatar || userDetails?.avatar,
                  lastName: userRegInfo.user?.lastName || userDetails?.lastName,
                  firstName:
                    userRegInfo.user?.firstName || userDetails?.firstName,
                  identity: {
                    add: userRegInfo.user?.identityName || userDetails?.identity
                  },
                  interest: {
                    add: userDetails?.interest
                  },
                  currentLocation: {
                    lat:
                      currentLocation?.lat ||
                      userRegInfo?.user?.currentLocation?.lat,
                    long:
                      currentLocation?.long ||
                      userRegInfo?.user?.currentLocation?.long,
                    country:
                      currentLocation?.country ||
                      userRegInfo?.user?.currentLocation?.country,
                    state:
                      currentLocation?.state ||
                      userRegInfo?.user?.currentLocation?.state,
                    city:
                      currentLocation?.city ||
                      userRegInfo?.user?.currentLocation?.city
                  }
                }
              }
            });

            if (data?.updatePassport.success) {
              setUpdate(!update);
              await Storage.setUserRegistration({
                route: 'CommunityScreen',
                completed: true
              }).then(() => getUserProfile());

              navigation.reset({
                index: 0,
                routes: [{ name: 'CommunityScreen' }]
              });
            }
          }
        };

        return {
          headerShown: true,
          headerTitle: headerTitle,
          headerTitleStyle: { color: colors.SECONDARY_TEXT },
          headerTintColor: colors.PRIMARY,
          headerBackTitleVisible: false,
          headerPressColorAndroid: colors.PRIMARY,
          headerRight: () =>
            route.name === 'UserLocationScreen' ? null : (
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
        name="SignupPassportScreen"
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
