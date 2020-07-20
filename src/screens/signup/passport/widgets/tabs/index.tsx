import React from 'react';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH, DEVICE_OS } from '../../../../../utils/device';
import { useThemeContext } from '../../../../../theme';
import contactSlide from '../contactSlide';
import QRcodeSlide from '../QRcodeSlide';

// DEFINE SCREEN PROP TYPES
interface TabProp {}

export default function TabViewSlider(props: TabProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'contactSlide', title: t(`signup.passportScreen.contactCard`) },
    { key: 'QRcodeSlide', title: t(`signup.passportScreen.QRCode`) }
  ]);

  const renderScene = SceneMap({ contactSlide, QRcodeSlide });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.PRIMARY, height: RFValue(3) }}
      activeColor={colors.PRIMARY_TEXT}
      inactiveColor={colors.SECONDARY_TEXT}
      labelStyle={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}
      style={{ backgroundColor: colors.WHITE }}
    />
  );

  const renderPager = (props: any) => <ScrollPager {...props} />;

  return DEVICE_OS === 'ios' ? (
    <TabView
      navigationState={{ index: tabIndex, routes }}
      renderScene={renderScene}
      renderPager={renderPager}
      renderTabBar={renderTabBar}
      onIndexChange={setTabIndex}
      initialLayout={{ width: DEVICE_FULL_WIDTH }}
    />
  ) : (
    <TabView
      navigationState={{ index: tabIndex, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setTabIndex}
      initialLayout={{ width: DEVICE_FULL_WIDTH }}
    />
  );
}
