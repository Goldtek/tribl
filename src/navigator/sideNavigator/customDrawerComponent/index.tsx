import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, Platform, SafeAreaView, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  Searchbar,
  Text,
  TouchableRipple,
  Avatar,
  Divider
} from 'react-native-paper';
import { FontAwesome, Feather } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import FastImage from 'react-native-fast-image';
import { DrawerFooter, ProfileContainer } from './styles';

export default function CustomDrawerComponent(props: any) {
  const { colors, fonts } = useThemeContext();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
    >
      <SafeAreaView>
        <ProfileContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: 'https://picsum.photos/700',
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
              textTransform: 'capitalize',
              paddingTop: RFValue(10)
            }}
          >
            kamilah wells
          </Text>
        </ProfileContainer>
        <DrawerItemList {...props} />
      </SafeAreaView>
      <DrawerFooter>
        <Text
          style={{
            color: colors.PRIMARY_TEXT,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(13),
            textAlign: 'center',
            lineHeight: RFValue(15)
          }}
        >
          version 1.0.0
        </Text>
        <Text
          style={{
            color: colors.PRIMARY_TEXT,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(13),
            textAlign: 'center',
            lineHeight: RFValue(15)
          }}
        >
          silicon jungle labs
        </Text>
      </DrawerFooter>
    </DrawerContentScrollView>
  );
}
