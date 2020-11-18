import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { NavigationInterface } from '../../../../types';
import { Title } from 'react-native-paper';
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
  GET_POPULAR_COMMUNITIES
} from '../../../../../graphql/server/query';
import PopularCommunitySkeleton from '../../../../../components/popularCommunitySkeleton';
import RecommendedCommunitySkeleton from '../../../../../components/recommendedCommunitySkeleton';
import ComingSoonCommunities from '../../../../../components/recommendedCommunity/comingSoon';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, CommunityWrapper, PopularContainer } from './styles';
import { tagScreenName } from '../../../../../utils/uxcamHelper';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function CommunityTabScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({ showJoinCommunityModal: false });

  useEffect(() => {
    tagScreenName('ViewAllTribes');
  }, []);

  const {
    loading: recommendedCommunityLoading,
    data: communityData
  } = useQuery(GET_RECOMMENDED_COMMUNITIES);

  const { data: popularData } = useQuery(GET_POPULAR_COMMUNITIES, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 1000
  });

  const community = communityData?.recommendedCommunities;
  const randomCommunity = communityData?.recommendedCommunities[0];

  const popular = popularData?.popularCommunities;
  const _renderPopularCommunityItem = useMemo(
    () => ({ item }: any) => <PopularCommunity key={item.id} {...item} />,
    []
  );

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  return (
    <Fragment>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <StatusBar translucent animated style="dark" />
        <Container>
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
          ) : community.length ? (
            <RecommendedCommunity {...randomCommunity} />
          ) : (
            <ComingSoonCommunities />
          )}

          <PopularContainer>
            {popularData?.popularCommunities.length ? (
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
              data={popular}
              renderItem={_renderPopularCommunityItem}
              ListEmptyComponent={<PopularCommunitySkeleton skeletonSize={3} />}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item: any) => item.id}
            />
          </PopularContainer>
        </Container>
      </ScrollView>
      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}

export default React.memo(CommunityTabScreen);
