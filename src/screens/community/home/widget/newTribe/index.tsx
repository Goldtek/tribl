import React, { Fragment } from 'react';
import { Text, TouchableRipple } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Title } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { NavigationInterface } from '../../../../types';
import { StatusBar } from 'react-native';
import { DEVICE_FULL_WIDTH } from '../../../../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import highlightSlide from './highlightSlide';
import channelSlide from './channelSlide';
import Header from '../../../../../components/header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import memberSlide from './membersSlide';
import { GLOBAL_HEADER_STYLE } from '../../../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function NewTribeScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { navigation } = props;
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const details = props.route.params;
  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'highlightSlide',
      title: `${t(`community.tabPanel.highlight`)}`,
      communityDetails: details
    },
    {
      key: 'channelSlide',
      title: `${t(`community.tabPanel.channel`)}`,
      communityDetails: details
    },
    {
      key: 'memberSlide',
      title: `${t(`community.tabPanel.member`)}`,
      communityDetails: details
    }
  ]);

  const renderScene = SceneMap({ highlightSlide, channelSlide, memberSlide });

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
          ...GLOBAL_HEADER_STYLE,
          backgroundColor: colors.WHITE,
          marginBottom: 10,
          paddingBottom: 10
        }}
      />
    );
  };

  const handleIndexChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Fragment>
      <StatusBar translucent barStyle="dark-content" />
      <Header
        title={() => (
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            }}
          >
            {details?.name}
          </Text>
        )}
        headerLeft={() => (
          <TouchableRipple
            onPress={() => navigation.navigate('CommunityScreen')}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40 / 2,
              marginRight: 10
            }}
          >
            <Feather name="chevron-left" size={34} color={colors.PRIMARY} />
          </TouchableRipple>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
          initialLayout={{ width: DEVICE_FULL_WIDTH }}
          swipeEnabled={true}
        />
      </Container>
    </Fragment>
  );
}
