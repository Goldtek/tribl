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
  recommendedCommunities: {
    name: string;
    members: string;
    avatar: string;
  }[];
  recentActivities: {
    name: string;
    action: string;
    avatar: string;
    date: string;
  }[];
}

export default function HomeScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const {
    recommendedCommunities,
    recommendedMembers,
    recentActivities
  } = props;

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
          style={{
            paddingTop: 25,
            backgroundColor: colors.WHITE,
            marginBottom: 20
          }}
        >
          {recommendedMembers.map((member) => (
            <RecommendedUser {...member} />
          ))}
        </ScrollView>
      </RecommendedList>

      <RecommendedList style={{ paddingLeft: 0, paddingTop: 10 }}>
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
          {recommendedCommunities.map((community) => (
            <RecommendedCommunity {...community} />
          ))}
        </RecommendedCommunityContainer>
      </RecommendedList>

      <RecentActivitiesList>
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

        {recentActivities.map((activity) => (
          <RecentActivity {...activity} />
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
  recommendedCommunities: [
    {
      name: 'peter martin',
      members: '10k member',
      avatar: 'https://picsum.photos/700'
    }
  ],
  recentActivities: [
    {
      name: 'Alex Muleba',
      action: 'sent money to Uche Nnadi',
      avatar: 'https://picsum.photos/700',
      date: '2 min ago'
    },
    {
      name: 'Blair Bashen',
      action: 'Joined #Afropolitan',
      avatar: 'https://picsum.photos/700',
      date: '10 min ago'
    },
    {
      name: 'Kobla',
      action: 'Joined #AustineJusticeCoalition',
      avatar: 'https://picsum.photos/700',
      date: '45 min ago'
    },
    {
      name: 'Erikan O.',
      action: 'Donated to #BlackLivesMatter',
      avatar: 'https://picsum.photos/700',
      date: '2 hours ago'
    },
    {
      name: 'Josephine Kellner',
      action: 'sent money to Jasmine',
      avatar: 'https://picsum.photos/700',
      date: '8 hours ago'
    },
    {
      name: 'Spencer Evans',
      action: 'added mutual connection Mbiyimoh',
      avatar: 'https://picsum.photos/700',
      date: '12 hours ago'
    }
  ]
};
