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
import { FlatList } from 'react-native';
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
import {
  CommunityInterface,
  PopularCommunitiesRequestInterface
} from '../../../../../graphql/types';
import PopularCommunitySkeleton from '../../../../../components/popularCommunitySkeleton';
import RecommendedCommunitySkeleton from '../../../../../components/recommendedCommunitySkeleton';
import ComingSoonCommunities from '../../../../../components/recommendedCommunity/comingSoon';
import { PAGINATION_DEFAULT } from '../../../../../constants';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import MyChannel from '../../../../../components/channelCard';
import RecommendedUserSkeleton from '../../../../../components/recommendedUserSkeleton';
import { crashlytics } from '../../../../../firebase/config';

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
    data: communityData,
    loading: recommendedCommunityLoading
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

  const removeDuplicates = (communities?: CommunityInterface[]) => {
    if (!communities) return;
    const uniqueMap: { [key: string]: CommunityInterface } = {};
    for (let index = 0; index < communities.length; index++) {
      const community = communities[index];
      if (!uniqueMap[community.id]) {
        uniqueMap[community.id] = community;
      }
    }
    return Object.values(uniqueMap).sort(
      (a, b) => b.membersCount - a.membersCount
    );
  };

  const trendingChannels = trendingChannelData?.trendingChannels;
  const randomCommunity = communityData?.recommendedCommunities?.data[0];
  const popularCommunity = popularData?.popularCommunities;
  const sortPopularCommunity = removeDuplicates(popularCommunity?.data);

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
    }).catch((error) => {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    });
  };

  const _renderPopularCommunityItem = useMemo(
    () => ({ item, index }: any) => (
      <Fragment key={item.id}>
        {index === 0 && popularCommunity?.data?.length && (
          <PopularContainer>
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
          </PopularContainer>
        )}
        <PopularCommunity {...item} refetchCommunity={refetch} />
      </Fragment>
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

  const ListHeaderComponent = (
    <Fragment>
      {trendingChannels?.data?.length ? (
        <RecommendedList style={{ paddingBottom: RFValue(20) }}>
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
            horizontal={true}
            data={trendingChannels.data}
            renderItem={_renderMyChannelItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(channel) => channel.id}
            ListEmptyComponent={<RecommendedUserSkeleton skeletonSize={4} />}
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
    </Fragment>
  );

  return (
    <Fragment>
      <StatusBar translucent animated style="dark" />
      <Container>
        <FlatList
          data={sortPopularCommunity}
          renderItem={_renderPopularCommunityItem}
          ListEmptyComponent={<PopularCommunitySkeleton skeletonSize={3} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          scrollEventThrottle={16}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          bounces={false}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={_renderFooter}
          contentContainerStyle={{ paddingBottom: 20 }}
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
      </Container>
      {showModal ? <JoinCommunity onPress={handleJoinCommunity} /> : null}
    </Fragment>
  );
}

export default React.memo(CommunityTabScreen);
