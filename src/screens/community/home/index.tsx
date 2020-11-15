import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { Title, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import Swiper from 'react-native-swiper';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
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
  GET_POPULAR_COMMUNITIES
} from '../../../graphql/server/query';
import MyCommunity from '../../../components/myCommunities';
import RecommendedUserSkeleton from '../../../components/recommendedUserSkeleton';
import MyCommunitySkeleton from '../../../components/myCommunitiesSkeleton';
import RecommendedCommunitySkeleton from '../../../components/recommendedCommunitySkeleton';
import ComingSoonCommunities from '../../../components/recommendedCommunity/comingSoon';
import {
  PassportInterface,
  MyCommunitiesRequestInterface,
  RecommendedCommunitiesRequestInterface,
  CommunityInterface
} from '../../../graphql/types';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import hexToRGB from '../../../utils/hexToRGB';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import {
  ScrollView,
  RecommendedList,
  RecommendedListHeader,
  RecommendedCommunityContainer,
  RecentActivitiesList,
  CommunityCover
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

const recentActivities: any[] = [];

export default function HomeScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    showJoinCommunityModal: false,
    update: false
  });

  const { loading: myCommunityLoading, data: myCommunityData } = useQuery<
    MyCommunitiesRequestInterface
  >(GET_MY_COMMUNITIES, { pollInterval: 500 });

  const [getConnectionRequest] = useLazyQuery(GET_CONNECTION_REQUEST);

  const [getNearbyMembers] = useLazyQuery(GET_NEARBY_MEMBERS);

  const [getMyConnections] = useLazyQuery(GET_MY_CONNECTIONS);

  const [getAllMembers] = useLazyQuery(GET_ALL_MEMBERS);

  const [getPopularCommunities] = useLazyQuery(GET_POPULAR_COMMUNITIES);

  useEffect(() => {
    tagScreenName('TriblScreen');
    getPopularCommunities();
    getConnectionRequest();
    getNearbyMembers();
    getMyConnections();
    getAllMembers();
  }, []);

  const {
    loading: recommendedCommunityLoading,
    data: communityData
  } = useQuery<RecommendedCommunitiesRequestInterface>(
    GET_RECOMMENDED_COMMUNITIES,
    { pollInterval: 500 }
  );

  const { data: membersData } = useQuery(GET_RECOMMENDED_MEMBERS, {
    variables: { filter: { verified: true } }
  });

  const myCommunity = myCommunityData?.myCommunities;
  const recommendedMembers = membersData?.recommendedMembers;
  const communities = communityData?.recommendedCommunities
    .slice()
    .sort((a) => {
      if (a.name.includes('REFitness Group')) return -1;
      return 0;
    });

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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: RFValue(20) }}
      >
        <StatusBar translucent animated style="dark" />
        {myCommunityLoading ? (
          <CommunityCover>
            <MyCommunitySkeleton skeletonSize={2} />
          </CommunityCover>
        ) : myCommunity?.length ? (
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
              data={myCommunity}
              ListEmptyComponent={<MyCommunitySkeleton skeletonSize={2} />}
              horizontal={true}
              renderItem={_renderMyCommunityItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: 10,
                paddingLeft: 15,
                backgroundColor: colors.WHITE
              }}
            />
          </RecommendedList>
        ) : null}
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
              {t(`community.recommended.members`)}
            </Title>

            <Button
              mode="text"
              onPress={() => {
                Mixpanel.track('User Taps View More (Members)', {
                  info: 'User taps view more recommended (Members)',
                  'Activity Screen': 'View More Recommended Members Button'
                });
                logEvent('view more members', { from: 'community' });
                navigateToSearch(0);
              }}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {t(`community.recommended.view`)}
            </Button>
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
              backgroundColor: colors.WHITE
            }}
          />
        </RecommendedList>

        <RecommendedList>
          <RecommendedListHeader style={{ paddingLeft: 15 }}>
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
              {t(`community.recommended.community`)}
            </Title>

            <Button
              mode="text"
              onPress={() => {
                Mixpanel.track('User Taps View More (Tribes)', {
                  info: 'User taps view more recommended (Tribes)',
                  'Activity Screen': 'View More Recommended Tribes Button'
                });
                logEvent('view more tribes', { from: 'community' });
                navigateToSearch(1);
              }}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {t(`community.recommended.view`)}
            </Button>
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
                  right: RFValue(-DEVICE_FULL_WIDTH / 1.5),
                  bottom: RFValue(80)
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

      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}
