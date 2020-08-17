import React, { Fragment, useState, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { Title, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import RecommendedUser from '../../../components/recommendedUser';
import RecommendedCommunity from '../../../components/recommendedCommunity';
import RecentActivity from '../../../components/recentActivity';
import { useNavigation } from '@react-navigation/native';
import JoinCommunity from '../../../components/joinCommunity';
import { REFRESH_TOKEN } from '../../../graphql/server/mutations';
import Storage from '../../../storage';
import {
  GET_RECOMMENDED_COMMUNITIES,
  GET_RECOMMENDED_MEMBERS
} from '../../../graphql/server/query';
import { VerifyOTPIT } from '../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import {
  ScrollView,
  RecommendedList,
  RecommendedListHeader,
  RecommendedCommunityContainer,
  RecentActivitiesList
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  recentActivities: {
    name: string;
    action: string;
    avatar: string;
    date: string;
  }[];
}

export default function HomeScreen(props: ScreenProp) {
  const credentials = Storage.getUserCredentials();
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  console.tron('cred', credentials);

  const navigation = useNavigation();

  const {
    data: communityData,
    error: communityError,
    refetch: communityRefetch
  } = useQuery(GET_RECOMMENDED_COMMUNITIES);

  const {
    data: membersData,
    error: memberError,
    refetch: memberRefetch
  } = useQuery(GET_RECOMMENDED_MEMBERS);

  const Members = membersData?.recommendedMembers;

  const community = communityData?.recommendedCommunities[0];
  const [refreshToken] = useMutation<VerifyOTPIT>(REFRESH_TOKEN, {
    variables: {
      payload: {
        refreshToken: credentials?.refresh_token
      }
    }
  });

  useEffect(() => {
    const expiredToken = 'GraphQL error: provided token has expired';
    if (
      communityError?.message == expiredToken ||
      memberError?.message == expiredToken
    ) {
      const RefreshToken = async () => {
        const { data } = await refreshToken();
        if (data) {
          const Credentails = {
            ...credentials,
            id_token: data?.refreshToken.id_token
          } as VerifyOTPIT;

          Storage.setCredentialInstance(Credentails);
          Storage.setUserCredentials();
          communityRefetch();
          memberRefetch();
        }
      };
      RefreshToken();
    }
  }, []);

  const [state, setState] = useState({ showJoinCommunityModal: false });

  const { recentActivities } = props;

  const navigateToSearch = () => navigation.navigate('CommunitySearchScreen');

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  return (
    <Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={{ flexGrow: 1, paddingBottom: RFValue(20) }}
      >
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
              onPress={navigateToSearch}
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
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 20, backgroundColor: colors.WHITE }}
          >
            {Members?.map((member: any, index: number) => (
              <RecommendedUser
                key={member.id}
                {...member}
                index={index}
                lastChild={Members.length - 1}
              />
            ))}
          </ScrollView>
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
              onPress={navigateToSearch}
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
            <RecommendedCommunity
              {...community}
              onPress={handleJoinCommunity}
            />
          </RecommendedCommunityContainer>
        </RecommendedList>

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
      </ScrollView>
      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}

HomeScreen.defaultProps = {
  recentActivities: [
    {
      name: 'Alex Muleba',
      action: 'sent money to Uche Nnadi',
      avatar: 'https://picsum.photos/700',
      date: '2m ago'
    },
    {
      name: 'Blair Bashen',
      action: 'Joined #Afropolitan',
      avatar: 'https://picsum.photos/700',
      date: '10m ago'
    },
    {
      name: 'Kobla',
      action: 'Joined #AustineJusticeCoalition',
      avatar: 'https://picsum.photos/700',
      date: '45m ago'
    },
    {
      name: 'Erikan O.',
      action: 'Donated to #BlackLivesMatter',
      avatar: 'https://picsum.photos/700',
      date: '2h ago'
    },
    {
      name: 'Josephine Kellner',
      action: 'sent money to Jasmine',
      avatar: 'https://picsum.photos/700',
      date: '8h ago'
    },
    {
      name: 'Spencer Evans',
      action: 'added mutual connection Mbiyimoh',
      avatar: 'https://picsum.photos/700',
      date: '12h ago'
    }
  ]
};
