import React, { Fragment, useEffect } from 'react';
import { NavigationInterface } from '../../types';
import { Text, TouchableRipple, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { AntDesign } from '@expo/vector-icons';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('AccountSettingScreen');
  }, []);

  return (
    <Container>
      <TouchableRipple
        onPress={() => navigation.navigate('PrivacyScreen')}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: RFValue(50),
          paddingHorizontal: RFValue(25)
        }}
      >
        <Fragment>
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: fonts.LARGE_SIZE,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.accountSettings.privacy`)}
          </Text>
          <AntDesign name="caretright" size={20} color={colors.PRIMARY_TEXT} />
        </Fragment>
      </TouchableRipple>
      {/* <Divider style={{ backgroundColor: colors.INPUT }} />
      <TouchableRipple
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: RFValue(50),
          paddingHorizontal: RFValue(25)
        }}
      >
        <Fragment>
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: fonts.LARGE_SIZE,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.accountSettings.notification`)}
          </Text>
          <AntDesign name="caretright" size={20} color={colors.PRIMARY_TEXT} />
        </Fragment>
      </TouchableRipple>
      <Divider style={{ backgroundColor: colors.INPUT }} />
      <TouchableRipple
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: RFValue(50),
          paddingHorizontal: RFValue(25)
        }}
      >
        <Fragment>
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: fonts.LARGE_SIZE,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.accountSettings.number`)}
          </Text>
          <AntDesign name="caretright" size={20} color={colors.PRIMARY_TEXT} />
        </Fragment>
      </TouchableRipple>
      <Divider style={{ backgroundColor: colors.INPUT }} />
      <TouchableRipple
        onPress={() => {}}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: RFValue(50),
          paddingHorizontal: RFValue(25)
        }}
      >
        <Fragment>
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: fonts.LARGE_SIZE,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.accountSettings.delete`)}
          </Text>
          <AntDesign name="caretright" size={20} color={colors.PRIMARY_TEXT} />
        </Fragment>
      </TouchableRipple>
     */}
    </Container>
  );
}
