import React from 'react';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { Title, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import RecommendedUser from '../../../components/recommendedUser';
import RecommendedCommunity from '../../../components/recommendedCommunity';
import RecentActivity from '../../../components/recentActivity';

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
  recommendedMembers: {
    name: string;
    address: string;
    avatar: string;
  }[];
  recommendedCommunity: {
    name: string;
    members: string;
    avatar: string;
  };
  recentActivities: {
    name: string;
    action: string;
    avatar: string;
    date: string;
  }[];
}

export default function HomeScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const { recommendedCommunity, recommendedMembers, recentActivities } = props;

  return (
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
            recommended members
          </Title>

          <Button
            mode="text"
            onPress={() => {}}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            view all
          </Button>
        </RecommendedListHeader>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20, backgroundColor: colors.WHITE }}
        >
          {recommendedMembers.map((member, index) => (
            <RecommendedUser key={index} {...member} />
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
            recommended community
          </Title>

          <Button
            mode="text"
            onPress={() => {}}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            view all
          </Button>
        </RecommendedListHeader>

        <RecommendedCommunityContainer>
          <RecommendedCommunity {...recommendedCommunity} />
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
            recent activities
          </Title>
        </RecommendedListHeader>

        {recentActivities.map((activity) => (
          <RecentActivity key={activity.name} {...activity} />
        ))}
      </RecentActivitiesList>
    </ScrollView>
  );
}

HomeScreen.defaultProps = {
  recommendedMembers: [
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    },
    {
      name: 'peter martin',
      address: '10k member',
      avatar: 'https://picsum.photos/700'
    }
  ],
  recommendedCommunity: {
    name: 'peter martin',
    members: '10k member',
    avatar: 'https://picsum.photos/700'
  },
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
