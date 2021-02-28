import React, { useEffect, Fragment } from 'react';
import { NavigationInterface } from '../../types';
import { useTranslation } from 'react-i18next';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { DEVICE_FULL_WIDTH } from '../../../utils/device';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import requestSlide from './widgets/tribeRequest';
import generalSlide from './widgets/general';
import { StatusBar } from 'expo-status-bar';
import { GLOBAL_HEADER_STYLE } from '../../../constants';
import { GET_SIDE_MENU } from '../../../graphql/cache/query';
import { ShowSideMenu } from '../../../graphql/types';
import { TOGGLE_SIDE_MENU } from '../../../graphql/cache/mutations';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import Header from '../../../components/header';
import { TouchableHighlight } from 'react-native-gesture-handler';
import hexToRGB from '../../../utils/hexToRGB';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function NotificationScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);

  const toggleMenu = () => {
    toggleSideMenu({
      variables: { showSideMenu: !drawerData?.showSideMenu }
    });
  };

  useEffect(() => {
    tagScreenName('NotificationScreen');
  }, []);

  const [tabIndex, setTabIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'requestSlide',
      title: `${t(`community.notification.invitation`)}`
    },
    {
      key: 'generalSlide',
      title: `${t(`community.notification.general`)}`
    }
  ]);

  const renderScene = SceneMap({ requestSlide, generalSlide });

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
        fontSize: RFValue(fonts.LARGE_SIZE - 1),
        color: focused ? colors.PRIMARY : colors.INACTIVE,
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
    setTabIndex(0);
  };

  return (
    <Fragment>
      <StatusBar translucent animated style="dark" />
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
            {t(`community.sideNav.notification`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableHighlight
            {...props}
            onPress={() => {
              toggleMenu();
              logEvent('open drawer', { from: 'community' });
            }}
            underlayColor={hexToRGB(colors.PRIMARY, 0.1)}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              borderRadius: RFValue(20),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Fragment>
              <Feather
                name="menu"
                size={RFValue(25)}
                color={colors.PRIMARY_TEXT}
              />
              {/* {data?.connectionRequests?.data?.length ? (
                <MenuBadgeWrapper />
              ) : null} */}
            </Fragment>
          </TouchableHighlight>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        <StatusBar translucent animated style="dark" />
        <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={handleIndexChange}
          initialLayout={{ width: DEVICE_FULL_WIDTH }}
          swipeEnabled={false}
        />
      </Container>
    </Fragment>
  );
}
