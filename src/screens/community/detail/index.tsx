import React, { useState, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { useQuery } from '@apollo/react-hooks';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import highlightSlide from './widgets/highlightSlide';
import channelSlide from './widgets/channelSlide';
import memberSlide from './widgets/membersSlide';
import { StatusBar } from 'expo-status-bar';
import { GLOBAL_HEADER_STYLE } from '../../../constants';
import { GET_SINGLE_COMMUNITY } from '../../../graphql/server/query';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SearchScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const details = props.route.params;
  const [isMember, setIsMember] = useState(null);
  const id = details?.details?.id || details?.communityHit?.id;

  const { data } = useQuery(GET_SINGLE_COMMUNITY, {
    variables: { input: { filter: { id } } },
    fetchPolicy: 'cache-and-network',
    pollInterval: 1000
  });

  const singleCommunity = data?.Community[0];

  useEffect(() => {
    if (details?.details?.isMember) {
      setIsMember(details?.details?.isMember);
    }
  }, [details?.details?.isMember]);

  useEffect(() => {
    if (details?.communityHit?.isMember) {
      setIsMember(details?.communityHit?.isMember);
    }
  }, [details?.details?.isMember]);

  useEffect(() => {
    if (singleCommunity?.isMember) {
      setIsMember(singleCommunity?.isMember);
    }
  }, [singleCommunity?.isMember]);

  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'highlightSlide',
      title: `${t(`community.tabPanel.highlight`)}`,
      communityDetails: { ...details.details, ...singleCommunity } || {
        ...details.communityHit,
        ...singleCommunity
      }
    },
    {
      key: 'channelSlide',
      title: `${t(`community.tabPanel.channel`)}`,
      communityDetails: { ...details.details, ...singleCommunity } || {
        ...details.communityHit,
        ...singleCommunity
      }
    },
    {
      key: 'memberSlide',
      title: `${t(`community.tabPanel.member`)}`,
      communityDetails: { ...details.details, ...singleCommunity } || {
        ...details.communityHit,
        ...singleCommunity
      }
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
          : !isMember
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
    isMember ? setTabIndex(index) : setTabIndex(0);
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
        swipeEnabled={isMember ? true : false}
      />
    </Container>
  );
}
