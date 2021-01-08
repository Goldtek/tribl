import React, { Fragment, useRef } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  FontAwesome
} from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { ConnectionBadgeWrapper } from '../../bottomNavigator/styles';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ShowConnectionNotificationBadge } from '../../../graphql/types';
import {
  GET_CONNECTION_NOTIFICATION_BADGE,
  GET_SIDE_MENU_STATE
} from '../../../graphql/cache/query';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { MyPassportInterface, ShowSideMenu } from '../../../graphql/types';
import { APP_VERSION, DEVICE_FULL_HEIGHT } from '../../../utils/device';
import { TOGGLE_SIDE_MENU } from '../../../graphql/cache/mutations';
import { rootNavigator } from '../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { DrawerFooter, ProfileContainer } from './styles';

const { width } = Dimensions.get('window');

export default function SideMenuModal() {
  const navigation = rootNavigator;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU_STATE);

  const userDetails = userData?.myPassport;

  const [changeSideMenuState] = useMutation(TOGGLE_SIDE_MENU);

  const toggleSideMenu = () => {
    drawerData?.showSideMenu === false
      ? changeSideMenuState({
          variables: { showSideMenu: true }
        })
      : changeSideMenuState({
          variables: { showSideMenu: false }
        });
  };

  const sideMenuScreens = [
    {
      name: `community.sideNav.community`,
      onPress: () => {
        navigation.navigate('CommunityScreen');
        toggleSideMenu();
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
      name: `community.sideNav.request`,
      onPress: () => {
        navigation.navigate('DrawerScreen', {
          screen: 'ConnectionRequest'
        });
        toggleSideMenu();
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
      name: `community.sideNav.connection`,
      onPress: () => {
        navigation.navigate('DrawerScreen', {
          screen: 'MyConnections'
        });
        toggleSideMenu();
      },
      drawerIcon: (
        <SimpleLineIcons name="user" size={24} color={colors.PRIMARY_TEXT} />
      )
    },
    {
      name: `community.sideNav.policy`,
      onPress: () => {
        navigation.navigate('DrawerScreen', {
          screen: 'PrivacyPolicyScreen'
        });
        toggleSideMenu();
      },
      drawerIcon: (
        <FontAwesome name="user-secret" size={24} color={colors.PRIMARY_TEXT} />
      )
    }
  ];

  return (
    <Modal
      isVisible={drawerData?.showSideMenu}
      onBackdropPress={toggleSideMenu}
      onSwipeComplete={toggleSideMenu}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      swipeDirection="left"
      useNativeDriver // Faster animation
      hideModalContentWhileAnimating
      propagateSwipe
      style={{
        margin: 0,
        width: width * 0.75
      }} // Needs to contain the width, 75% of screen width in our case
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center'
        }}
      >
        <ProfileContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: userDetails?.avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(80),
              height: RFValue(80),
              borderRadius: RFValue(40)
            }}
          />
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(17),
              paddingTop: RFValue(10)
            }}
          >
            {`${userDetails?.firstName} ${userDetails?.lastName}`}
          </Text>
        </ProfileContainer>

        <View
          style={{
            flex: 1,
            marginHorizontal: 10,
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          {sideMenuScreens.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row'
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 10
                  }}
                  onPress={item.onPress}
                >
                  {item.drawerIcon}
                  <Text
                    style={{
                      marginLeft: 20,
                      color: colors.PRIMARY_TEXT,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      textTransform: 'capitalize'
                    }}
                  >
                    {t(item.name)}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <DrawerFooter>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
              textAlign: 'center',
              lineHeight: RFValue(15)
            }}
          >
            {APP_VERSION}
          </Text>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
              textAlign: 'center',
              lineHeight: RFValue(15),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.sideNav.company`)}
          </Text>
        </DrawerFooter>
      </SafeAreaView>
    </Modal>
  );
}
