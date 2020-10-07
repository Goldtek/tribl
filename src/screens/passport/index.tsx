import React, { useState, Fragment, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import * as Location from 'expo-location';
import * as Updates from 'expo-updates';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import FastImage from 'react-native-fast-image';
import { Share, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Title,
  Paragraph,
  Button,
  ActivityIndicator
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
// import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationInterface } from '../types';
import { useThemeContext } from '../../theme';
import TabViewSlider from './widgets/tabs';
import {
  GET_ALL_MEMBERS,
  GET_CONNECTION_REQUEST,
  GET_FIREBASE_TOKEN,
  GET_MY_COMMUNITIES,
  GET_MY_CONNECTIONS,
  GET_NEARBY_MEMBERS,
  GET_POPULAR_COMMUNITIES,
  GET_RECOMMENDED_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS,
  GET_USER_PASSPORT
} from '../../graphql/server/query';
import {
  GenerateFirebaseTokenIT,
  MyPassportInterface,
  PassportInterface
} from '../../graphql/types';
import { UPDATE_PASSPORT } from '../../graphql/server/mutations';
import PassportSkeleton from './widgets/passportSkeleton';
import Storage from '../../libs/storage';
import Firechat from '../../firebase';
import CheckAppUpdates from '../../libs/updates';
import Notification from '../../libs/notification';
import { CHANGE_CONNECTION_NOTIFICATION_BADGE } from '../../graphql/cache/mutations';

// IMPORT FOR ALL CUSTOM STYLES
import {
  HeaderContainer,
  ImageContainer,
  ImageTextContainer,
  Connection,
  ConnectionCover,
  Cover
  // ImageIconContainer,
  // SocialMediaButton
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

interface StateProps extends PassportInterface {
  date: string;
  click?: boolean;
  selectedId: string[];
}

export default function PassportScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top: paddingTop } = useSafeAreaInsets();
  const { t } = useTranslation();

  const { loading: dataLoading, data: userData, refetch } = useQuery<
    MyPassportInterface
  >(GET_USER_PASSPORT);

  const { data: firebase, loading: firebaseLoading } = useQuery<
    GenerateFirebaseTokenIT
  >(GET_FIREBASE_TOKEN);

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const [getMyCommunities] = useLazyQuery(GET_MY_COMMUNITIES);

  const [getRecommendedCommunities] = useLazyQuery(GET_RECOMMENDED_COMMUNITIES);

  const [getRecommendedMembers] = useLazyQuery(GET_RECOMMENDED_MEMBERS);

  const [getPopularCommunities] = useLazyQuery(GET_POPULAR_COMMUNITIES);

  const [getConnectionRequest, { data: connectionRequestData }] = useLazyQuery(
    GET_CONNECTION_REQUEST
  );

  const [getNearbyMembers] = useLazyQuery(GET_NEARBY_MEMBERS);

  const [getMyConnections] = useLazyQuery(GET_MY_CONNECTIONS);

  const [getAllMembers] = useLazyQuery(GET_ALL_MEMBERS);

  const userDetails = userData?.myPassport;
  const identity = userDetails?.identity.map((item: any) => item.id);
  const dateOfBirth = userDetails?.dob;
  const [imageLoad, setImageLoad] = useState(true);
  const [update, setUpdate] = useState(false);
  const [state, setState] = useState<{
    details: StateProps;
    identity: string[] | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    dob: {
      day: number | null | undefined;
      month: number | null | undefined;
      year: number | null | undefined;
    };
  }>({
    //@ts-ignore
    details: {},
    firstName: userDetails?.firstName,
    lastName: userDetails?.lastName,
    identity: identity,
    dob: {
      day: null,
      month: null,
      year: null
    }
  });
  const [OTAUpdate, setOTAUpdate] = useState(false);
  const [location, setLocation] = useState<{
    city?: string;
    state?: string | null | undefined;
    country?: string;
    lat?: number | null;
    long?: number | null;
  }>({
    city: userDetails?.currentLocation[0]?.city,
    state: userDetails?.currentLocation[0]?.state,
    country: userDetails?.currentLocation[0]?.country,
    lat: userDetails?.currentLocation[0]?.lat,
    long: userDetails?.currentLocation[0]?.long
  });

  const [birthPlace, setBirthPlace] = useState<{
    city?: string;
    state?: string | null | undefined;
    country?: string;
    lat?: number | null;
    long?: number | null;
  }>({
    city: '',
    state: '',
    country: '',
    lat: 0,
    long: 0
  });

  const firstName = state?.details?.firstName;
  const lastName = state?.details?.lastName;
  const dob = state?.details?.date?.split('/');
  const day = dob?.length ? parseInt(dob[0]) : dateOfBirth?.day;
  const month = dob?.length ? parseInt(dob[1]) : dateOfBirth?.month;
  const year = dob?.length ? parseInt(dob[2]) : dateOfBirth?.year;
  const identityID = state?.details?.selectedId || [];
  const SelectedIdentitiesID = Array.from(identityID?.values());

  useEffect(() => {
    //@ts-ignore
    setUpdate(state.details.click);
  }, [state.details]);

  useEffect(() => {
    if (connectionRequestData?.connectionRequests.length) {
      changeConnectionNotification({
        variables: { showConnectionNotificationBadge: true }
      });
    }
  }, [connectionRequestData?.connectionRequests.length]);

  useEffect(() => {
    if (SelectedIdentitiesID?.length > 0) {
      setState({
        ...state,
        identity: SelectedIdentitiesID
      });
    }
  }, [SelectedIdentitiesID?.length]);

  useEffect(() => {
    if (firstName?.length || lastName?.length) {
      setState({
        ...state,
        firstName: firstName,
        lastName: lastName
      });
    }
  }, [firstName?.length, lastName?.length]);

  useEffect(() => {
    setBirthPlace({
      ...birthPlace,
      city: userDetails?.birthPlace[0]?.city,
      state: userDetails?.birthPlace[0]?.state,
      country: userDetails?.birthPlace[0]?.country,
      long: userDetails?.birthPlace[0]?.long,
      lat: userDetails?.birthPlace[0]?.lat
    });

    if (!location.city?.length) {
      setLocation({
        city: userDetails?.currentLocation[0]?.city,
        state: userDetails?.currentLocation[0]?.state,
        country: userDetails?.currentLocation[0]?.country,
        lat: userDetails?.currentLocation[0]?.lat,
        long: userDetails?.currentLocation[0]?.long
      });
    }
  }, [userDetails?.id]);

  useEffect(() => {
    setState({
      ...state,
      identity: identity
    });
  }, [identity?.length]);

  useEffect(() => {
    handleLocationPermission();
    getRecommendedCommunities();
    getRecommendedMembers();
    getPopularCommunities();
    getConnectionRequest();
    getMyCommunities();
    getNearbyMembers();
    getMyConnections();
    getAllMembers();
  }, []);

  useEffect(() => {
    const updateLocation = async () => {
      try {
        await updatePassport();
        refetch();
      } catch (error) {
        Sentry.captureException(error);
      }
    };
    if (
      location.city?.length &&
      birthPlace.state?.length &&
      state.identity?.length &&
      day
    )
      updateLocation();
  }, [state.identity]);

  useEffect(() => {
    if (firebase?.generateFirebaseToken) {
      Storage.setUserCredentials(firebase?.generateFirebaseToken);
      Firechat.signIn(firebase?.generateFirebaseToken.firebase_token);
    }
    checkUpdate();
  }, [firebaseLoading]);

  const checkUpdate = async () => {
    const update = await Updates.checkForUpdateAsync();
    setOTAUpdate(update.isAvailable);
  };

  const cancelUpdate = () => setOTAUpdate(false);

  const handleLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.Highest
      });

      const [currentLocation] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude
      });

      const { city, region, country } = currentLocation;

      if (currentLocation) {
        setLocation({
          ...location,
          city: city,
          state: region,
          country: country,
          lat: coords.latitude,
          long: coords.longitude
        });
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const [updatePassport, { loading }] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        firstName: state.firstName,
        lastName: state.lastName,
        dob: {
          day: day,
          month: month,
          year: year
        },
        identity: state.identity,
        currentLocation: {
          city: location.city,
          state: location.state,
          country: location.country,
          long: location.long,
          lat: location.lat
        },
        birthPlace: {
          city: birthPlace.city,
          state: birthPlace.state,
          country: birthPlace.country,
          long: birthPlace.long,
          lat: birthPlace.lat
        }
      }
    }
  });

  const handleLocationPermission = async () => {
    const iosData = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    const andriodData = await check(
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
    );
    if (iosData === 'granted' || andriodData === 'granted') {
      handleLocation();
    } else if (
      iosData === 'denied' ||
      andriodData === 'denied' ||
      iosData === 'blocked' ||
      andriodData === 'blocked'
    ) {
      const iosData2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      const andriodData2 = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
      );
      iosData2 === 'granted' || andriodData2 === 'granted'
        ? handleLocation()
        : null;
    }
  };

  const onShare = async () => {
    try {
      const { action } = await Share.share(
        {
          title: t(`signup.passportScreen.title`),
          message: t(`signup.passportScreen.sharePassportMessage`)
        },
        { dialogTitle: t(`signup.passportScreen.title`) }
      );

      if (action === Share.dismissedAction) return;

      // PROFILE SHARED HERE
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const getUserDetails = (childData: any) => {
    setState({
      ...state,
      details: childData
    });
  };

  const handleRequest = async () => {
    try {
      await updatePassport();
      refetch();
      setUpdate(false);
    } catch (error) {
      Sentry.captureException(error);
      setUpdate(false);
    }
  };

  return (
    <Notification>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.PRIMARY,
          paddingTop: RFValue(paddingTop)
        }}
      >
        <StatusBar translucent animated style="light" />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: colors.WHITE,
            marginTop: RFValue(20),
            paddingBottom: RFValue(20)
          }}
        >
          {dataLoading ? (
            <PassportSkeleton />
          ) : (
            <Fragment>
              <HeaderContainer>
                <Cover>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_BOLD,
                      fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
                      color: colors.WHITE,
                      textTransform: 'capitalize',
                      lineHeight: RFValue(30)
                    }}
                  >
                    {t(`signup.passportScreen.title`)}
                  </Title>
                  {update ? (
                    <Button
                      labelStyle={{
                        color: colors.WHITE,
                        fontSize: RFValue(14),
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                        textTransform: 'capitalize'
                      }}
                      onPress={handleRequest}
                      loading={loading}
                    >
                      {t(`signup.passportScreen.update`)}
                    </Button>
                  ) : null}
                </Cover>
                <ImageContainer>
                  <FastImage
                    source={{
                      uri: userDetails?.avatar,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadEnd={() => setImageLoad(false)}
                    style={{
                      width: RFValue(120),
                      height: RFValue(120),
                      justifyContent: 'center',
                      borderRadius: 4
                    }}
                  >
                    {imageLoad && (
                      <ActivityIndicator
                        animating={true}
                        size={RFValue(50)}
                        color={colors.WHITE}
                      />
                    )}
                  </FastImage>

                  <ImageTextContainer>
                    <Paragraph
                      style={{
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                        fontSize: RFValue(fonts.LARGE_SIZE - 2),
                        paddingRight: 20,
                        lineHeight: 21,
                        color: colors.WHITE,
                        textTransform: 'capitalize'
                      }}
                    >
                      {`${userDetails?.firstName} ${userDetails?.lastName}`}
                    </Paragraph>
                    {userDetails?.currentLocation[0].city ? (
                      <Paragraph
                        style={{
                          fontFamily: fonts.WORK_SANS_REGULAR,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          paddingRight: 20,
                          lineHeight: 16,
                          color: colors.WHITE,
                          textTransform: 'capitalize'
                        }}
                      >
                        {`${userDetails?.currentLocation[0].city}, ${userDetails?.currentLocation[0].state}`}
                      </Paragraph>
                    ) : (
                      <Paragraph
                        style={{
                          fontFamily: fonts.WORK_SANS_REGULAR,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          paddingRight: 20,
                          lineHeight: 16,
                          color: colors.WHITE,
                          textTransform: 'capitalize'
                        }}
                      >
                        {`${userDetails?.currentLocation[0].state}, ${userDetails?.currentLocation[0].country}`}
                      </Paragraph>
                    )}
                    <ConnectionCover>
                      <Connection>
                        <Paragraph
                          style={{
                            color: colors.WHITE,
                            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                            fontSize: fonts.LARGE_SIZE + 1,
                            lineHeight: 20
                          }}
                        >
                          {userDetails?.connectionCount}
                        </Paragraph>
                        <Paragraph
                          style={{
                            fontSize: fonts.MEDIUM_SIZE - 1,
                            fontFamily: fonts.WORK_SANS_REGULAR,
                            color: colors.WHITE,
                            textTransform: 'uppercase',
                            lineHeight: 13
                          }}
                        >
                          {t(`community.memberPassport.connection`)}
                        </Paragraph>
                      </Connection>
                      <Connection>
                        <Paragraph
                          style={{
                            color: colors.WHITE,
                            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                            fontSize: fonts.LARGE_SIZE + 1,
                            lineHeight: 20
                          }}
                        >
                          {userDetails?.communityCount}
                        </Paragraph>
                        <Paragraph
                          style={{
                            fontSize: fonts.MEDIUM_SIZE - 1,
                            fontFamily: fonts.WORK_SANS_REGULAR,
                            color: colors.WHITE,
                            textTransform: 'uppercase',
                            lineHeight: 13
                          }}
                        >
                          {t(`community.memberPassport.community`)}
                        </Paragraph>
                      </Connection>
                    </ConnectionCover>

                    {/* <ImageIconContainer>
                <SocialMediaButton
                  onPress={() => console.log('Pressed')}
                  underlayColor={colors.DISABLED}
                >
                  <FontAwesome
                    name="spotify"
                    size={RFValue(30)}
                    color={colors.WHITE}
                  />
                </SocialMediaButton>
                <SocialMediaButton
                  onPress={() => console.log('Pressed')}
                  underlayColor={colors.DISABLED}
                >
                  <FontAwesome
                    name="instagram"
                    size={RFValue(30)}
                    color={colors.WHITE}
                  />
                </SocialMediaButton>
              </ImageIconContainer>
            
             */}
                  </ImageTextContainer>
                </ImageContainer>

                <Button
                  icon={{
                    uri:
                      'https://img.icons8.com/ios-filled/96/000000/share-3.png'
                  }}
                  mode="text"
                  color={colors.WHITE}
                  uppercase={false}
                  loading={false}
                  labelStyle={{
                    fontFamily: fonts.WORK_SANS_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    textTransform: 'capitalize'
                  }}
                  contentStyle={{
                    height: RFValue(55),
                    backgroundColor: colors.PRIMARY_LIGHT
                  }}
                  style={{
                    width: '100%',
                    height: RFValue(55),
                    marginTop: RFValue(10)
                  }}
                  onPress={onShare}
                >
                  {t(`signup.passportScreen.sharePassport`)}
                </Button>
              </HeaderContainer>
              <TabViewSlider getUserDetails={getUserDetails} />
            </Fragment>
          )}
        </ScrollView>

        {OTAUpdate ? <CheckAppUpdates cancelUpdate={cancelUpdate} /> : null}
      </SafeAreaView>
    </Notification>
  );
}
