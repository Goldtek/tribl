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
import {
  CommunityInterface,
  SingleCommunityRequestInterface
} from '../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SearchScreen(props: ScreenProp) {
  const details = props.route.params;

  const { t } = useTranslation();
  const { colors, fonts } = useThemeContext();
  const [isMember, setIsMember] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  const id = details?.details?.id || details?.communityHit?.id;

  const { data, refetch } = useQuery<SingleCommunityRequestInterface>(
    GET_SINGLE_COMMUNITY,
    { variables: { input: { filter: { id } } } }
  );

  const communityDetails: CommunityInterface = {
    ...details?.details,
    ...details?.communityHit
  };

  const [routes, setRoutes] = React.useState([
    {
      key: 'highlightSlide',
      communityDetails,
      communityRefetch: refetch,
      title: `${t(`community.tabPanel.highlight`)}`
    },
    {
      key: 'channelSlide',
      communityDetails,
      title: `${t(`community.tabPanel.channel`)}`
    },
    {
      key: 'memberSlide',
      communityDetails,
      title: `${t(`community.tabPanel.member`)}`
    }
  ]);

  useEffect(() => {
    if (data) {
      const [highlightScreenData, ...restScreenData] = routes;

      const newHighlightScreenData = {
        ...highlightScreenData,
        communityDetails: {
          ...highlightScreenData.communityDetails,
          ...data?.Community.data[0]
        }
      };

      setRoutes([newHighlightScreenData, ...restScreenData]);
      setIsMember(newHighlightScreenData.communityDetails.isMember);
    }
  }, [data]);

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
