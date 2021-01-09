// @ts-nocheck
import React, { useState, Fragment, useEffect, useLayoutEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Mixpanel } from '../../config';
import * as Location from 'expo-location';
import * as Updates from 'expo-updates';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import FastImage from 'react-native-fast-image';
import { Share, ScrollView, SafeAreaView } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import SingleImage from '../../libs/react-native-zoom-lightbox';
import { Title, Paragraph, Button, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
// import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationInterface } from '../types';
import { useThemeContext } from '../../theme';
import TabViewSlider from './widgets/tabs';
import { userDetails as cacheData } from '../../graphql/cache';
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
  GET_USER_PASSPORT,
  USER_CHANNELS
} from '../../graphql/server/query';
import {
  GenerateFirebaseTokenIT,
  MyPassportInterface,
  PassportInterface
} from '../../graphql/types';
import { UPDATE_PASSPORT } from '../../graphql/server/mutations';
import Storage from '../../libs/storage';
import Firechat from '../../firebase';
import CheckAppUpdates from '../../libs/updates';
import { CHANGE_CONNECTION_NOTIFICATION_BADGE } from '../../graphql/cache/mutations';
import cloudinaryUpload, {
  CloudinaryUploadType,
  CloudinaryResponseType
} from '../../utils/cloudinaryUpload';
import { Feather } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {
  tagScreenName,
  addUserIdentity,
  logEvent,
  hideSensitiveView
} from '../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../constants';
import { crashlytics } from '../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import {
  HeaderContainer,
  ImageContainer,
  ImageTextContainer,
  ConnectionCover,
  Cover
  // ImageIconContainer,
  // SocialMediaButton
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  click?: boolean;
}

interface StateProps extends PassportInterface {
  date: string;
  selectedId: string[];
  selectedInterestId: string[];
}

type StateType = {
  uri: string | undefined;
  secure_url: string;
  formData: FormData | null;
  loading: boolean;
  imageData: CloudinaryUploadType;
};

