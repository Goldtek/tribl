import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../../../theme';
import nearbrSlide from '../nearby';
import connectionSlide from '../connections';
import onlineSlide from '../online';
import activeSlide from '../active';
import { GLOBAL_HEADER_STYLE } from '../../../../../constants';

export default function TabViewSlider() {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = React.useState(0);

  const [routes] = React.useState([
    {
      key: 'connectionSlide',
      title: `${t(`community.chat.connection`)}`
    },
    { key: 'nearbrSlide', title: `${t(`community.chat.nearby`)}` },
    { key: 'onlineSlide', title: `${t(`community.chat.online`)}` },
    { key: 'activeSlide', title: `${t(`community.chat.active`)}` }
  ]);

  const renderScene = SceneMap({
    connectionSlide,
    nearbrSlide,
    onlineSlide,
    activeSlide
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
        color: focused ? colors.WHITE : colors.PRIMARY_TEXT,
        backgroundColor: focused ? colors.PRIMARY : colors.WHITE,
        textTransform: 'capitalize',
        display: 'flex',
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
        renderLabel={renderLabel}
        style={{
          ...GLOBAL_HEADER_STYLE,
          backgroundColor: colors.WHITE,
          paddingBottom: 10,
          paddingLeft: RFValue(5)
        }}
        scrollEnabled={true}
        labelStyle={{
          width: '100%'
        }}
        tabStyle={{ width: 'auto', marginRight: 5 }}
        indicatorContainerStyle={{ display: 'none' }}
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
