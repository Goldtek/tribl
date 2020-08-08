import React, { useState } from 'react';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { Props } from 'react-native-tab-view/lib/typescript/src/Pager';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../../../theme';
import ChatSlide from '../chatSlide';
import { GLOBAL_HEADER_STYLE } from '../../../../../constants';

const TAB_ROUTES = [
  {
    key: 'connectionSlide',
    title: 'my connections'
  },
  {
    key: 'nearbySlide',
    title: 'nearby'
  },
  {
    key: 'onlineSlide',
    title: 'online'
  },
  {
    key: 'activeSlide',
    title: 'active'
  }
];

export default function TabViewSlider() {
  const { colors, fonts } = useThemeContext();

  const [tabIndex, setTabIndex] = useState(0);

  const dynamicRoutes = TAB_ROUTES.reduce<{
    [key: string]: (props: any) => JSX.Element;
  }>((acc, { key }) => {
    acc[key] = ChatSlide;
    return acc;
  }, {});

  const renderScene = SceneMap({ ...dynamicRoutes });

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={true}
        indicatorStyle={{ backgroundColor: colors.PRIMARY, height: RFValue(4) }}
        style={{
          ...GLOBAL_HEADER_STYLE,
          backgroundColor: colors.WHITE,
          paddingTop: RFValue(5)
        }}
        labelStyle={{
          width: 'auto',
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.PRIMARY_TEXT,
          textTransform: 'capitalize'
        }}
        tabStyle={{ width: 'auto', paddingHorizontal: RFValue(20) }}
      />
    );
  };

  const renderPager = (props: Props<{ key: string; title: string }>) => (
    <ScrollPager {...props} />
  );

  return Platform.select({
    ios: (
      <TabView
        navigationState={{ index: tabIndex, routes: TAB_ROUTES }}
        renderScene={renderScene}
        renderPager={renderPager}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        swipeEnabled={false}
      />
    ),

    android: (
      <TabView
        navigationState={{ index: tabIndex, routes: TAB_ROUTES }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        swipeEnabled={false}
      />
    )
  }) as JSX.Element | null;
}
