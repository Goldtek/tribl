import React, { useState, useEffect, useContext, Fragment } from 'react';
import {
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  SimpleLineIcons,
  FontAwesome
} from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import AccountNavigator from '../../accountNavigator';
import { ConnectionBadgeWrapper } from '../../bottomNavigator/styles';
import { useQuery } from '@apollo/react-hooks';
import { ShowConnectionNotificationBadge } from '../../../graphql/types';
import { GET_CONNECTION_NOTIFICATION_BADGE } from '../../../graphql/cache/query';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { MyPassportInterface } from '../../../graphql/types';
import { APP_VERSION } from '../../../utils/device';

import { DrawerFooter, ProfileContainer } from './styles';

const { width } = Dimensions.get('window');

export default function SideMenuModal({
  sideMenuVisible,
  onBackdropPress,
  onSwipeComplete
}: any) {
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const sideMenuScreens = [
    {
      name: 'Community',
      screen: 'CommunityScreen',
      drawerIcon: (
        <MaterialCommunityIcons
          name="google-circles-communities"
          size={24}
          color={colors.PRIMARY_TEXT}
        />
      )
    },
    {
      name: 'Connection Requests',
      screen: 'ConnectionRequest',
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
      name: 'My Connections',
      screen: 'MyConnections',
      drawerIcon: (
        <SimpleLineIcons name="user" size={24} color={colors.PRIMARY_TEXT} />
      )
    },
    {
      name: 'Settings',
      screen: AccountNavigator,
      drawerIcon: <Entypo name="cog" size={24} color={colors.PRIMARY_TEXT} />
    },
    {
      name: 'Privacy Policy',
      screen: 'policy',
      drawerIcon: (
        <FontAwesome name="user-secret" size={24} color={colors.PRIMARY_TEXT} />
      )
    }
  ];

  return (
    <Modal
      isVisible={sideMenuVisible}
      onBackdropPress={onBackdropPress}
      onSwipeComplete={onSwipeComplete}
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
          backgroundColor: '#fff'
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
                    paddingHorizontal: 10
                    // borderTopWidth: 0.8
                    // borderTopColor: colors.lightGrayColor
                  }}
                  onPress={() => {
                    // handleNavigation(item.tabIndex);
                    navigation.navigate(`${item.screen}`);
                    // toggleAction();
                  }}
                >
                  {item.drawerIcon}
                  <Text
                    style={{
                      color: colors.PRIMARY_TEXT,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      textTransform: 'capitalize'
                    }}
                  >
                    {item.name}
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
