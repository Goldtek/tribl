import React, { Fragment } from 'react';
import Intercom from 'react-native-intercom';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  FontAwesome,
  Feather,
  AntDesign
} from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../theme';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  ActiveSideMenuRequestInterface,
  ShowConnectionNotificationBadge
} from '../../../graphql/types';
import {
  GET_ACTIVE_SIDE_MENU_STATE,
  GET_CONNECTION_NOTIFICATION_BADGE,
  GET_SIDE_MENU
} from '../../../graphql/cache/query';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { MyPassportInterface, ShowSideMenu } from '../../../graphql/types';
import { APP_VERSION, DEVICE_FULL_WIDTH } from '../../../utils/device';
import {
  CHANGE_ACTIVE_SIDE_MENU_STATE,
  TOGGLE_SIDE_MENU
} from '../../../graphql/cache/mutations';
import { navigationRef } from '../../../constants';
import hexToRGB from '../../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  DrawerFooter,
  MenuContainer,
  ProfileContainer,
  ConnectionBadgeWrapper,
  TransferCover
} from './styles';

export default function CustomDrawerComponent() {
  const navigation = navigationRef?.current;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const { data: sideMenuData } = useQuery<ActiveSideMenuRequestInterface>(
    GET_ACTIVE_SIDE_MENU_STATE
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const userDetails = userData?.myPassport;

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);
  const [changeSideMenuState] = useMutation(CHANGE_ACTIVE_SIDE_MENU_STATE);

  const toggleMenu = () => {
    toggleSideMenu({
      variables: { showSideMenu: !drawerData?.showSideMenu }
    });
  };

  const changeSideMenu = (menu: string) => {
    changeSideMenuState({ variables: { activeSideMenu: menu } });
  };

  //@ts-ignore
  Intercom.registerIdentifiedUser({ userId: userDetails?.id });

  Intercom.updateUser({
    // Pre-defined user attributes
    email: userDetails?.email,
    user_id: userDetails?.id,
    name: `${userDetails?.firstName} ${userDetails?.lastName}`,
    phone: userDetails?.phoneNumber,
    language_override: 'language_override',
    unsubscribed_from_emails: true
  });

  const sideMenuScreens = [
    {
      key: 'drawer_community_key',
      name: `community.sideNav.community`,
      onPress: () => {
        changeSideMenu('drawer_community_key');
        navigation?.navigate('CommunityScreen');
        toggleMenu();
      },
      drawerIcon: (
        <MaterialCommunityIcons
          name="google-circles-communities"
          size={24}
          color={colors.PRIMARY_TEXT}
        />
      )
    },
    {
      key: 'drawer_communityRequest_key',
      name: `community.sideNav.communityRequest`,
      onPress: () => {
        changeSideMenu('drawer_communityRequest_key');
        navigation?.navigate('DrawerScreen', { screen: 'TribeRequestScreen' });
        toggleMenu();
      },
      drawerIcon: (
        <AntDesign name="addusergroup" size={28} color={colors.PRIMARY_TEXT} />
      )
    },
    {
      key: 'drawer_request_key',
      name: `community.sideNav.request`,
      onPress: () => {
        changeSideMenu('drawer_request_key');
        navigation?.navigate('DrawerScreen', { screen: 'ConnectionRequest' });
        toggleMenu();
      },
      drawerIcon: (
        <Fragment>
          <SimpleLineIcons
            name="user-follow"
            size={24}
            color={colors.PRIMARY_TEXT}
          />
          {data?.showConnectionNotificationBadge ? (
            <ConnectionBadgeWrapper />
          ) : null}
        </Fragment>
      )
    },
    {
      key: 'drawer_connection_key',
      name: `community.sideNav.connection`,
      onPress: () => {
        changeSideMenu('drawer_connection_key');
        navigation?.navigate('DrawerScreen', { screen: 'MyConnections' });
        toggleMenu();
      },
      drawerIcon: (
        <SimpleLineIcons name="user" size={24} color={colors.PRIMARY_TEXT} />
      )
    },
    // {
    //   key: 'drawer_wallet_key',
    //   name: `community.passport.wallet`,
    //   onPress: () => {
    //     changeSideMenu('drawer_wallet_key');
    //     navigation?.navigate('TriblPayScreen', { screen: 'WalletScreen' });
    //     toggleMenu();
    //   },
    //   drawerIcon: (
    //     <Feather name="dollar-sign" size={24} color={colors.PRIMARY_TEXT} />
    //   )
    // },
    {
      key: 'drawer_activities_key',
      name: `community.sideNav.activities`,
      onPress: () => {
        changeSideMenu('drawer_activities_key');
        navigation?.navigate('DrawerScreen', {
          screen: 'MyNotifications'
        });
        toggleMenu();
      },
      drawerIcon: (
        <Fragment>
          <SimpleLineIcons name="bell" size={24} color={colors.PRIMARY_TEXT} />
          {data?.showConnectionNotificationBadge ? (
            <ConnectionBadgeWrapper />
          ) : null}
        </Fragment>
      )
    },
    {
      key: 'drawer_settings_key',
      name: `community.sideNav.settings`,
      onPress: () => {
        navigation?.navigate('AccountSettingScreen', {
          screen: 'AccountSettingScreen',
          params: { previousMenu: sideMenuData?.activeSideMenu }
        });
        changeSideMenu('drawer_settings_key');
        toggleMenu();
      },
      drawerIcon: (
        <Feather name="settings" size={24} color={colors.PRIMARY_TEXT} />
      )
    },
    {
      key: 'drawer_support_key',
      name: `community.sideNav.support`,
      onPress: () => {
        Intercom.displayMessageComposer();
        toggleMenu();
      },
      drawerIcon: (
        <AntDesign
          name="customerservice"
          size={24}
          color={colors.PRIMARY_TEXT}
        />
      )
    },
    {
      key: 'drawer_policy_key',
      name: `community.sideNav.policy`,
      onPress: () => {
        navigation?.navigate('AccountSettingScreen', {
          screen: 'PrivacyPolicyScreen',
          params: { previousMenu: sideMenuData?.activeSideMenu }
        });
        changeSideMenu('drawer_policy_key');
        toggleMenu();
      },
      drawerIcon: (
        <FontAwesome name="user-secret" size={24} color={colors.PRIMARY_TEXT} />
      )
    }
  ];

  return (
    <Modal
      isVisible={drawerData?.showSideMenu}
      onBackdropPress={toggleMenu}
      onSwipeComplete={toggleMenu}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      swipeDirection="left"
      useNativeDriver
      hideModalContentWhileAnimating
      propagateSwipe
      style={{ margin: 0, width: DEVICE_FULL_WIDTH * 0.75 }}
    >
      <Container>
        <ProfileContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: userDetails?.avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40
            }}
          />
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: fonts.LARGE_SIZE,
              paddingTop: 10,
              textTransform: 'capitalize'
            }}
          >
            {`${userDetails?.firstName} ${userDetails?.lastName}`}
          </Text>
        </ProfileContainer>

        {/* <TransferCover>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: fonts.LARGE_SIZE
            }}
          >
            {'\u0024'}20.00
          </Text>
          <Text
            style={{
              color: colors.PRIMARY,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: fonts.LARGE_SIZE,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.tranfer`)}
          </Text>
        </TransferCover>
       */}
        <MenuContainer>
          {sideMenuScreens.map((item, index) => {
            return (
              <View
                key={item.key}
                style={{
                  flexDirection: 'row',
                  marginVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor:
                    sideMenuData?.activeSideMenu === item.key
                      ? hexToRGB(colors.PRIMARY_LIGHT, 0.3)
                      : colors.TRANSPARENT,
                  borderRadius: 3
                }}
              >
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.9}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: index ? 'baseline' : 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 10
                  }}
                  onPress={item.onPress}
                >
                  {item.drawerIcon}
                  <Text
                    style={{
                      marginLeft: 20,
                      color: colors.PRIMARY_TEXT,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: fonts.MEDIUM_SIZE,
                      textTransform: 'capitalize'
                    }}
                  >
                    {t(item.name)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </MenuContainer>

        <DrawerFooter>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: fonts.MEDIUM_SIZE,
              textAlign: 'center',
              lineHeight: 15
            }}
          >
            {APP_VERSION}
          </Text>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: fonts.MEDIUM_SIZE,
              textAlign: 'center',
              lineHeight: 15,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.sideNav.company`)}
          </Text>
        </DrawerFooter>
      </Container>
    </Modal>
  );
}