export default function PassportScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top: paddingTop } = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { data: userData, refetch } = useQuery<MyPassportInterface>(
    GET_USER_PASSPORT
  );

  const { data: firebase, loading: firebaseLoading } = useQuery<
    GenerateFirebaseTokenIT
  >(GET_FIREBASE_TOKEN);

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const [getMyCommunities] = useLazyQuery(GET_MY_COMMUNITIES);

  const [getRecommendedCommunities] = useLazyQuery(GET_RECOMMENDED_COMMUNITIES);

  const [getRecommendedMembers] = useLazyQuery(GET_RECOMMENDED_MEMBERS, {
    variables: { filter: { verified: true } }
  });

  const [getPopularCommunities] = useLazyQuery(GET_POPULAR_COMMUNITIES, {
    variables: { offset: 0, first: PAGINATION_DEFAULT }
  });

  const [cache, setCache] = useState({
    ...cacheData,
    details: {}
  });

  const [getConnectionRequest, { data: connectionRequestData }] = useLazyQuery(
    GET_CONNECTION_REQUEST,
    {
      variables: { offset: 0, first: PAGINATION_DEFAULT }
    }
  );

  const [getUserChannels] = useLazyQuery(USER_CHANNELS);

  const [getNearbyMembers] = useLazyQuery(GET_NEARBY_MEMBERS, {
    variables: { offset: 0, first: PAGINATION_DEFAULT / 2 }
  });

  const [getMyConnections] = useLazyQuery(GET_MY_CONNECTIONS, {
    variables: { offset: 0, first: PAGINATION_DEFAULT }
  });

  const [getAllMembers] = useLazyQuery(GET_ALL_MEMBERS, {
    variables: { offset: 0, first: PAGINATION_DEFAULT }
  });

  const userDetails = userData?.myPassport;

  const identity = userDetails?.identity.map((item: any) => item.id);
  const interest = userDetails?.interest.map((item: any) => item.id);
  const dateOfBirth = userDetails?.dob;

  const currentLocation = cache?.currentLocation[0];

  useEffect(() => {
    if (userDetails) {
      tagScreenName('PassportScreen');
      Mixpanel.identify(userDetails?.id);
      addUserIdentity(userDetails?.id);
      //Log mixpanel user id to UXCam
      const user = Mixpanel.identify(userDetails?.id);
      logEvent('mixpanel', { 'mixpanel-user-ID': user });
    }
  }, [userDetails]);

  const [update, setUpdate] = useState(true);

  const setCacheData = async () => {
    if (userDetails) {
      await Storage.setUserPassport({ ...cache, ...userDetails });
    }
  };

  const getCacheData = async () => {
    const storageData = await Storage.getUserPassport();

    if (storageData) {
      const passportInfo = JSON.parse(storageData) as PassportInterface;
      setCache({ ...cache, ...passportInfo });
    }
  };

  useEffect(() => {
    setCacheData();

    setTimeout(() => {
      if (!userDetails) refetch();
    }, 2000);
  }, [userDetails]);

  useLayoutEffect(() => {
    getCacheData();
  }, []);

  const [avatar, setAvatar] = useState<StateType>({
    uri: cache?.avatar,
    secure_url: '',
    formData: null,
    imageData: { uri: '', mime: '', filename: '', cropRect: null },
    loading: false
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

  const firstName = cache?.details?.firstName;
  const lastName = cache?.details?.lastName;
  const bio = cache?.details?.bio;
  const dob = cache?.details?.date?.split('/');
  const day = dob?.length ? parseInt(dob[1]) : dateOfBirth?.day;
  const month = dob?.length ? parseInt(dob[0]) : dateOfBirth?.month;
  const year = dob?.length ? parseInt(dob[2]) : dateOfBirth?.year;
  const identityID = cache?.details?.selectedId || [];
  const interestID = cache?.details?.selectedInterestId || [];
  const SelectedIdentitiesID = Array.from(identityID?.values());
  const SelectedInterestID = Array.from(interestID?.values());

  useEffect(() => {
    if (connectionRequestData?.connectionRequests.length) {
      changeConnectionNotification({
        variables: {
          showConnectionNotificationBadge: true
        }
      });
    }
  }, [connectionRequestData?.connectionRequests.length]);

  useEffect(() => {
    if (SelectedIdentitiesID?.length > 0) {
      setCache({
        ...cache,
        identity: SelectedIdentitiesID
      });
    }
  }, [SelectedIdentitiesID?.length]);

  useEffect(() => {
    if (SelectedInterestID?.length > 0) {
      setCache({
        ...cache,
        interest: SelectedInterestID
      });
    }
  }, [SelectedInterestID?.length]);

  useEffect(() => {
    if (firstName?.length || lastName?.length || bio?.length) {
      setCache({
        ...cache,
        firstName: firstName,
        lastName: lastName,
        bio: bio
      });
    }
  }, [firstName?.length, lastName?.length, bio?.length]);

  useEffect(() => {
    setCache({
      ...cache,
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      bio: userDetails?.bio
    });

    setAvatar({
      ...avatar,
      uri: userDetails?.avatar
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
    setCache({ ...cache, identity: identity, interest: interest });
  }, [identity?.length, interest?.length]);

  useEffect(() => {
    handleLocationPermission();
    getRecommendedCommunities();
    getRecommendedMembers();
    getPopularCommunities();
    getConnectionRequest();
    getMyCommunities();
    getNearbyMembers();
    getMyConnections();
    getUserChannels();
    getAllMembers();
  }, []);

  useEffect(() => {
    const updateLocation = async () => {
      try {
        const { data } = await updatePassport();
        if (data) refetch();
      } catch (error) {
        crashlytics.recordError(error);
      }
    };

    if (location.city?.length && day && interest && identity) {
      handleLocation();
      updateLocation();
    }
  }, [cache.identity]);

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
      crashlytics.recordError(error);
    }
  };

  const [updatePassport, { loading }] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        avatar: avatar.uri,
        firstName: cache.firstName,
        lastName: cache.lastName,
        bio: cache.bio,
        dob: {
          day: day,
          month: month,
          year: year
        },
        identity: cache.identity,
        interest: cache.interest,
        currentLocation: {
          city: location.city,
          state: location.state,
          country: location.country,
          long: location.long,
          lat: location.lat
        }
      }
    }
  });

  const handleLocationPermission = async () => {
    const iosData = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    const androidData = await check(
      PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
    );
    if (iosData === 'granted' || androidData === 'granted') {
      handleLocation();
    } else if (
      iosData === 'denied' ||
      androidData === 'denied' ||
      iosData === 'blocked' ||
      androidData === 'blocked'
    ) {
      const iosData = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      const androidData = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
      );
      iosData === 'granted' || androidData === 'granted'
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
        {
          dialogTitle: t(`signup.passportScreen.title`)
        }
      );

      if (action === Share.dismissedAction) return;

      // PROFILE SHARED HERE
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const getUserDetails = (childData: any) => {
    setCache({ ...cache, details: childData });
  };

  const click = update;

  const handleRequest = async () => {
    const formData = await cloudinaryUpload(avatar.imageData);

    const { secure_url } = (await formData.json()) as CloudinaryResponseType;

    setAvatar({ ...avatar, uri: secure_url, secure_url });
    try {
      const { data } = await updatePassport();
      if (data) {
        refetch();
        setCacheData();
        setUpdate(true);
      }
    } catch (error) {
      crashlytics.recordError(error);
      setUpdate(true);
    }
  };

  const handleAvatar = async () => {
    try {
      let divider = 1;

      const { size, height, width, path } = (await ImagePicker.openPicker({
        cropping: false,
        mediaType: 'photo'
      })) as Image;

      if (size > 900000) divider = size / 900000;

      const { uri: resizedImage } = await ImageResizer.createResizedImage(
        path,
        width / divider,
        height / divider,
        'JPEG',
        100,
        0,
        undefined
      );

      const { mime, data, filename, cropRect } = await ImagePicker.openCropper({
        path: resizedImage,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
        width: RFValue(200),
        height: RFValue(200),
        compressImageMaxWidth: RFValue(200),
        compressImageMaxHeight: RFValue(200),
        cropperStatusBarColor: colors.STATUS_BAR_COLOR,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: true
      });

      const uri = `data:${mime};base64,${data}`;
      const imageData = { mime, filename, cropRect, uri };
      setAvatar({ ...avatar, uri, imageData });
      ImagePicker.clean();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  return (
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
                  onPress={() => setUpdate(false)}
                  loading={loading}
                >
                  {t(`signup.passportScreen.edit`)}
                </Button>
              ) : (
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
              )}
            </Cover>
            <ImageContainer>
              {update ? (
                <SingleImage
                  uri={avatar.uri}
                  style={{
                    width: RFValue(120),
                    height: RFValue(120),
                    justifyContent: 'center',
                    borderRadius: 4
                  }}
                />
              ) : (
                <TouchableHighlight
                  onPress={handleAvatar}
                  ref={hideSensitiveView}
                >
                  <FastImage
                    source={{
                      uri: avatar.uri,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.stretch}
                    style={{
                      width: RFValue(120),
                      height: RFValue(120),
                      justifyContent: 'center',
                      borderRadius: 4
                    }}
                  >
                    <Feather
                      name="camera"
                      size={RFValue(30)}
                      color={colors.WHITE}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    />
                  </FastImage>
                </TouchableHighlight>
              )}

              <ImageTextContainer ref={hideSensitiveView}>
                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    paddingRight: 20,
                    lineHeight: 21,
                    color: colors.WHITE
                  }}
                >
                  {`${cache?.firstName} ${cache?.lastName}`}
                </Paragraph>
                {currentLocation?.city ? (
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
                    {`${currentLocation?.city}, ${currentLocation?.state}`}
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
                    {`${currentLocation?.state}, ${currentLocation?.country}`}
                  </Paragraph>
                )}
                <ConnectionCover>
                  <TouchableRipple
                    style={{ alignItems: 'center' }}
                    onPress={() =>
                      navigation.navigate('DrawerScreen', {
                        screen: 'MyConnections'
                      })
                    }
                  >
                    <Fragment>
                      <Paragraph
                        style={{
                          color: colors.WHITE,
                          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                          fontSize: fonts.LARGE_SIZE + 1,
                          lineHeight: 20
                        }}
                      >
                        {cache.connectionCount}
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
                    </Fragment>
                  </TouchableRipple>
                  <TouchableRipple
                    style={{ alignItems: 'center' }}
                    onPress={() => {
                      navigation.navigate('DrawerScreen', {
                        screen: 'CommunityListScreen',
                        params: {
                          userTribe: true,
                          title: t(`community.memberPassport.myTribes`)
                        }
                      });
                    }}
                  >
                    <Fragment>
                      <Paragraph
                        style={{
                          color: colors.WHITE,
                          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                          fontSize: fonts.LARGE_SIZE + 1,
                          lineHeight: 20
                        }}
                      >
                        {cache?.communityCount}
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
                    </Fragment>
                  </TouchableRipple>
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
                uri: 'https://img.icons8.com/ios-filled/96/000000/share-3.png'
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
          <TabViewSlider getUserDetails={getUserDetails} click={click} />
        </Fragment>
      </ScrollView>

      {OTAUpdate ? <CheckAppUpdates cancelUpdate={cancelUpdate} /> : null}
    </SafeAreaView>
  );
}
