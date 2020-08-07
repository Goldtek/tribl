import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../../../theme';
import ChatSlide from '../chatSlide';
import { GLOBAL_HEADER_STYLE } from '../../../../../constants';

const TAB_LIST = [
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
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);

  const [routes] = useState(TAB_LIST);

  const dynamicRoutes = TAB_LIST.reduce<{
    [key: string]: (props: any) => JSX.Element;
  }>((acc, { key }) => {
    acc[key] = ChatSlide;
    return acc;
  }, {});

  const renderScene = SceneMap({ ...dynamicRoutes });

  const renderLabel = ({
    route,
    focused
  }: {
    route: { title: string };
    focused: boolean;
  }) => (
    <Title
      style={{
        fontFamily: fonts.WORK_SANS_BOLD,
        fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
        color: focused ? colors.WHITE : colors.PRIMARY_TEXT,
        backgroundColor: focused ? colors.PRIMARY : colors.WHITE,
        textTransform: 'capitalize',
        borderColor: focused ? colors.PRIMARY : colors.DISABLED,
        borderRadius: 5,
        borderWidth: 0.7,
        padding: RFValue(5)
      }}
    >
      {route.title}
    </Title>
  );

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        scrollEnabled={true}
        // renderLabel={renderLabel}
        style={{
          ...GLOBAL_HEADER_STYLE,
          backgroundColor: colors.WHITE,
          paddingTop: 5,
          paddingBottom: 10,
          paddingLeft: RFValue(10)
        }}
        labelStyle={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.PRIMARY_TEXT,
          textTransform: 'capitalize',
          padding: 10
        }}
        tabStyle={{
          width: 'auto',
          padding: 0,
          marginRight: 10,
          borderRadius: 4,
          borderColor: colors.INACTIVE,
          borderWidth: 1
        }}
        indicatorContainerStyle={{ display: 'none', height: 0 }}
      />
    );
  };

  const renderPager = (props: any) => <ScrollPager {...props} />;

  return Platform.select({
    ios: (
      <TabView
        navigationState={{ index: tabIndex, routes }}
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
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        swipeEnabled={false}
      />
    )
  }) as JSX.Element | null;
}
