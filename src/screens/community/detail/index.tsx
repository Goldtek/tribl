import React, { useState, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { useLazyQuery } from '@apollo/react-hooks';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import highlightSlide from './widgets/highlightSlide';
import channelSlide from './widgets/channelSlide';
import memberSlide from './widgets/membersSlide';
import { StatusBar } from 'expo-status-bar';
import { GLOBAL_HEADER_STYLE } from '../../../constants';
import { GET_SINGLE_COMMUNITY } from '../../../graphql/server/query';
import LoadingIndicatorState from '../../../components/loadingIndicatorState';
import {
  CommunityInterface,
  SingleCommunityRequestInterface
} from '../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: {
      id?: string;
      tribeAccepted?: boolean;
      details?: CommunityInterface;
      communityHit?: CommunityInterface;
    };
  };
}

export default function CommunityDetailScreen(props: ScreenProp) {
  const details = props.route.params;

  const { t } = useTranslation();
  const { colors, fonts } = useThemeContext();
  const [isMember, setIsMember] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);

  const id = details?.id || details?.details?.id || details?.communityHit?.id;

  const [getCommunity, { data, refetch }] = useLazyQuery<
    SingleCommunityRequestInterface
  >(GET_SINGLE_COMMUNITY);

  useEffect(() => {
    if (id) {
      getCommunity({ variables: { input: { filter: { id } } } });
    }
  }, [id]);

  const communityDetails = ({
    ...details?.details,
    ...details?.communityHit
  } as unknown) as CommunityInterface;

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
        communityRefetch: refetch,
        communityDetails: {
          ...highlightScreenData.communityDetails,
          ...data?.Community.data[0]
        }
      };

      setRoutes([newHighlightScreenData, ...restScreenData]);
      setIsMember(newHighlightScreenData.communityDetails.isMember);
      setIsPrivate(newHighlightScreenData.communityDetails.isPrivate);
    }
  }, [data]);

  const renderScene = SceneMap({ highlightSlide, channelSlide, memberSlide });

  const getTitleColor = (focused: boolean) => {
    const style = {
      fontFamily: focused ? fonts.WORK_SANS_SEMI_BOLD : fonts.WORK_SANS_REGULAR,
      fontSize: RFValue(fonts.LARGE_SIZE + 1),
      color: focused ? colors.PRIMARY : colors.PRIMARY_TEXT,
      textTransform: 'capitalize',
      marginTop: 0,
      marginBottom: 0,
      width: '105%'
    };

    if (!focused && !isMember) {
      style.color = colors.INACTIVE;
    }

    if (!isPrivate) {
      style.color = colors.PRIMARY_TEXT;
    }

    if (isPrivate && !isMember) {
      style.color = colors.INACTIVE;
    }

    return style;
  };

  const renderLabel = ({
    route,
    focused
  }: {
    route: { title: string };
    focused: boolean;
  }) => (
    <Title
      //@ts-ignore
      style={getTitleColor(focused)}
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
    !isPrivate || isMember ? setTabIndex(index) : setTabIndex(0);
  };

  return (
    <Container>
      <StatusBar translucent animated style="dark" />
      {details?.tribeAccepted && !data ? (
        <LoadingIndicatorState showLoading={details?.tribeAccepted} />
      ) : (
        <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
          initialLayout={{ width: DEVICE_FULL_WIDTH }}
          swipeEnabled={!isPrivate || isMember ? true : false}
        />
      )}
    </Container>
  );
}
