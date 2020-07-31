import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { Text } from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import FastImage from 'react-native-fast-image';

import { DrawerFooter, ProfileContainer } from './styles';

export default function CustomDrawerComponent(props: any) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { avatar = 'https://picsum.photos/700' } = props;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        <ProfileContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: avatar,
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
            {t(`community.sideNav.version`)}
          </Text>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(13),
              textAlign: 'center',
              lineHeight: RFValue(15),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.sideNav.company`)}
          </Text>
        </DrawerFooter>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}
