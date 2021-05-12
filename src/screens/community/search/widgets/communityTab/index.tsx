import React, {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useEffect
} from 'react';
import { NavigationInterface } from '../../../../types';
import { ActivityIndicator, Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { StatusBar } from 'expo-status-bar';
import { useThemeContext } from '../../../../../theme';
import PopularCommunity from '../../../../../components/popularCommunity';
import RecommendedCommunity from '../../../../../components/recommendedCommunity';
import JoinCommunity from '../../../../../components/joinCommunity';
import {
  GET_RECOMMENDED_COMMUNITIES,
  GET_POPULAR_COMMUNITIES,
  GET_TRENDING_CHANNELS
} from '../../../../../graphql/server/query';
import { PopularCommunitiesRequestInterface } from '../../../../../graphql/types';
import PopularCommunitySkeleton from '../../../../../components/popularCommunitySkeleton';
import RecommendedCommunitySkeleton from '../../../../../components/recommendedCommunitySkeleton';
import ComingSoonCommunities from '../../../../../components/recommendedCommunity/comingSoon';
import { PAGINATION_DEFAULT } from '../../../../../constants';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import MyChannel from '../../../../../components/channelCard';
import RecommendedUserSkeleton from '../../../../../components/recommendedUserSkeleton';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  CommunityWrapper,
  PopularContainer,
  RecommendedList,
  RecommendedListHeader
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function CommunityTabScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  useEffect(() => {
    tagScreenName('ViewAllTribes');
  }, []);

  const {
    loading: recommendedCommunityLoading,
    data: communityData
  } = useQuery(GET_RECOMMENDED_COMMUNITIES);

  const { data: popularData, fetchMore, refetch } = useQuery<
    PopularCommunitiesRequestInterface
  >(GET_POPULAR_COMMUNITIES, {
    variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } }
  });

  const { data: trendingChannelData } = useQuery(GET_TRENDING_CHANNELS, {
    variables: {
      input: { limit: PAGINATION_DEFAULT * (PAGINATION_DEFAULT / 2), skip: 0 }
    }
  });

  const trendingChannels = trendingChannelData?.trendingChannels;
  const randomCommunity = communityData?.recommendedCommunities?.data[0];
  const popularCommunity = popularData?.popularCommunities;
  const sort = popularCommunity?.data;
  const sortPopularCommunity = sort?.slice().sort(function (a, b) {
    return b.membersCount - a.membersCount;
  });

  const handleEndReach = async () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: {
          skip: popularCommunity?.data.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          popularCommunities: {
            ...prev.popularCommunities,
            data: [
              ...prev.popularCommunities.data,
              ...fetchMoreResult.popularCommunities.data
            ]
          }
        });
      }
    });
  };

  const _renderPopularCommunityItem = useMemo(
    () => ({ item }: any) => (
      <PopularCommunity key={item.id} {...item} refetchCommunity={refetch} />
    ),
    []
  );

  const _renderMyChannelItem = ({ item }: { item: any }) => (
    <MyChannel key={item.id} {...item.channel} />
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const handleJoinCommunity = () => setShowModal(!showModal);

  return (
    <Fragment>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <StatusBar translucent animated style="dark" />
        <Container>
          {trendingChannels?.data?.length ? (
            <RecommendedList
              style={{
                paddingBottom: RFValue(20)
              }}
            >
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
                  {t(`community.recommended.trendingChannel`)}
                </Title>
              </RecommendedListHeader>
              <FlatList
                data={trendingChannels.data}
                horizontal={true}
                renderItem={_renderMyChannelItem}
                ListEmptyComponent={
                  <RecommendedUserSkeleton skeletonSize={4} />
                }
                showsHorizontalScrollIndicator={false}
                keyExtractor={(channel) => channel.id}
                contentContainerStyle={{ paddingLeft: 15, marginTop: 20 }}
              />
            </RecommendedList>
          ) : null}
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              paddingLeft: RFValue(15),
              marginBottom: RFValue(15)
            }}
          >
            {t(`community.tabPanel.featured`)}
          </Title>
          {recommendedCommunityLoading ? (
            <RecommendedCommunitySkeleton />
          ) : randomCommunity ? (
            <RecommendedCommunity {...randomCommunity} />
          ) : (
            <ComingSoonCommunities />
          )}

          <PopularContainer>
            {popularCommunity?.data?.length ? (
              <CommunityWrapper>
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
                  {t(`community.tabPanel.popular`)}
                </Title>
              </CommunityWrapper>
            ) : null}

            <FlatList
              data={sortPopularCommunity}
              renderItem={_renderPopularCommunityItem}
              ListEmptyComponent={<PopularCommunitySkeleton skeletonSize={3} />}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              scrollEventThrottle={16}
              onEndReachedThreshold={0.5}
              removeClippedSubviews={true}
              ListFooterComponent={_renderFooter}
              onMomentumScrollEnd={handleEndReach}
              onEndReached={() => {
                if (
                  popularCommunity &&
                  popularCommunity?.metadata.totalCount >
                    popularCommunity.data.length
                ) {
                  setCallOnScrollEnd(true);
                }
              }}
            />
          </PopularContainer>
        </Container>
      </ScrollView>
      {showModal ? <JoinCommunity onPress={handleJoinCommunity} /> : null}
    </Fragment>
  );
}

export default React.memo(CommunityTabScreen);
