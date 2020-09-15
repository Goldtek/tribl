import React from 'react';
import { NavigationInterface } from '../../types';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar, ScrollPager } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Platform } from 'react-native';
import { useThemeContext } from '../../../theme';
import communitySlide from './widgets/communitySlide';
import { StatusBar } from 'expo-status-bar';
import { useMutation } from '@apollo/react-hooks';
import memberSlide from './widgets/membersSlide';
import { ADD_COMMUNITY_SEARCH_INDEX } from '../../../graphql/cache/mutations';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: { index: number } };
}

export default function SearchScreen(props: ScreenProp) {
  const {
    params: { index }
  } = props.route;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [changeCommunitySearchIndex] = useMutation(ADD_COMMUNITY_SEARCH_INDEX);

  const [tabIndex, setTabIndex] = React.useState(index);

  const [routes] = React.useState([
    { key: 'memberSlide', title: `${t(`community.tabPanel.member`)}` },
    { key: 'communitySlide', title: `${t(`community.tabPanel.community`)}` }
  ]);

  const renderScene = SceneMap({ memberSlide, communitySlide });

  const handleIndexChange = (index: number) => {
    setTabIndex(index);
    changeCommunitySearchIndex({ variables: { communitySearchIndex: index } });
  };

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

  return (
    <Container>
      <StatusBar translucent animated style="dark" />
      {Platform.select({
        ios: (
          <TabView
            lazy
            renderScene={renderScene}
            renderPager={renderPager}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
            navigationState={{ index: tabIndex, routes }}
            initialLayout={{ width: DEVICE_FULL_WIDTH }}
            swipeEnabled={false}
          />
        ),

        android: (
          <TabView
            lazy
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
            navigationState={{ index: tabIndex, routes }}
            initialLayout={{ width: DEVICE_FULL_WIDTH }}
            swipeEnabled={false}
          />
        )
      })}
    </Container>
  );
}
