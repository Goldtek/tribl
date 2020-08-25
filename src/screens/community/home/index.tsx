import React, { Fragment, useState, useMemo, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { Title, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@apollo/react-hooks';
import { FlatList } from 'react-native-gesture-handler';
import RecommendedUser from '../../../components/recommendedUser';
import RecommendedCommunity from '../../../components/recommendedCommunity';
import RecentActivity from '../../../components/recentActivity';
import JoinCommunity from '../../../components/joinCommunity';
import { GenerateFirebaseTokenIT } from '../../../graphql/types';
import Firechat from '../../../firebase';
import Storage from '../../../storage';
import {
  GET_RECOMMENDED_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS,
  GET_MY_COMMUNITIES,
  GET_FIREBASE_TOKEN,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import MyCommunity from '../../../components/myCommunities';
import RecommendedUserSkeleton from '../../../components/recommendedUserSkeleton';
import MyCommunitySkeleton from '../../../components/myCommunitiesSkeleton';
import RecommendedCommunitySkeleton from '../../../components/recommendedCommunitySkeleton';
import checkAppUpdates from '../../../libs/updates';

// IMPORT FOR ALL CUSTOM STYLES
import {
  ScrollView,
  RecommendedList,
  RecommendedListHeader,
  RecommendedCommunityContainer,
  RecentActivitiesList
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

const recentActivities: any[] = [];

export default function HomeScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({ showJoinCommunityModal: false });

  useQuery(GET_USER_PASSPORT);
  const { data: myCommunityData } = useQuery(GET_MY_COMMUNITIES);
  const { data: communityData } = useQuery(GET_RECOMMENDED_COMMUNITIES);
  const { data: membersData } = useQuery(GET_RECOMMENDED_MEMBERS);

  const myCommunity = myCommunityData?.myCommunities;
  const recommendedMembers = membersData?.recommendedMembers;
  const community = communityData?.recommendedCommunities[0];

  const { data: firebase, loading } = useQuery<GenerateFirebaseTokenIT>(
    GET_FIREBASE_TOKEN
  );

  useEffect(() => {
    const getFirebaseToken = async () => {
      if (firebase?.generateFirebaseToken) {
        Storage.setUserCredentials(firebase?.generateFirebaseToken);
        Firechat.signIn(firebase?.generateFirebaseToken.firebase_token);
      }
      await checkAppUpdates();
    };
    getFirebaseToken();
  }, [loading]);

  const navigateToSearch = (index: number) => () => {
    navigation.navigate('CommunitySearchScreen', { index });
  };

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  const _renderMyCommunityItem = useMemo(
    () => ({ item, index }: any) => (
      <MyCommunity
        key={item.id}
        {...item}
        index={index}
        lastChild={myCommunity?.length - 1}
      />
    ),
    []
  );

  const _renderRecommendedMember = useMemo(
    () => ({ item, index }: any) => (
      <RecommendedUser
        key={item.id}
        index={index}
        {...item}
        lastChild={recommendedMembers?.length - 1}
      />
    ),
    []
  );

  return (
    <Fragment>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: RFValue(20) }}
      >
        <StatusBar translucent animated style="dark" />
        {myCommunity?.length ? (
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
              ListEmptyComponent={<MyCommunitySkeleton skeletonSize={4} />}
              horizontal={true}
              renderItem={_renderMyCommunityItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                marginTop: 10,
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
              onPress={navigateToSearch(0)}
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
            contentContainerStyle={{
              marginTop: 20,
              paddingHorizontal: 15,
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
              onPress={navigateToSearch(1)}
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
            {community ? (
              <RecommendedCommunity
                {...community}
                onPress={handleJoinCommunity}
              />
            ) : null}
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
