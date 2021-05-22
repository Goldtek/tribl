import React, { useState } from 'react';
import { NavigationInterface } from '../../../../types';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import highlightSlide from './highlightSlide';
import channelSlide from './highlightSlide';
import memberSlide from './highlightSlide';
import { StatusBar } from 'expo-status-bar';
import { GLOBAL_HEADER_STYLE } from '../../../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function TribeDetailsScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const details = props.route.params;
  const [isMember, setIsMember] = useState(false);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'highlightSlide',
      title: `${t(`community.tabPanel.highlight`)}`,
      communityDetails: details
    },
    {
      key: 'channelSlide',
      title: `${t(`community.tabPanel.channel`)}`
    },
    {
      key: 'memberSlide',
      title: `${t(`community.tabPanel.member`)}`
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
