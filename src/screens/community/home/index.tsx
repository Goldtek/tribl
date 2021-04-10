import React, {
  Fragment,
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import * as Location from 'expo-location';
import { Title, ActivityIndicator } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import Swiper from 'react-native-swiper';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { FlatList } from 'react-native-gesture-handler';
import RecommendedUser from '../../../components/recommendedUser';
import RecommendedCommunity from '../../../components/recommendedCommunity';
import RecentActivity from '../../../components/recentActivity';
import JoinCommunity from '../../../components/joinCommunity';
import { Mixpanel } from '../../../config';
import {
  GET_RECOMMENDED_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS,
  GET_MY_COMMUNITIES,
  GET_ALL_MEMBERS,
  GET_CONNECTION_REQUEST,
  GET_MY_CONNECTIONS,
  GET_NEARBY_MEMBERS,
  GET_POPULAR_COMMUNITIES,
  GET_TRENDING_CHANNELS,
  USER_CHANNELS,
  GET_USER_PASSPORT,
  GET_FIREBASE_TOKEN
} from '../../../graphql/server/query';
import { UPDATE_PASSPORT } from '../../../graphql/server/mutations';
import MyChannel from '../../../components/channelCard';
import RecommendedUserSkeleton from '../../../components/recommendedUserSkeleton';
import MyCommunitySkeleton from '../../../components/myCommunitiesSkeleton';
import RecommendedCommunitySkeleton from '../../../components/recommendedCommunitySkeleton';
import ComingSoonCommunities from '../../../components/recommendedCommunity/comingSoon';
import {
  PassportInterface,
  MyCommunitiesRequestInterface,
  RecommendedCommunitiesRequestInterface,
  CommunityInterface,
  ChannelInterface,
  MyChannelRequestInterface,
  GenerateFirebaseTokenIT
} from '../../../graphql/types';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import hexToRGB from '../../../utils/hexToRGB';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';
import GradientButton from '../../../components/gradientButton';
import { useIsFocused } from '@react-navigation/native';
import MyCommunity from '../../../components/myCommunities';
import Storage from '../../../libs/storage';
import Firechat from '../../../firebase';

// IMPORT FOR ALL CUSTOM STYLES
import {
  ScrollView,
  RecommendedList,
  RecommendedListHeader,
  RecommendedCommunityContainer,
  RecentActivitiesList,
  CommunityCover
  // ButtonWrapper
} from './styles';
import { crashlytics } from '../../../firebase/config';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

const recentActivities: any[] = [];

export default function HomeScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const [state, setState] = useState({
    showJoinCommunityModal: false,
    update: false
  });

  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const { data: firebase, loading: firebaseLoading } = useQuery<
    GenerateFirebaseTokenIT
  >(GET_FIREBASE_TOKEN);

  const {
    data: myCommunityData,
    refetch: myCommunityRefetch,
    loading: myCommunityLoading,
    fetchMore: myCommunityFetchMore
  } = useQuery<MyCommunitiesRequestInterface>(GET_MY_COMMUNITIES, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
  });

  const [getConnectionRequest] = useLazyQuery(GET_CONNECTION_REQUEST, {
    variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } }
  });

  const [getUserPassport, { data: userData }] = useLazyQuery(GET_USER_PASSPORT);

  const [getNearbyMembers] = useLazyQuery(GET_NEARBY_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
  });

  const [getMyConnections] = useLazyQuery(GET_MY_CONNECTIONS, {
    variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } }
  });

  const [getAllMembers] = useLazyQuery(GET_ALL_MEMBERS, {
    variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } }
  });

  const [getPopularCommunities] = useLazyQuery(GET_POPULAR_COMMUNITIES, {
    variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } }
  });

  useEffect(() => {
    tagScreenName('TriblScreen');
    getPopularCommunities();
    getConnectionRequest();
    getNearbyMembers();
    getMyConnections();
    getAllMembers();
    getUserPassport();
    handleLocation();
  }, []);

  useEffect(() => {
    if (firebase?.generateFirebaseToken) {
      Storage.setUserCredentials(firebase?.generateFirebaseToken);
      Firechat.signIn(firebase?.generateFirebaseToken.firebase_token);
    }
  }, [firebaseLoading]);

  const {
    loading: recommendedCommunityLoading,
    data: communityData
  } = useQuery<RecommendedCommunitiesRequestInterface>(
    GET_RECOMMENDED_COMMUNITIES
  );

  const { data: myChannelsData, refetch: refetchMyChannels } = useQuery<
    MyChannelRequestInterface
  >(USER_CHANNELS, {
    variables: {
      input: { limit: PAGINATION_DEFAULT * (PAGINATION_DEFAULT / 2), skip: 0 }
    }
  });

  const { data: membersData } = useQuery(GET_RECOMMENDED_MEMBERS, {
    variables: {
      input: { limit: PAGINATION_DEFAULT / 2 }
    }
  });

  const userDetails = userData?.myPassport;
  const currentLocation = userDetails?.currentLocation;

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
        await updatePassport();
        Mixpanel.track('User Update Location', {
          info: `User ${userDetails.firstName} ${userDetails.lastName} updates location`,
          'Activity Screen': 'Community screen'
        });
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const [updatePassport] = useMutation(UPDATE_PASSPORT, {
    variables: {
      payload: {
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

  const myChannels = myChannelsData?.myChannels;
  const myCommunities = myCommunityData?.myCommunities;
  const recommendedMembers = membersData?.recommendedMembers?.data;
  const communities = communityData?.recommendedCommunities?.data
    .slice()
    .sort((a) => {
      if (a.name.includes('REFitness Group')) return -1;
      return 0;
    });

  useEffect(() => {
    myCommunities && myCommunityRefetch();
    myChannels && refetchMyChannels();
  }, [isFocused]);

  const navigateToSearch = (index: number) => {
    navigation.navigate('CommunitySearchScreen', { index: index });
  };

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  const _renderMyCommunityItem = useMemo(
    () => ({ item }: { item: CommunityInterface }) => (
      <MyCommunity key={item.id} {...item} />
    ),
    []
  );

  const _renderMyChannelItem = ({ item }: { item: ChannelInterface }) => (
    <MyChannel key={item.id} {...item} />
  );

  const _renderRecommendedMember = useMemo(
    () => ({ item }: { item: PassportInterface }) => (
      <RecommendedUser key={item.id} {...item} />
    ),
    []
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const handleEndReach = () => {
    if (!callOnScrollEnd) return;

    myCommunityFetchMore({
      variables: {
        input: {
          skip: myCommunities?.data.length,
          limit: PAGINATION_DEFAULT / 2
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          myCommunities: {
            ...prev.myCommunities,
            data: [
              ...prev.myCommunities.data,
              ...fetchMoreResult.myCommunities.data
            ]
          }
        });
      }
    });
  };

  return (
    <Fragment>
      <ScrollView
        bounces={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <StatusBar translucent animated style="dark" />
        {myCommunityLoading ? (
          <CommunityCover>
            <MyCommunitySkeleton skeletonSize={2} />
          </CommunityCover>
        ) : myCommunities?.data.length ? (
          <RecommendedList>
            <RecommendedListHeader>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  lineHeight: 20,
                  marginTop: 0,
                  marginBottom: 0
                }}
              >
                {t(`community.recommended.myCommunity`)}
              </Title>
            </RecommendedListHeader>
            <FlatList
              data={myCommunities?.data}
              horizontal={true}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={<MyCommunitySkeleton skeletonSize={2} />}
              onEndReached={() => {
                if (
                  myCommunities &&
                  myCommunities?.metadata.totalCount >
                    myCommunities?.data.length
                ) {
                  setCallOnScrollEnd(true);
                }
              }}
              ListFooterComponent={_renderFooter}
              renderItem={_renderMyCommunityItem}
              onMomentumScrollEnd={handleEndReach}
              ListFooterComponentStyle={{ justifyContent: 'center' }}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: 10,
                paddingLeft: 15,
                backgroundColor: colors.WHITE
              }}
            />
          </RecommendedList>
        ) : null}
        {myChannels?.data?.length ? (
          <RecommendedList
            style={{
              paddingBottom: RFValue(15)
            }}
          >
            <RecommendedListHeader style={{ paddingLeft: 15 }}>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.recommended.myChannel`)}
              </Title>

              {/* <GradientButton
                gradientContainerstyle={{
                  height: RFValue(0),
                  paddingVertical: 15,
                  marginTop: 0
                }}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  textTransform: 'capitalize'
                }}
                mode="text"
                onPress={() => {
                  Mixpanel.track('User Taps View More (Channels)', {
                    info: 'User taps view more trending (Channels)',
                    'Activity Screen': 'View More Trending Channels Button'
                  });
                  logEvent('view more channels', { from: 'community' });
                  navigateToSearch(1);
                }}
              >
                {t(`community.recommended.view`)}
              </GradientButton> */}
            </RecommendedListHeader>
            <RecommendedCommunityContainer>
              <FlatList
                data={myChannels.data}
                horizontal={true}
                renderItem={_renderMyChannelItem}
                ListEmptyComponent={
                  <RecommendedUserSkeleton skeletonSize={4} />
                }
                showsHorizontalScrollIndicator={false}
                keyExtractor={(channel) => channel.id}
                contentContainerStyle={{ paddingLeft: 15 }}
              />
            </RecommendedCommunityContainer>
          </RecommendedList>
        ) : null}

        <RecommendedList>
          <RecommendedListHeader style={{ paddingLeft: 15 }}>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {t(`community.recommended.community`)}
            </Title>

            <GradientButton
              gradientContainerstyle={{
                height: RFValue(0),
                paddingVertical: 15,
                marginTop: 0
              }}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
              mode="text"
              onPress={() => {
                Mixpanel.track('User Taps View More (Tribes)', {
                  info: 'User taps view more recommended (Tribes)',
                  'Activity Screen': 'View More Recommended Tribes Button'
                });
                logEvent('view more tribes', { from: 'community' });
                navigateToSearch(1);
              }}
            >
              {t(`community.recommended.view`)}
            </GradientButton>
          </RecommendedListHeader>
          <RecommendedCommunityContainer>
            {recommendedCommunityLoading ? (
              <RecommendedCommunitySkeleton />
            ) : communities?.length ? (
              <Swiper
                loop={false}
                scrollEnabled={true}
                containerStyle={{ height: RFValue(300) }}
                paginationStyle={{
                  position: 'absolute',
                  left: DEVICE_FULL_WIDTH / 2 + 60,
                  bottom: 300 / 3
                }}
                activeDotColor={colors.WHITE}
                dotColor={hexToRGB(colors.WHITE, 0.6)}
              >
                {communities.map((community) => (
                  <RecommendedCommunity key={community.id} {...community} />
                ))}
              </Swiper>
            ) : (
              <ComingSoonCommunities />
            )}
          </RecommendedCommunityContainer>
        </RecommendedList>

        <RecommendedList>
          <RecommendedListHeader>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {t(`community.recommended.members`)}
            </Title>

            <GradientButton
              gradientContainerstyle={{
                height: RFValue(0),
                paddingVertical: 15,
                marginTop: 0
              }}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
              mode="text"
              onPress={() => {
                Mixpanel.track('User Taps View More (Members)', {
                  info: 'User taps view more recommended (Members)',
                  'Activity Screen': 'View More Recommended Members Button'
                });
                logEvent('view more members', { from: 'community' });
                navigateToSearch(0);
              }}
            >
              {t(`community.recommended.view`)}
            </GradientButton>
          </RecommendedListHeader>
          <FlatList
            data={recommendedMembers}
            horizontal={true}
            renderItem={_renderRecommendedMember}
            ListEmptyComponent={<RecommendedUserSkeleton skeletonSize={4} />}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(member) => member.id}
            contentContainerStyle={{
              marginTop: 20,
              paddingLeft: 15,
              paddingBottom: 20
            }}
          />
        </RecommendedList>

        {recentActivities.length ? (
          <RecentActivitiesList>
            <RecommendedListHeader>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  lineHeight: 20,
                  marginTop: 0,
                  marginBottom: 30
                }}
              >
                {t(`community.recommended.activity`)}
              </Title>
            </RecommendedListHeader>

            {recentActivities.map((activity) => (
              <RecentActivity key={activity.name} {...activity} />
            ))}
          </RecentActivitiesList>
        ) : null}
      </ScrollView>

      {/* <ButtonWrapper>
        <Button
          onPress={navigateToCreateNewTribeScreen}
          mode="contained"
          labelStyle={{
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            color: colors.WHITE,
            textTransform: 'capitalize'
          }}
          style={{
            backgroundColor: colors.PRIMARY_TEXT,
            width: RFPercentage(25),
            borderRadius: RFValue(50)
          }}
        >
          {t(`community.createTribe.buttonText`)}
        </Button>
      </ButtonWrapper> */}

      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}
