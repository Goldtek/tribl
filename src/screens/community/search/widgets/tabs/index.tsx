import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../../../theme';
import communitySlide from '../communitySlide';
import memberSlide from '../membersSlide';

export default function TabViewSlider() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'memberSlide', title: `${t(`community.tabPanel.member`)}` },
    { key: 'communitySlide', title: `${t(`community.tabPanel.community`)}` }
  ]);

  const renderScene = SceneMap({ memberSlide, communitySlide });

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
        color: focused ? colors.PRIMARY : colors.PRIMARY_TEXT,
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
          backgroundColor: colors.GREY,
          shadowColor: colors.TRANSPARENT,
          elevation: 0,
          marginBottom: 10
        }}
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
      />
    ),

    android: (
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
      />
    )
  }) as JSX.Element | null;
}
