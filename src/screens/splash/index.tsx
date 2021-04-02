import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import {
  VerifyOTPIT,
  RegistrationInfo,
  GenerateFirebaseTokenIT
} from '../../graphql/types';
import {
  GET_USER_PASSPORT,
  GET_FIREBASE_TOKEN,
  GET_ALL_MEMBERS,
  GET_NEARBY_MEMBERS,
  GET_POPULAR_COMMUNITIES,
  GET_RECOMMENDED_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS,
  GET_MY_COMMUNITIES,
  USER_CHANNELS
} from '../../graphql/server/query';
import * as ExpoSplashScreen from 'expo-splash-screen';
import loadResources from '../../libs/loadResources';
import { tagScreenName } from '../../utils/uxcamHelper';
import { crashlytics } from '../../firebase/config';
import { refreshToken } from '../../network/query';
import { APP_VERSION } from '../../utils/device';
import { NavigationInterface } from '../types';
import Storage from '../../libs/storage';
import Firechat from '../../firebase';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import { PAGINATION_DEFAULT } from '../../constants';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SplashScreen(props: ScreenProp) {
  const { navigation } = props;

  const [getUserPassport] = useLazyQuery(GET_USER_PASSPORT);

  const [getMyCommunities] = useLazyQuery(GET_MY_COMMUNITIES);

  const [getMyChannels] = useLazyQuery(USER_CHANNELS);

  const [getRecommendedCommunities] = useLazyQuery(GET_RECOMMENDED_COMMUNITIES);

  const [getRecommendedMembers] = useLazyQuery(GET_RECOMMENDED_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2 } }
  });

  const [getPopularCommunities] = useLazyQuery(GET_POPULAR_COMMUNITIES, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
  });

  const [getAllMembers] = useLazyQuery(GET_ALL_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT } }
  });

  const [getNearbyMembers] = useLazyQuery(GET_NEARBY_MEMBERS, {
    variables: { input: { limit: 8 } }
  });

  const [authenticateFirebase, { data: firebase }] = useLazyQuery<
    GenerateFirebaseTokenIT
  >(GET_FIREBASE_TOKEN);

  const handleAuthentication = async () => {
    try {
      await loadResources();
      await ExpoSplashScreen.hideAsync();
      const value = await Storage.checkInitialLaunch();

      if (!value) {
        return navigation.replace('WalkThroughScreen');
      }

      const userCredStorageData = await Storage.getUserCredentials();
      const userRegStorageData = await Storage.getUserRegistration();

      if (!userCredStorageData || !userRegStorageData) {
        return navigation.replace('SignupScreen');
      }

      const credentials = JSON.parse(userCredStorageData) as VerifyOTPIT;
      const userRegistration: RegistrationInfo = JSON.parse(userRegStorageData);

      if (!credentials.appVersion || credentials.appVersion !== APP_VERSION) {
        return navigation.replace('SignupScreen');
      }

      if (!userRegistration.completed) {
        return navigation.replace('SignupScreen', {
          screen: userRegistration.route
        });
      }

      const { data } = await refreshToken(credentials.refresh_token);
      await Storage.setUserCredentials(data.refreshToken);
      navigation.replace(userRegistration.route);
    } catch (error) {
      crashlytics.recordError(new Error(error));
      return navigation.replace('SignupScreen');
    }
  };

  useEffect(() => {
    tagScreenName('SplashScreen');
    if (firebase?.generateFirebaseToken) {
      Storage.setUserCredentials(firebase?.generateFirebaseToken);
      Firechat.signIn(firebase?.generateFirebaseToken.firebase_token);
    }
  }, [firebase]);

  useEffect(() => {
    handleAuthentication();
    authenticateFirebase();
    getUserPassport();
    getMyCommunities();
    getMyChannels();
    getRecommendedCommunities();
    getRecommendedMembers();
    getPopularCommunities();
    getAllMembers();
    getNearbyMembers();
  }, []);

  return (
    <Container>
      <Image
        source={require('../../../assets/images/splash.png')}
        style={[
          StyleSheet.absoluteFill,
          { width: undefined, height: undefined, resizeMode: 'contain' }
        ]}
      />
    </Container>
  );
}
