import React from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { Text } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import {
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer';
import FastImage from 'react-native-fast-image';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { MyPassportInterface } from '../../../graphql/types';
import { APP_VERSION } from '../../../utils/device';

import { DrawerFooter, ProfileContainer } from './styles';

export default function CustomDrawerComponent(props: any) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
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
        <DrawerItemList {...props} />
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
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}
