import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { useThemeContext } from '../../../theme';
// import groupChatSlide from './widgets/groupChatSlide';
import directMessageSlide from './widgets/directMessageSlide';
import requestSlide from './widgets/requestSlide';
import { StatusBar } from 'expo-status-bar';
import { GLOBAL_HEADER_STYLE } from '../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

export default function InboxScreen() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState(0);

  const [routes] = useState([
    {
      key: 'directMessageSlide',
      title: t('community.chat.message')
    },
    // { key: 'groupChatSlide', title: t('community.chat.group') },
    { key: 'requestSlide', title: t('community.chat.request') }
  ]);

  const renderScene = SceneMap({
    directMessageSlide,
    // groupChatSlide,
    requestSlide
  });

  const renderTabBar = (props: any) => {
    return (
      <TabBar
        {...props}
        // scrollEnabled={true}
        indicatorStyle={{ backgroundColor: colors.PRIMARY, height: RFValue(4) }}
        style={{
          ...GLOBAL_HEADER_STYLE,
          backgroundColor: colors.WHITE,
          marginTop: RFValue(10),
          marginHorizontal: RFValue(15)
        }}
        labelStyle={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.PRIMARY_TEXT,
          textTransform: 'capitalize'
        }}
        // tabStyle={{ width: 'auto', paddingHorizontal: RFValue(20) }}
      />
    );
  };

  const renderPager = (props: any) => <ScrollPager {...props} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <StatusBar translucent animated style="dark" />
      <Container>
        {Platform.select({
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
        })}
      </Container>
    </SafeAreaView>
  );
}
