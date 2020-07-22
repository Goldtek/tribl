import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../../../theme';
import contactSlide from '../contactSlide';
import QRcodeSlide from '../QRcodeSlide';

export default function TabViewSlider() {
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

  return Platform.select({
    ios: (
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderPager={renderPager}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        sceneContainerStyle={{
          height: tabIndex === 1 ? DEVICE_FULL_WIDTH : undefined
        }}
      />
    ),

    android: (
      <TabView
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setTabIndex}
        initialLayout={{ width: DEVICE_FULL_WIDTH }}
        sceneContainerStyle={{
          height: tabIndex === 1 ? DEVICE_FULL_WIDTH : undefined
        }}
      />
    )
  }) as JSX.Element | null;
}
