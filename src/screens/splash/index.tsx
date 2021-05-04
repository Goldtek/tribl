import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import { VerifyOTPIT, RegistrationInfo } from '../../graphql/types';
import {
  GET_USER_PASSPORT,
  GET_ALL_MEMBERS,
  GET_NEARBY_MEMBERS,
  GET_POPULAR_COMMUNITIES,
  GET_RECOMMENDED_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS,
  GET_MY_COMMUNITIES,
  USER_CHANNELS
} from '../../graphql/server/query';
import { tagScreenName } from '../../utils/uxcamHelper';
import { crashlytics } from '../../firebase/config';
import { refreshToken } from '../../network/query';
import { NavigationInterface } from '../types';
import Storage from '../../libs/storage';
import { PAGINATION_DEFAULT } from '../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

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

  const handleAuthentication = async () => {
    try {
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

      if (!credentials.appVersion) {
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
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
      return navigation.replace('SignupScreen');
    }
  };

  useEffect(() => {
    tagScreenName('SplashScreen');
    handleAuthentication();
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
