// @ts-nocheck
import React, { useState, Fragment, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share, Platform, SafeAreaView, Alert, FlatList } from 'react-native';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import {
  Title,
  Paragraph,
  Button,
  TouchableRipple,
  TextInput
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  logEvent,
  tagScreenName,
  addUserIdentity,
  hideSensitiveView
} from '../../utils/uxcamHelper';
import formatMessageTime from '../../utils/timesince';

import {
  USER_CHANNELS,
  GET_ALL_MEMBERS,
  GET_USER_PASSPORT,
  GET_MY_CONNECTIONS,
  GET_NEARBY_MEMBERS,
  GET_MY_COMMUNITIES,
  GET_POPULAR_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS,
  GET_RECOMMENDED_COMMUNITIES
} from '../../graphql/server/query';
import cloudinaryUpload, {
  CloudinaryUploadType,
  CloudinaryResponseType
} from '../../utils/cloudinaryUpload';
import { Mixpanel } from '../../config';
import { useThemeContext } from '../../theme';
import { NavigationInterface } from '../types';
import { crashlytics } from '../../firebase/config';
import { countWords } from '../../utils/countWords';
import { PAGINATION_DEFAULT } from '../../constants';
import { userDetails as cacheData } from '../../graphql/cache';
import SingleImage from '../../libs/react-native-zoom-lightbox';
import { UPDATE_PASSPORT } from '../../graphql/server/mutations';
import { CHANGE_ACTIVE_SIDE_MENU_STATE } from '../../graphql/cache/mutations';
import {
  PassportInterface,
  CommunityInterface,
  ChannelInterface
} from '../../graphql/types';
import MyConnectionCard from '../../components/MyConnectionCard';
import MyCommunity from '../../components/myCommunities';
import MyChannel from '../community/memberPassport/widget/channelCard';
import IdentityModal, { IdentityInterface } from './widgets/identityModal';
import InterestModal from './widgets/interestModal';
import { InterestsInterface } from './widgets/interestModal/interestButton';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Cover,
  TabCover,
  ScreenCover,
  ImageContainer,
  ConnectionCover,
  HeaderContainer,
  ButtonHeaderCover,
  ImageTextContainer,
  Container,
  Identities,
  AddIdentity,
  DOBContainer,
  IdentityText,
  BioContainer,
  ContactContainer,
  LastNameContainer,
  IdentityContainer,
  InterestContainer,
  FirstNameContainer,
  CitizenshipContainer
  // SocialMediaButton,
  // ImageIconContainer,
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
  const [triblPay, setTriblPay] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [interestVisible, setInterestVisible] = useState(false);
  const [displayInterest, setDisplayInterest] = useState(false);
  const selectedCountries = props?.route?.params?.selectedCountries;

  const [select, setSelect] = useState({
    identity: [],
    interest: [],
    deleteInterest: [],
    deleteIdentity: []
  });

  const [cache, setCache] = useState({
    ...cacheData,
    showDatePicker: false,
    timeStamp: '',
    date: '',
    tags: new Map(),
    tagText: '',
    selectedIdentity: [],
    selectedInterest: [],
    click: false,
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
    loading: false,
    formData: null,
    imageData: { uri: '', mime: undefined, cropRect: null }
  });

  const { data: userData, refetch } = useQuery<MyPassportInterface>(
    GET_USER_PASSPORT
  );

  const [changeSideMenuState] = useMutation(CHANGE_ACTIVE_SIDE_MENU_STATE);

  const [getMyCommunities] = useLazyQuery(GET_MY_COMMUNITIES);

  const [getMyChannels] = useLazyQuery(USER_CHANNELS);

  const [getRecommendedCommunities] = useLazyQuery(GET_RECOMMENDED_COMMUNITIES);

  const [getRecommendedMembers] = useLazyQuery(GET_RECOMMENDED_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2 } }
  });

  const [getPopularCommunities] = useLazyQuery(GET_POPULAR_COMMUNITIES, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
  });

  const [getNearbyMembers] = useLazyQuery(GET_NEARBY_MEMBERS, {
    variables: { input: { limit: 8 } }
  });

  const [getMyConnections] = useLazyQuery(GET_MY_CONNECTIONS, {
    variables: { input: { limit: PAGINATION_DEFAULT } }
  });

  const [getAllMembers] = useLazyQuery(GET_ALL_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT } }
  });

  const _renderMyConnectionItem = ({ item }: { item: PassportInterface }) => (
    <MyConnectionCard key={item.id} {...item} singlePassport={cache} />
  );

  const _renderMyCommunityItem = ({ item }: { item: CommunityInterface }) => (
    <MyCommunity key={item.id} {...item} singlePassport={cache} />
  );

  const _renderMyChannelItem = ({ item }: { item: ChannelInterface }) => (
    <MyChannel key={item.id} {...item} singlePassport={cache} />
  );

  const userDetails = userData?.myPassport;
  const currentLocation = userDetails?.currentLocation?.country
    ? userDetails?.currentLocation
    : cache?.currentLocation;

  const participantOf = cache?.participantOf;
  const myConnections = cache?.myConnections?.data;
  const myChannels = cache?.recentChannels;

  useEffect(() => {
    if (cache?.selectedIdentity) {
      setSelect({
        ...select,
        identity: cache?.selectedIdentity
      });
    }
    if (cache?.tags?.length) {
      setSelect({
        ...select,
        interest: [...Array.from(cache?.tags.values())]
      });
    }
  }, [cache?.selectedIdentity || cache?.tags]);

  const stateInterest = cache?.interest?.map((tag) => tag?.name);

  useEffect(() => {
    if (cache?.identity?.length) {
      setSelect({
        ...select,
        identity: cache?.identity
      });
    }
    if (cache.interest?.length) {
      setSelect({
        ...select,
        interest: stateInterest
      });
    }
  }, [cache?.identity || cache?.interest]);

  useEffect(() => {
    if (selectedCountries?.length) {
      setCache({
        ...cache,
        citizenship: selectedCountries
      });
    }
  }, [selectedCountries]);

  const handleSelectIdentity = (selected: string) => {
    const filteredIdentity = select.identity.filter(
      (identity) => identity.name !== selected
    );
    const deleteIdentity = select.identity.filter(
      (identity) => identity.name == selected
    );
    setSelect({
      ...select,
      identity: filteredIdentity,
      deleteIdentity: [...select.deleteIdentity, ...deleteIdentity]
    });
  };

  const interest = userDetails?.interest.map((tag) => tag.name);
  useEffect(() => {
    (async () => {
      if (userDetails) {
        setSelect({
          ...select,
          identity: userDetails?.identity,
          interest: interest
        });
        setCache({
          ...cache,
          ...userDetails,
          date: new Date(parseInt(userDetails?.dob))
            .toLocaleString()
            .split(',')[0],
          participantOf: userDetails?.participantOf,
          myConnections: userDetails?.myConnections,
          myChannels: userDetails?.recentChannels
        });
      }
    })();
  }, [userDetails]);

  useEffect(() => {
    if (select?.interest) {
      setCache({
        ...cache,
        selectedInterest: select.interest
      });
    }
  }, [select.interest]);

  const handleSelectInterest = (selected: string) => {
    if (cache.tags || !cache.tags.has || !cache.tags.has(selected)) {
      const tags = new Map();
      tags.set(selected, selected);
      setCache({
        ...cache,
        tags: tags,
        click: false,
        tagText: ''
      });
      setSelect({
        ...select,
        interest: [...select.interest, tags.get(selected)]
      });
      return setCache({
        ...cache,
        click: false,
        tagText: ''
      });
    }
  };

  const handleADeleteInterest = (selected: string) => {
    const filteredInterest = select.interest.filter(
      (interest) => interest !== selected
    );
    const deleteInterest = select.interest.filter(
      (interest) => interest == selected
    );
    setSelect({
      ...select,
      interest: filteredInterest,
      deleteInterest: [...select.deleteInterest, ...deleteInterest]
    });
  };

  const showIdentityModal = useCallback(
    (isVisible: boolean) => () => {
      setIsVisible(isVisible);
      return true;
    },
    []
  );

  const showInterestModal = useCallback(
    (interest: boolean) => () => {
      setInterestVisible(interest);
      return true;
    },
    []
  );

  const getIdentity = (identity: IdentityInterface, action: string) => {
    if (action === 'addIdentity') {
      return setCache({
        ...cache,
        selectedIdentity: [...cache.selectedIdentity, identity]
      });
    }
    let filteredIdentity = cache.selectedIdentity.filter(
      (value) => value !== identity
    );
    setCache({
      ...cache,
      selectedIdentity: filteredIdentity
    });
  };

  const getInterest = (interest: InterestsInterface, action: string) => {
    if (action === 'addInterest') {
      setCache({
        ...cache,
        selectedInterest: [...cache.selectedInterest, interest]
      });
    }

    let filteredInterest = cache.selectedInterest.filter(
      (value) => value !== interest
    );
    setCache({
      ...cache,
      selectedInterest: filteredInterest
    });
  };

  useEffect(() => {
    if (userDetails) {
      tagScreenName('PassportScreen');
      Mixpanel.identify(userDetails?.id);
      addUserIdentity(userDetails?.id);
      //Log mixpanel user id to UXCam
      const user = Mixpanel.identify(userDetails?.id);
      logEvent('mixpanel', { 'mixpanel-user-ID': user });
      // Storage.setUserPassport({
      //   ...cache,
      //   citizenship: userDetails.citizenship,
      //   ...userDetails
      // });
      // handleLocation();
    }
  }, [userDetails]);

  // const getCacheData = async () => {
  //   const storageData = await Storage.getUserPassport();
  //   if (storageData) {
  //     const passportInfo = JSON.parse(storageData) as PassportInterface;
  //     setCache({
  //       ...cache,
  //       dob: new Date(parseInt(passportInfo?.dob))
  //         .toLocaleString()
  //         .split(',')[0],
  //       ...passportInfo
  //     });
  //     setAvatar({ ...avatar, uri: passportInfo.avatar });
  //     // handleLocation();
  //   }
  // };

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
    const grantMediaPermission = async () => {
      if (Platform.OS !== 'web') {
        // @ts-ignore
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            'Sorry, we need camera roll permissions to make this work!'
          );
        }
      }
    };

    grantMediaPermission();
  }, []);

  useEffect(() => {
    getRecommendedCommunities();
    getRecommendedMembers();
    getPopularCommunities();
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
    }
  };

  const dob = cache.details?.date?.split('/');
  const day = parseInt(dob[1]);
  const month = parseInt(dob[0]);
  const year = parseInt(dob[2]);
  const isValidDate = year || month || day;
  const dateOfBirth = isValidDate ? `${year + '-' + month + '-' + day}` : null;
  const date = dateOfBirth == 'NaN-NaN-NaN' ? '' : dateOfBirth;

  const identity = select.identity.map((identity) => identity.name);
  const filterIdentity = userDetails?.identity?.map(
    (identity) => identity.name
  );
  const removeIdentity = select.deleteIdentity?.map((item) => item?.name);
  const filterInterest = userDetails?.interest?.map(
    (interest) => interest.name
  );
  const removeInterest = filterInterest?.filter(
    (tag) => !select.interest.includes(tag)
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
          add: select.interest,
          remove: select.deleteInterest
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
    }
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
      setUpdate(true);
    }
  };

  const [close, setClose] = useState(() => {});
  const [avatarloading, setAvatarLoading] = useState(false);

  const getAvatarDetails = (avatar: any, close: any) => {
    if (avatar?.uri?.length) {
      setAvatar({ ...avatar, avatar });
      setClose(() => close);
    }
  };

  const [updateAvatar] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
        avatar: avatar.uri
      }
    }
  });

  const hanleAvatarUpdate = async () => {
    setAvatarLoading(true);
    try {
      if (avatar.imageData) {
        const formData = await cloudinaryUpload(avatar.imageData);
        const {
          secure_url
        } = (await formData.json()) as CloudinaryResponseType;

        await setAvatar({ ...avatar, uri: secure_url, secure_url });
      }

      await updateAvatar();
      close();
      Mixpanel.track('User Update passport avatar', {
        info: `User ${cache.firstName} ${cache.lastName} updates passport avatar`,
        'Activity Screen': 'Passport screen'
      });
      refetch();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const handleAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });

      if (result.cancelled) return;
      const { type, width, height, base64 } = result;
      const uri = `data:${type}/jpg;base64,${base64}`;
      const imageData = { uri, mime: type, cropRect: { width, height } };
      setAvatar({ ...avatar, uri, imageData });
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const handleWalletAction = () => {
    if (!userDetails) return;
    const status = cache?.wallet?.status;

    if (status === 'ACTIVE') {
      return navigation.navigate('TriblPayScreen', {
        screen: 'WalletScreen'
      });
    }

    if (status === 'PENDING') {
      return navigation.navigate('TriblPayScreen', {
        screen: 'PendingWalletStatusScreen'
      });
    }

    const updateFields = [];
    const { phoneNumber, email, lastName, firstName, dob } = userDetails;

    if (countWords(phoneNumber)) updateFields.push('Phone Number');
    if (countWords(firstName)) updateFields.push('First name');
    if (countWords(email)) updateFields.push('Email Address');
    if (countWords(lastName)) updateFields.push('Last Name');
    if (countWords(dob)) updateFields.push('Date of Birth');

    if (updateFields.length > 0) {
      return Alert.alert(
        'Update Profile',
        `Update your ${
          updateFields.length > 1
            ? updateFields.map((x) => ` ${x}`)
            : `${updateFields}`
        } before you can proceed`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: 'Update',
            onPress: () => setUpdate(false)
          }
        ]
      );
    }

    return navigation.navigate('TriblPayScreen', {
      screen: 'BankCountryScreen',
      params: { userDetails: cache }
    });
  };

  const onChange = (selectedDate: Date) => {
    const newDate = formatMessageTime(selectedDate);
    const dob = newDate?.split('/');
    const day = parseInt(dob[0]);
    const month = parseInt(dob[1]);
    const year = parseInt(dob[2]);
    const dobTimestamp = new Date(Date.UTC(year, month - 1, day));
    const timeStamp = dobTimestamp / 1000;
    const date = month + '/' + day + '/' + year;
    const newDOB = year + '-' + month + '-' + day;
    if (date.includes('NaN')) {
      return setCache({
        ...cache,
        showDatePicker: false
      });
    }

    return setCache({
      ...cache,
      date,
      showDatePicker: false,
      timeStamp,
      dob: newDOB
    });
  };

  const handleDatePicker = () => {
    setCache({ ...cache, showDatePicker: !cache.showDatePicker });
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
                    fontSize: RFValue(fonts.SMALL_SIZE + 2),
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
                    fontSize: RFValue(fonts.SMALL_SIZE + 5),
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
                    userId={userDetails?.id}
                    uri={avatar.uri}
                    getAvatarDetails={getAvatarDetails}
                    loading={avatarloading}
                    update={hanleAvatarUpdate}
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
                  ) : currentLocation?.country !== undefined ? (
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
                  ) : null}
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
                    backgroundColor: colors.PRIMARY_LIGHT,
                    paddingLeft: RFValue(5)
                  }}
                  style={{
                    height: RFValue(50),
                    width: '49%'
                  }}
                  onPress={onShare}
                >
                  {t(`community.passport.share`)}
                </Button>
                <Button
                  onPress={handleWalletAction}
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
                  {cache?.wallet?.status === 'ACTIVE'
                    ? t(`community.passport.viewWallet`)
                    : t(`community.passport.activate`)}
                </Button>
              </ButtonHeaderCover>
            </HeaderContainer>
            <TabCover>
              <ContactContainer>
                {!update ? (
                  <Container>
                    <FirstNameContainer>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'uppercase'
                        }}
                      >
                        {t(`signup.passportScreen.firstName`)}
                      </Title>
                    </FirstNameContainer>
                    <TextInput
                      ref={hideSensitiveView}
                      value={cache?.firstName}
                      onChangeText={(firstName: string) =>
                        setCache({ ...cache, firstName })
                      }
                      disabled={update}
                      style={{
                        height: 30,
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                        color: colors.PRIMARY_TEXT,
                        backgroundColor: colors.WHITE,
                        borderBottomWidth: update ? 0 : 2,
                        borderColor: colors.PRIMARY,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Container>
                ) : null}

                {!update ? (
                  <Container>
                    <LastNameContainer>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'uppercase'
                        }}
                      >
                        {t(`signup.passportScreen.lastName`)}
                      </Title>
                    </LastNameContainer>
                    <TextInput
                      ref={hideSensitiveView}
                      value={cache?.lastName}
                      onChangeText={(lastName: string) =>
                        setCache({ ...cache, lastName })
                      }
                      disabled={update}
                      style={{
                        height: 30,
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                        color: colors.PRIMARY_TEXT,
                        backgroundColor: colors.WHITE,
                        borderBottomWidth: update ? 0 : 2,
                        borderColor: colors.PRIMARY,
                        textTransform: 'capitalize'
                      }}
                    />
                  </Container>
                ) : null}

                {!update ? (
                  <Container>
                    <BioContainer>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'uppercase'
                        }}
                      >
                        {t(`community.memberPassport.bio`)}
                      </Title>
                    </BioContainer>
                    {cache?.bio ? (
                      <TextInput
                        ref={hideSensitiveView}
                        value={cache?.bio}
                        multiline={true}
                        dense={true}
                        onChangeText={(bio: string) =>
                          setCache({ ...cache, bio })
                        }
                        disabled={update}
                        style={{
                          fontFamily: fonts.WORK_SANS_REGULAR,
                          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                          color: colors.PRIMARY_TEXT,
                          backgroundColor: colors.WHITE,
                          borderBottomWidth: update ? 0 : 2,
                          borderColor: colors.PRIMARY,
                          textTransform: 'capitalize'
                        }}
                      />
                    ) : (
                      <TextInput
                        ref={hideSensitiveView}
                        placeholder={t(`community.memberPassport.bioInfo`)}
                        multiline={true}
                        dense={true}
                        onChangeText={(bio: string) =>
                          setCache({ ...cache, bio: bio })
                        }
                        disabled={update}
                        style={{
                          fontFamily: fonts.WORK_SANS_REGULAR,
                          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                          color: colors.PRIMARY_TEXT,
                          backgroundColor: colors.WHITE,
                          borderBottomWidth: update ? 0 : 2,
                          borderColor: colors.PRIMARY,
                          textTransform: 'capitalize'
                        }}
                      />
                    )}
                  </Container>
                ) : (
                  <Fragment>
                    {cache?.bio ? (
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_REGULAR,
                          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'capitalize'
                        }}
                      >
                        {cache?.bio}
                      </Title>
                    ) : null}
                  </Fragment>
                )}

                {!update ? (
                  <DOBContainer>
                    <Title
                      style={{
                        fontFamily: fonts.WORK_SANS_BOLD,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'uppercase',
                        marginBottom: 0
                      }}
                    >
                      {t(`community.memberPassport.dob`)}
                    </Title>

                    <Button
                      ref={hideSensitiveView}
                      mode="text"
                      uppercase={false}
                      disabled={update}
                      labelStyle={{
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'capitalize',
                        paddingTop: 5,
                        paddingBottom: 5,
                        marginTop: 0,
                        marginLeft: 0
                      }}
                      contentStyle={{
                        justifyContent: 'flex-start',
                        borderRadius: 4
                      }}
                      onPress={handleDatePicker}
                    >
                      {!cache.date || cache.date == 'Invalid Date'
                        ? t(`signup.passportScreen.dob`)
                        : cache.date}
                    </Button>

                    <DateTimePicker
                      isVisible={cache.showDatePicker}
                      mode="date"
                      onConfirm={onChange}
                      onCancel={handleDatePicker}
                      maximumDate={new Date()}
                    />
                  </DOBContainer>
                ) : null}

                {!update ? (
                  <CitizenshipContainer ref={hideSensitiveView}>
                    <Title
                      style={{
                        fontFamily: fonts.WORK_SANS_BOLD,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'uppercase'
                      }}
                    >
                      {t(`signup.passportScreen.citizenship`)}
                    </Title>
                    {cache?.citizenship?.length ? (
                      <Fragment>
                        {cache?.citizenship?.map((country) => (
                          <Title
                            style={{
                              fontFamily: fonts.WORK_SANS_REGULAR,
                              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                              color: colors.PRIMARY_TEXT
                            }}
                          >
                            {country.name}
                          </Title>
                        ))}
                      </Fragment>
                    ) : null}
                    {!update ? (
                      <TouchableRipple
                        onPress={() => navigation.navigate('CitizenshipScreen')}
                      >
                        <AddIdentity>+</AddIdentity>
                      </TouchableRipple>
                    ) : null}
                  </CitizenshipContainer>
                ) : null}

                {select.identity?.length || !update ? (
                  <IdentityContainer>
                    <Title
                      style={{
                        fontFamily: fonts.WORK_SANS_BOLD,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'uppercase',
                        marginBottom: 10
                      }}
                    >
                      {t(`signup.passportScreen.identity`)}
                    </Title>

                    <Identities>
                      <Fragment>
                        {select.identity.map((identity) => (
                          <IdentityText
                            key={identity.id}
                            onPress={() =>
                              update ? {} : handleSelectIdentity(identity.name)
                            }
                          >
                            {identity.name}
                            {!update ? (
                              <Fragment>
                                <Feather
                                  onPress={() =>
                                    handleSelectIdentity(identity.name)
                                  }
                                  name="x"
                                  size={RFValue(13)}
                                  color={colors.PRIMARY_TEXT}
                                  style={{
                                    paddingLeft: RFValue(30),
                                    paddingRight: RFValue(50)
                                  }}
                                />
                              </Fragment>
                            ) : null}
                          </IdentityText>
                        ))}
                      </Fragment>

                      {!update ? (
                        <TouchableRipple onPress={showIdentityModal(true)}>
                          <AddIdentity>+</AddIdentity>
                        </TouchableRipple>
                      ) : null}
                    </Identities>
                  </IdentityContainer>
                ) : null}

                {select?.interest?.length || !update ? (
                  <InterestContainer>
                    <Title
                      style={{
                        fontFamily: fonts.WORK_SANS_BOLD,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'uppercase'
                      }}
                    >
                      {t(`signup.passportScreen.interest`)}
                    </Title>
                    <Identities>
                      {select?.interest?.length > 8 && update ? (
                        <Fragment>
                          {select?.interest?.slice(0, 8)?.map((tag) => (
                            <IdentityText
                              key={tag}
                              onPress={() =>
                                !update ? handleADeleteInterest(tag) : {}
                              }
                              style={{
                                marginRight: RFValue(10),
                                marginTop: RFValue(10),
                                borderColor: colors.INACTIVE,
                                borderWidth: 1.2,
                                borderRadius: 4,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                              }}
                              labelStyle={{
                                fontFamily: fonts.WORK_SANS_BOLD,
                                fontSize: fonts.MEDIUM_SIZE,
                                color: colors.PRIMARY_TEXT,
                                textTransform: 'capitalize'
                              }}
                            >
                              {tag}
                              {!update ? (
                                <Fragment>
                                  <Feather
                                    onPress={() => handleADeleteInterest(tag)}
                                    name="x"
                                    size={RFValue(13)}
                                    color={colors.PRIMARY_TEXT}
                                    style={{
                                      paddingLeft: RFValue(30),
                                      paddingRight: RFValue(50)
                                    }}
                                  />
                                </Fragment>
                              ) : null}
                            </IdentityText>
                          ))}
                          <TouchableHighlight
                            onPress={() => setDisplayInterest(true)}
                            underlayColor={colors.TRANSPARENT}
                          >
                            <Text
                              style={{
                                display: displayInterest ? 'none' : 'flex',
                                color: colors.PRIMARY,
                                fontSize: fonts.LARGE_SIZE - 2,
                                fontFamily: fonts.WORK_SANS_BOLD,
                                position: 'relative',
                                top: RFValue(10)
                              }}
                            >
                              View more
                            </Text>
                          </TouchableHighlight>
                          {displayInterest ? (
                            <Fragment>
                              {select?.interest
                                ?.slice(1, select?.interest?.length - 1)
                                ?.map((tag) => (
                                  <IdentityText
                                    key={tag}
                                    onPress={() =>
                                      !update ? handleADeleteInterest(tag) : {}
                                    }
                                    style={{
                                      marginRight: RFValue(10),
                                      marginTop: RFValue(10),
                                      borderColor: colors.INACTIVE,
                                      borderWidth: 1.2,
                                      borderRadius: 4,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between'
                                    }}
                                    labelStyle={{
                                      fontFamily: fonts.WORK_SANS_BOLD,
                                      fontSize: fonts.MEDIUM_SIZE,
                                      color: colors.PRIMARY_TEXT,
                                      textTransform: 'capitalize'
                                    }}
                                  >
                                    {tag}
                                    {!update ? (
                                      <Fragment>
                                        <Feather
                                          onPress={() =>
                                            handleADeleteInterest(tag)
                                          }
                                          name="x"
                                          size={RFValue(13)}
                                          color={colors.PRIMARY_TEXT}
                                          style={{
                                            paddingLeft: RFValue(30),
                                            paddingRight: RFValue(50)
                                          }}
                                        />
                                      </Fragment>
                                    ) : null}
                                  </IdentityText>
                                ))}
                              <TouchableHighlight
                                onPress={() => setDisplayInterest(false)}
                                underlayColor={colors.TRANSPARENT}
                                style={{
                                  marginTop: RFValue(10),
                                  position: 'relative',
                                  top: RFValue(10)
                                }}
                              >
                                <Text
                                  style={{
                                    color: colors.PRIMARY,
                                    fontSize: fonts.LARGE_SIZE - 2,
                                    fontFamily: fonts.WORK_SANS_BOLD,
                                    position: 'relative',
                                    top: RFValue(10)
                                  }}
                                >
                                  View less
                                </Text>
                              </TouchableHighlight>
                            </Fragment>
                          ) : null}
                        </Fragment>
                      ) : (
                        <Fragment>
                          {select?.interest?.map((tag) => (
                            <IdentityText
                              key={tag}
                              onPress={() =>
                                !update ? handleADeleteInterest(tag) : {}
                              }
                              style={{
                                marginRight: RFValue(10),
                                marginTop: RFValue(10),
                                borderColor: colors.INACTIVE,
                                borderWidth: 1.2,
                                borderRadius: 4,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                              }}
                              labelStyle={{
                                fontFamily: fonts.WORK_SANS_BOLD,
                                fontSize: fonts.MEDIUM_SIZE,
                                color: colors.PRIMARY_TEXT,
                                textTransform: 'capitalize'
                              }}
                            >
                              {tag}
                              {!update ? (
                                <Fragment>
                                  <Feather
                                    onPress={() => handleADeleteInterest(tag)}
                                    name="x"
                                    size={RFValue(13)}
                                    color={colors.PRIMARY_TEXT}
                                    style={{
                                      paddingLeft: RFValue(30),
                                      paddingRight: RFValue(50)
                                    }}
                                  />
                                </Fragment>
                              ) : null}
                            </IdentityText>
                          ))}
                        </Fragment>
                      )}
                      {cache?.click ? (
                        <Fragment>
                          <TextInput
                            placeholder={t(`community.passport.addInterest`)}
                            onChangeText={(tagText: string) =>
                              setCache({ ...cache, tagText: tagText })
                            }
                            mode="flat"
                            value={cache.tagText}
                            onBlur={() => handleSelectInterest(cache.tagText)}
                            underlineColor={colors.PRIMARY}
                            style={{
                              fontFamily: fonts.WORK_SANS_REGULAR,
                              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                              color: colors.PRIMARY_TEXT,
                              backgroundColor: colors.WHITE,
                              width: '100%',
                              borderWidth: 2,
                              borderColor: colors.WHITE,
                              borderBottomColor: colors.PRIMARY,
                              textTransform: 'capitalize'
                            }}
                          />
                        </Fragment>
                      ) : (
                        <Fragment>
                          {!update ? (
                            <TouchableRipple
                              onPress={() =>
                                setCache({ ...cache, click: true })
                              }
                            >
                              <AddIdentity>+</AddIdentity>
                            </TouchableRipple>
                          ) : null}
                        </Fragment>
                      )}
                    </Identities>
                  </InterestContainer>
                ) : null}

                {participantOf?.length ? (
                  <Fragment>
                    <Cover style={{ flexDirection: 'row' }}>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'uppercase'
                        }}
                      >
                        {t(`community.memberPassport.tribe`)}
                      </Title>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY,
                          marginLeft: RFValue(3)
                        }}
                      >
                        ({participantOf?.length})
                      </Title>
                    </Cover>
                    <FlatList
                      horizontal={true}
                      data={participantOf
                        ?.slice(0, 10)
                        ?.concat([{ lastIndex: true } as any])}
                      renderItem={_renderMyCommunityItem}
                      keyExtractor={(item) => item.id}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ alignItems: 'center' }}
                    />
                  </Fragment>
                ) : null}

                {myChannels?.length ? (
                  <Fragment>
                    <Cover style={{ flexDirection: 'row' }}>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'uppercase'
                        }}
                      >
                        {t(`community.memberPassport.recentChannels`)}
                      </Title>
                    </Cover>
                    <FlatList
                      data={myChannels}
                      horizontal={true}
                      renderItem={_renderMyChannelItem}
                      keyExtractor={(item) => item.id}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ alignItems: 'center' }}
                    />
                  </Fragment>
                ) : null}

                {myConnections?.length ? (
                  <Fragment>
                    <Cover style={{ flexDirection: 'row' }}>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY_TEXT,
                          textTransform: 'uppercase'
                        }}
                      >
                        {t(`community.memberPassport.connection`)}
                      </Title>
                      <Title
                        style={{
                          fontFamily: fonts.WORK_SANS_BOLD,
                          fontSize: RFValue(fonts.MEDIUM_SIZE),
                          color: colors.PRIMARY,
                          marginLeft: RFValue(3)
                        }}
                      >
                        ({myConnections?.length})
                      </Title>
                    </Cover>
                    <FlatList
                      horizontal={true}
                      data={myConnections
                        ?.slice(0, 10)
                        ?.concat([{ lastIndex: true } as any])}
                      keyExtractor={(item) => item.id}
                      renderItem={_renderMyConnectionItem}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ alignItems: 'center' }}
                    />
                  </Fragment>
                ) : null}

                <IdentityModal
                  isVisible={isVisible}
                  closeIdentityModal={showIdentityModal(false)}
                  identity={getIdentity}
                />
                <InterestModal
                  isVisible={interestVisible}
                  closeIdentityModal={showInterestModal(false)}
                  interest={getInterest}
                />
              </ContactContainer>
            </TabCover>
          </Fragment>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </ScreenCover>
  );
}
