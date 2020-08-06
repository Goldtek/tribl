import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../../../theme';
import groupChatSlide from '../groupChatSlide';
import directMessageSlide from '../directMessageSlide';
import requestSlide from '../requestSlide';
import { GLOBAL_HEADER_STYLE } from '../../../../../constants';

export default function TabViewSlider() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = React.useState(0);

  const [routes] = React.useState([
    {
      key: 'directMessageSlide',
      title: `${t(`community.chat.message`)}`
    },
    { key: 'groupChatSlide', title: `${t(`community.chat.group`)}` },
    { key: 'requestSlide', title: `${t(`community.chat.request`)}` }
  ]);

  const renderScene = SceneMap({
    directMessageSlide,
    groupChatSlide,
    requestSlide
  });

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
        color: focused ? colors.PRIMARY_TEXT : colors.SECONDARY_TEXT,
        textTransform: 'capitalize',
        display: 'flex'
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
          marginLeft: RFValue(10),
          marginTop: RFValue(10)
        }}
        scrollEnabled={true}
        labelStyle={{
          width: '100%'
        }}
        tabStyle={{ width: 'auto', paddingRight: 20 }}
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
