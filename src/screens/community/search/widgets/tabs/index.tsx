import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
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
    { key: 'memberSlide', title: 'members' },
    { key: 'communitySlide', title: 'communities' }
  ]);

  const renderScene = SceneMap({ memberSlide, communitySlide });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: colors.PRIMARY,
        height: RFValue(4),
        width: RFValue(30)
      }}
      tabStyle={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
      }}
      activeColor={colors.PRIMARY}
      inactiveColor={colors.PRIMARY_TEXT}
      labelStyle={{
        fontFamily: fonts.WORK_SANS_REGULAR,
        fontSize: fonts.LARGE_SIZE + 1,
        textTransform: 'capitalize'
      }}
      style={{
        backgroundColor: colors.OFFWHITE,
        border: 0,
        shadowColor: colors.TRANSPARENT,
        marginTop: RFValue(20),
        width: '80%'
      }}
    />
  );

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
