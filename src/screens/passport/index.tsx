// @ts-nocheck
import React, { useState, Fragment, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Mixpanel } from '../../config';
import * as Location from 'expo-location';
import FastImage from 'react-native-fast-image';
import { Share, SafeAreaView } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import SingleImage from '../../libs/react-native-zoom-lightbox';
import { Title, Paragraph, Button, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationInterface } from '../types';
import { useThemeContext } from '../../theme';
import TabViewSlider from './widgets/tabs';
import { userDetails as cacheData } from '../../graphql/cache';
import {
  GET_USER_PASSPORT,
  GET_ALL_MEMBERS,
  GET_CONNECTION_REQUEST,
  GET_MY_CONNECTIONS,
  GET_NEARBY_MEMBERS,
  GET_MY_COMMUNITIES,
  GET_POPULAR_COMMUNITIES,
  GET_RECOMMENDED_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS,
  USER_CHANNELS
} from '../../graphql/server/query';
import { MyPassportInterface, PassportInterface } from '../../graphql/types';
import {
  UPDATE_PASSPORT,
  GENERATE_INVITE_LINK
} from '../../graphql/server/mutations';
import Storage from '../../libs/storage';
import {
  CHANGE_ACTIVE_SIDE_MENU_STATE,
  CHANGE_CONNECTION_NOTIFICATION_BADGE
} from '../../graphql/cache/mutations';
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
  Cover,
  TabCover,
  ScreenCover,
  ButtonHeaderCover
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
  const [update, setUpdate] = useState(true);

  const selectedCountries = props?.route?.params?.selectedCountries;

  const [cache, setCache] = useState({
    ...cacheData,
    details: {
      selectedIdentity: [],
      selectedInterest: [],
      deleteIdentity: [],
      deleteInterest: [],
      date: ''
    }
  });

  const [avatar, setAvatar] = useState<StateType>({
    uri: cache?.avatar,
    secure_url: '',
    formData: null,
    imageData: { uri: '', mime: '', filename: '', cropRect: null },
    loading: false
  });

  const { data: userData, refetch } = useQuery<MyPassportInterface>(
    GET_USER_PASSPORT
  );

  const [changeSideMenuState] = useMutation(CHANGE_ACTIVE_SIDE_MENU_STATE);

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const [getMyCommunities] = useLazyQuery(GET_MY_COMMUNITIES);

  const [getMyChannels] = useLazyQuery(USER_CHANNELS);

  const [getRecommendedCommunities] = useLazyQuery(GET_RECOMMENDED_COMMUNITIES);

  const [getRecommendedMembers] = useLazyQuery(GET_RECOMMENDED_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2 } }
  });

  const [getPopularCommunities] = useLazyQuery(GET_POPULAR_COMMUNITIES, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
  });

  const [getConnectionRequest, { data: connectionRequestData }] = useLazyQuery(
    GET_CONNECTION_REQUEST,
    {
      variables: { input: { limit: PAGINATION_DEFAULT } }
    }
  );

  const [getNearbyMembers] = useLazyQuery(GET_NEARBY_MEMBERS, {
    variables: { input: { limit: 8 } }
  });

  const [getMyConnections] = useLazyQuery(GET_MY_CONNECTIONS, {
    variables: { input: { limit: PAGINATION_DEFAULT } }
  });

  const [getAllMembers] = useLazyQuery(GET_ALL_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT } }
  });

  const userDetails = userData?.myPassport;

  const currentLocation = userDetails?.currentLocation?.country
    ? userDetails?.currentLocation
    : cache?.currentLocation;

  const [generateInviteLink] = useMutation(GENERATE_INVITE_LINK, {
    variables: { payload: { passportId: userDetails?.id } }
  });

  const handleGenerateLink = async () => {
    logEvent('generate invite link', { from: 'passport' });
    try {
      Mixpanel.track('Generate Invite Link', {
        info: `Generate Invite Link`,
        'Activity Screen': 'Passport Screen'
      });
      await generateInviteLink();
      refetch();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  useEffect(() => {
    if (userDetails && !userDetails?.invite_url?.length) {
      handleGenerateLink();
      refetch();
    }
  }, [userDetails]);

  useEffect(() => {
    if (userDetails) {
      tagScreenName('PassportScreen');
      Mixpanel.identify(userDetails?.id);
      addUserIdentity(userDetails?.id);
      //Log mixpanel user id to UXCam
      const user = Mixpanel.identify(userDetails?.id);
      logEvent('mixpanel', { 'mixpanel-user-ID': user });
      Storage.setUserPassport({
        ...cache,
        citizenship: userDetails.citizenship,
        ...userDetails
      });
      // handleLocation();
    }
  }, [userDetails]);

  const getCacheData = async () => {
    const storageData = await Storage.getUserPassport();
    if (storageData) {
      const passportInfo = JSON.parse(storageData) as PassportInterface;
      setCache({
        ...cache,
        dob: new Date(parseInt(passportInfo?.dob))
          .toLocaleString()
          .split(',')[0],
        ...passportInfo
      });
      setAvatar({ ...avatar, uri: passportInfo.avatar });
      // handleLocation();
    }
  };

  const [location, setLocation] = useState<{
    city?: string;
    state?: string | null | undefined;
    country?: string;
    lat?: number | null;
    long?: number | null;
  }>({
    city: currentLocation?.city,
    state: currentLocation?.state,
    country: currentLocation?.country,
    lat: currentLocation?.lat,
    long: currentLocation?.long
  });

  const changeSideMenu = () => {
    navigation.navigate('DrawerScreen', { screen: 'MyConnections' });
    changeSideMenuState({
      variables: { activeSideMenu: 'drawer_connection_key' }
    });
  };

  useEffect(() => {
    if (connectionRequestData?.connectionRequests.length) {
      changeConnectionNotification({
        variables: { showConnectionNotificationBadge: true }
      });
    }
  }, [connectionRequestData?.connectionRequests.length]);

  useEffect(() => {
    setCache({ ...cache, ...userDetails });
    setAvatar({ ...avatar, uri: userDetails?.avatar });

    if (!location.city?.length) {
      setLocation({
        city: userDetails?.currentLocation?.city,
        state: userDetails?.currentLocation?.state,
        country: userDetails?.currentLocation?.country,
        lat: userDetails?.currentLocation?.lat,
        long: userDetails?.currentLocation?.long
      });
    }
  }, [userDetails]);

  useEffect(() => {
    if (selectedCountries?.length) {
      setCache({
        ...cache,
        citizenship: selectedCountries
      });
    }
  }, [selectedCountries]);

  useEffect(() => {
    if (!userDetails) getCacheData();
  }, []);

  useEffect(() => {
    getRecommendedCommunities();
    getRecommendedMembers();
    getPopularCommunities();
    getConnectionRequest();
    getMyCommunities();
    getNearbyMembers();
    getMyConnections();
    getAllMembers();
    getMyChannels();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!userDetails) {
        refetch().then(({ data }) => {
          setCache({ ...cache, ...data.myPassport });
          setAvatar({ ...avatar, uri: data.myPassport.avatar });
        });
      }
    }, 1000);
  }, [userDetails]);

  const handleLocation = async () => {
    try {
      await Location.requestPermissionsAsync();

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
        await setLocation({
          ...location,
          city: city,
          state: region,
          country: country,
          lat: coords.latitude,
          long: coords.longitude
        });
        refetch();
        if (userDetails) {
          await updatePassport();
          Mixpanel.track('User Update passport', {
            info: `User ${cache.firstName} ${cache.lastName} updates passport`,
            'Activity Screen': 'Passport screen'
          });
        }
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  useEffect(() => {
    if (userDetails?.interest || userDetails?.identity) {
      const interest = [
        ...userDetails?.interest,
        ...cache.details.selectedInterest
      ].map(({ name }) => name);

      const identity = [
        ...userDetails?.identity,
        ...cache.details.selectedIdentity
      ].map(({ name }) => name);

      setCache({
        ...cache,
        identity,
        interest
      });
    }
  }, [cache.details || userDetails]);

  const dob = cache.details?.date?.split('/');
  const day = parseInt(dob[1]);
  const month = parseInt(dob[0]);
  const year = parseInt(dob[2]);
  const isValidDate = year || month || day;
  const dateOfBirth = isValidDate ? `${year + '-' + month + '-' + day}` : null;
  const date = dateOfBirth == 'NaN-NaN-NaN' ? '' : dateOfBirth;

  const identity = cache.details.selectedIdentity.map(
    (identity) => identity.name
  );
  const filterIdentity = userDetails?.identity?.map(
    (identity) => identity.name
  );
  // const removeIdentity = filterIdentity?.filter(
  //   (tag) => !identity.includes(tag)
  // );
  const removeIdentity = cache.details?.deleteIdentity?.map(
    (item) => item?.name
  );
  const filterInterest = userDetails?.interest?.map(
    (interest) => interest.name
  );
  const removeInterest = filterInterest?.filter(
    (tag) => !cache.details.selectedInterest.includes(tag)
  );
  const citizenship = cache.citizenship?.map((country) => country.name);
  const filtercitizenship = userDetails?.citizenship?.filter(
    (country) => !citizenship?.includes(country.name)
  );
  const removecitizenship = filtercitizenship?.map(
    ({ __typename, id, ...keepAttrs }) => keepAttrs
  );
  const removeTypename = cache.citizenship?.map(
    ({ __typename, id, ...keepAttrs }) => keepAttrs
  );

  const [updatePassport, { loading }] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        avatar: avatar.uri,
        firstName: cache.firstName,
        lastName: cache.lastName,
        bio: cache.bio,
        dob: date,
        identity: {
          add: identity,
          remove: removeIdentity
        },
        interest: {
          add: cache.details.selectedInterest,
          remove: cache.details.deleteInterest
        },
        citizenship: {
          add: removeTypename,
          remove: removecitizenship
        },
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

  const onShare = async () => {
    try {
      const { action } = await Share.share(
        {
          title: t(`signup.passportScreen.title`),
          message: cache?.invite_url || userDetails?.invite_url
        },
        {
          dialogTitle: t(`signup.passportScreen.title`)
        }
      );

      if (action === Share.dismissedAction) return;

      // PROFILE SHARED HERE
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const getUserDetails = (details: any, select: any) => {
    setCache({
      ...cache,
      ...details,
      details: {
        ...cache.details,
        deleteIdentity: select.deleteIdentity,
        selectedIdentity: select.identity,
        selectedInterest: select.interest,
        deleteInterest: select.deleteInterest,
        ...details
      }
    });
  };

  const handleUpdatePassport = async () => {
    try {
      if (avatar.imageData) {
        const formData = await cloudinaryUpload(avatar.imageData);
        const {
          secure_url
        } = (await formData.json()) as CloudinaryResponseType;

        await setAvatar({ ...avatar, uri: secure_url, secure_url });
      }

      await updatePassport();
      Mixpanel.track('User Update passport', {
        info: `User ${cache.firstName} ${cache.lastName} updates passport`,
        'Activity Screen': 'Passport screen'
      });
      refetch();
      setUpdate(true);
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
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
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const [triblPay, setTriblPay] = useState(false);

  const handleActivateWallet = () => {
    navigation.navigate('TriblPayScreen', {
      screen: 'ActivateWalletScreen'
    });
  };

  const handleViewWallet = () => {
    navigation.navigate('TriblPayScreen', {
      screen: 'WalletScreen'
    });
  };

  return (
    <ScreenCover>
      <SafeAreaView
        style={{
          backgroundColor: colors.PRIMARY,
          paddingTop: RFValue(paddingTop)
        }}
      >
        <StatusBar translucent animated style="light" />
        <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps={'always'}
          enableOnAndroid={true}
          contentContainerStyle={{
            backgroundColor: colors.WHITE,
            marginTop: RFValue(20),
            paddingBottom: RFValue(20)
          }}
        >
          <Fragment>
            <HeaderContainer>
              {update ? (
                <Button
                  mode="contained"
                  style={{
                    backgroundColor: colors.GREY,
                    borderRadius: 4,
                    marginLeft: 'auto'
                  }}
                  labelStyle={{
                    color: colors.SECONDARY_TEXT,
                    fontSize: RFValue(fonts.SMALL_SIZE + 1),
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    textTransform: 'uppercase',
                    textAlign: 'center'
                  }}
                  onPress={() => setUpdate(false)}
                  loading={loading}
                >
                  {t(`signup.passportScreen.edit`)}
                </Button>
              ) : (
                <Button
                  mode="contained"
                  style={{
                    backgroundColor: colors.GREY,
                    borderRadius: 4,
                    marginLeft: 'auto'
                  }}
                  labelStyle={{
                    color: colors.SECONDARY_TEXT,
                    fontSize: RFValue(fonts.SMALL_SIZE + 1),
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    textTransform: 'uppercase',
                    textAlign: 'center'
                  }}
                  onPress={handleUpdatePassport}
                  loading={loading}
                >
                  {t(`signup.passportScreen.update`)}
                </Button>
              )}
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
                <Paragraph
                  style={{
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE - 2)),
                    color: colors.WHITE,
                    marginTop: RFValue(5)
                  }}
                >
                  {t(`community.passport.subTitle`)}
                </Paragraph>
              </Cover>
              <ImageContainer>
                {update ? (
                  <SingleImage
                    uri={avatar.uri}
                    style={{
                      width: RFValue(120),
                      height: RFValue(100),
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
                        height: RFValue(100),
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
                      color: colors.WHITE,
                      textTransform: 'capitalize'
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
                  {cache?.citizenship?.length ? (
                    <Title
                      style={{
                        fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.5)),
                        marginTop: RFValue(2)
                      }}
                    >
                      {cache?.citizenship?.map((country) => country.flag)}
                    </Title>
                  ) : null}
                  <ConnectionCover>
                    <TouchableRipple
                      style={{ alignItems: 'center', marginRight: RFValue(15) }}
                      onPress={changeSideMenu}
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
                </ImageIconContainer> */}
                </ImageTextContainer>
              </ImageContainer>
              <ButtonHeaderCover>
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
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    textTransform: 'capitalize'
                  }}
                  contentStyle={{
                    height: RFValue(50),
                    backgroundColor: colors.PRIMARY_LIGHT
                  }}
                  style={{
                    height: RFValue(50),
                    width: '100%'
                  }}
                  onPress={onShare}
                >
                  {t(`community.passport.shareInvite`)}
                </Button>
                {/* <Button
                  onPress={triblPay ? handleViewWallet : handleActivateWallet}
                  labelStyle={{
                    color: colors.PRIMARY,
                    fontFamily: fonts.WORK_SANS_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    textTransform: 'capitalize'
                  }}
                  contentStyle={{
                    height: RFValue(50),
                    backgroundColor: colors.WHITE
                  }}
                  style={{
                    height: RFValue(50),
                    width: '49%'
                  }}
                >
                  {triblPay
                    ? t(`community.passport.viewWallet`)
                    : t(`community.passport.activate`)}
                </Button> */}
              </ButtonHeaderCover>
            </HeaderContainer>
            <TabCover>
              <TabViewSlider
                getUserDetails={getUserDetails}
                click={update}
                selectedCountries={selectedCountries}
              />
            </TabCover>
          </Fragment>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ScreenCover>
  );
}
