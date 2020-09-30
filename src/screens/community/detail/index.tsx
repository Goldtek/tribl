import React from 'react';
import { NavigationInterface } from '../../types';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import highlightSlide from './widgets/highlightSlide';
import channelSlide from './widgets/channelSlide';
import memberSlide from './widgets/membersSlide';
import { StatusBar } from 'expo-status-bar';
import { GET_SINGLE_COMMUNITY } from '../../../graphql/server/query';
import { GLOBAL_HEADER_STYLE } from '../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SearchScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const details = props.route.params;
  const id = details?.details?.id || details?.communityHit?.id;

  const { data: communityData } = useQuery(GET_SINGLE_COMMUNITY, {
    variables: { id }
  });

  const member = communityData?.Community[0]?.isMember;
  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'highlightSlide',
      title: `${t(`community.tabPanel.highlight`)}`,
      communityDetails: details.details || details.communityHit
    },
    {
      key: 'channelSlide',
      title: `${t(`community.tabPanel.channel`)}`,
      communityDetails: details.details || details.communityHit
    },
    {
      key: 'memberSlide',
      title: `${t(`community.tabPanel.member`)}`,
      communityDetails: details.details || details.communityHit
    }
  ]);

  const renderScene = SceneMap({ highlightSlide, channelSlide, memberSlide });

  const renderLabel = ({
    route,
    focused
  }: {
    route: { title: string };
    focused: boolean;
  }) => (
    <Title
      style={{
        fontFamily: focused
          ? fonts.WORK_SANS_SEMI_BOLD
          : fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE + 1),
        color: focused
          ? colors.PRIMARY
          : !member
          ? colors.INACTIVE
          : colors.PRIMARY_TEXT,
        textTransform: 'capitalize',
        marginTop: 0,
        marginBottom: 0,
        width: '105%'
      }}
    >
      {route.title}
    </Title>
  );

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: colors.PRIMARY,
          height: RFValue(4)
        }}
        renderLabel={renderLabel}
        style={{
          ...GLOBAL_HEADER_STYLE,
          backgroundColor: colors.WHITE,
          marginBottom: 10,
          paddingBottom: 10
        }}
      />
    );
  };

  const handleIndexChange = (index: number) => {
    member ? setTabIndex(index) : setTabIndex(0);
  };

  return (
    <Container>
      <StatusBar translucent animated style="dark" />
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        swipeEnabled={member}
      />
    </Container>
  );
}
