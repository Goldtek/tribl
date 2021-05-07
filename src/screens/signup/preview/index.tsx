import React, {
  Fragment,
  useState,
  useMemo,
  useEffect,
  useCallback
} from 'react';
import * as Location from 'expo-location';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Swiper from 'react-native-swiper';
import { useQuery } from '@apollo/react-hooks';
import { FlatList } from 'react-native-gesture-handler';
import RecommendedUser from '../../../components/previewRecommendedUser';
import RecommendedCommunity from './widget/recommendedCommunity';
import {
  GET_NOAUTH_RECOMMENDED_COMMUNITIES,
  GET_NOAUTH_RECOMMENDED_MEMBERS,
  GET_TRENDING_CHANNELS
} from '../../../graphql/server/query';
import MyChannel from './widget/channelCard';
import RecommendedUserSkeleton from '../../../components/recommendedUserSkeleton';
import RecommendedCommunitySkeleton from '../../../components/recommendedCommunitySkeleton';
import ComingSoonCommunities from './widget/recommendedCommunity/comingSoon';
import { PassportInterface } from '../../../graphql/types';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import hexToRGB from '../../../utils/hexToRGB';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';
import GradientButton from '../../../components/gradientButton';
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';
import SignupModal from '../../../components/signupModal';
import { crashlytics } from '../../../firebase/config';
import { Mixpanel } from '../../../config';

// IMPORT FOR ALL CUSTOM STYLES
import {
  ScrollView,
  RecommendedList,
  RecommendedListHeader,
  RecommendedCommunityContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function HomeScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const [location, setLocation] = useState({
    lat: 0,
    long: 0,
    city: '',
    state: '',
    country: ''
  });

  const showSignupModal = useCallback(
    (visible: boolean) => () => {
      setVisible(visible);
      return true;
    },
    []
  );

  useEffect(() => {
    if (isFocused) {
      setVisible(true);
    }
  }, [isFocused]);

  useEffect(() => {
    handleLocation();
    tagScreenName('PreviewScreen');
  }, []);

  const handleLocation = async () => {
    try {
      await Location.requestPermissionsAsync();

      const { coords } = await Location.getLastKnownPositionAsync();

      const [currentLocation] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude
      });
      const { city, region: state, country } = currentLocation;
      setLocation({
        ...location,
        lat: coords.latitude,
        long: coords.longitude,
        city,
        state,
        country
      });
      Mixpanel.track('Get UserLocation', {
        info: `User  updates location`,
        'Activity Screen': 'Preview screen'
      });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const {
    loading: recommendedCommunityLoading,
    data: communityData,
    refetch: communityRefetch
  } = useQuery(GET_NOAUTH_RECOMMENDED_COMMUNITIES, {
    variables: {
      input: {
        limit: 5,
        currentLocation: {
          lat: location?.lat,
          long: location?.long,
          city: location?.city,
          state: location?.state,
          country: location?.country
        }
      }
    }
  });

  const {
    data: trendingChannelData,
    refetch: refetchtrendingChannels
  } = useQuery(GET_TRENDING_CHANNELS, {
    variables: {
      input: { limit: PAGINATION_DEFAULT * (PAGINATION_DEFAULT / 2), skip: 0 }
    }
  });

  const { data: membersData, refetch: recommendedRefetch } = useQuery(
    GET_NOAUTH_RECOMMENDED_MEMBERS,
    {
      variables: {
        input: {
          limit: 8,
          currentLocation: {
            lat: location?.lat,
            long: location?.long,
            city: location?.city,
            state: location?.state,
            country: location?.country
          }
        }
      }
    }
  );

  useEffect(() => {
    communityRefetch();
    recommendedRefetch();
  }, [location]);

  const trendingChannels = trendingChannelData?.trendingChannels;
  const recommendedMembers = membersData?.noAuthRecommendedMembers?.data;
  const filterRecommendedMebers = removeDuplicateMembers(
    recommendedMembers?.slice()
  );

  const communities = communityData?.noAuthRecommendedCommunities?.data
    .slice()
    .sort((a: any) => {
      if (a.name.includes('REFitness Group')) return -1;
      return 0;
    });

  useEffect(() => {
    trendingChannels && refetchtrendingChannels();
    recommendedMembers && recommendedRefetch();
  }, [isFocused]);

  const _renderMyChannelItem = ({ item }: { item: any }) => (
    <MyChannel
      key={item.id}
      {...item.channel}
      showModal={showSignupModal(true)}
    />
  );

  const _renderRecommendedMember = useMemo(
    () => ({ item }: { item: PassportInterface }) => (
      <RecommendedUser key={item.id} {...item} />
    ),
    []
  );

  return (
    <Fragment>
      <ScrollView
        bounces={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <StatusBar translucent animated style="dark" />
        {trendingChannels?.data?.length ? (
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
                {t(`community.recommended.trendingChannel`)}
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
                onPress={showSignupModal(true)}
              >
                {t(`community.recommended.view`)}
              </GradientButton>
            </RecommendedListHeader>
            <RecommendedCommunityContainer>
              <FlatList
                data={trendingChannels.data}
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
              onPress={showSignupModal(true)}
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
                {communities.map((community: any) => (
                  <RecommendedCommunity
                    key={community.id}
                    {...community}
                    location={location}
                  />
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
              onPress={showSignupModal(true)}
            >
              {t(`community.recommended.view`)}
            </GradientButton>
          </RecommendedListHeader>
          <FlatList
            data={filterRecommendedMebers}
            horizontal={true}
            renderItem={_renderRecommendedMember}
            ListEmptyComponent={<RecommendedUserSkeleton skeletonSize={4} />}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(member) => member.id}
            contentContainerStyle={{
              marginTop: 20,
              paddingLeft: 15,
              paddingBottom: visible ? RFValue(100) : RFValue(20)
            }}
          />
        </RecommendedList>
        <SignupModal
          closeSignupModal={showSignupModal(false)}
          isVisible={visible}
        />
      </ScrollView>
    </Fragment>
  );
}
