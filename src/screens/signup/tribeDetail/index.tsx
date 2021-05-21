import React, { useEffect, useCallback } from 'react';
import { NavigationInterface } from '../../types';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { useQuery } from '@apollo/react-hooks';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import highlightSlide from './widgets/highlightSlide';
import { StatusBar } from 'expo-status-bar';
import { GLOBAL_HEADER_STYLE } from '../../../constants';
import { GET_NOAUTH_SINGLE_COMMUNITY } from '../../../graphql/server/query';
import { CommunityInterface } from '../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function TribeDetailsScreen(props: ScreenProp) {
  const details = props.route.params;

  const { t } = useTranslation();
  const { colors, fonts } = useThemeContext();
  const [tabIndex, setTabIndex] = React.useState(0);

  const id = details?.details?.id || details?.communityHit?.id;

  const { data, refetch } = useQuery(GET_NOAUTH_SINGLE_COMMUNITY, {
    variables: { id: id }
  });

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
    }
  ]);

  useEffect(() => {
    if (data) {
      const [highlightScreenData, ...restScreenData] = routes;

      const newHighlightScreenData = {
        ...highlightScreenData,
        communityDetails: {
          ...highlightScreenData.communityDetails,
          ...data?.noAuthSingleCommunity
        }
      };

      setRoutes([newHighlightScreenData, ...restScreenData]);
    }
  }, [data]);

  const renderScene = SceneMap({ highlightSlide });

  const getTitleColor = useCallback(
    (focused: boolean) => {
      const style = {
        fontFamily: focused
          ? fonts.WORK_SANS_SEMI_BOLD
          : fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE),
        color: focused ? colors.PRIMARY : colors.PRIMARY_TEXT,
        textTransform: 'capitalize'
      };

      return style;
    },
    [id]
  );

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
          left: 30,
          width: '40%',
          height: RFValue(3),
          backgroundColor: colors.PRIMARY
        }}
        tabStyle={{ width: 'auto' }}
        renderLabel={renderLabel}
        style={{
          ...GLOBAL_HEADER_STYLE,
          backgroundColor: colors.WHITE,
          marginBottom: 10
        }}
      />
    );
  };

  const handleIndexChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Container>
      <StatusBar translucent animated style="dark" />
      <TabView
        swipeEnabled={true}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        navigationState={{ index: tabIndex, routes }}
      />
    </Container>
  );
}
