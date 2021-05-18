import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import GradientButton from '../../../components/gradientButton';

import { Container, BalanceCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ActivateWalletScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  return (
    <Container>
      <Title
        style={{
          color: colors.BLACK,
          fontSize: RFValue(fonts.LARGE_SIZE * 3),
          fontFamily: fonts.WORK_SANS_BOLD,
          lineHeight: RFValue(50),
          textAlign: 'center',
          marginTop: 0,
          paddingTop: 0
        }}
      >
        {'\u0024'}0.00
      </Title>
      <BalanceCover>
        <Text
          style={{
            color: colors.SECONDARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            lineHeight: RFValue(17),
            textTransform: 'capitalize'
          }}
        >
          {t(`community.passport.balance`)}:
        </Text>
        <Text
          style={{
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            lineHeight: RFValue(17),
            textTransform: 'capitalize',
            marginLeft: RFValue(5)
          }}
        >
          {t(`community.passport.unavailable`)}
        </Text>
      </BalanceCover>
      <GradientButton
        onPress={() => navigation.navigate('LinkAccountScreen')}
        style={{
          height: 50,
          width: '100%'
        }}
        gradientContainerstyle={{
          height: 50,
          width: '100%',
          marginBottom: RFValue(30),
          marginTop: RFValue(40)
        }}
        contentStyle={{
          height: 50,
          width: '100%'
        }}
      >
        <Feather
          name="link"
          size={RFValue(20)}
          color={colors.WHITE}
          style={{ marginRight: RFValue(10) }}
        />{' '}
        <Text
          style={{
            color: colors.WHITE,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE),
            textTransform: 'capitalize'
          }}
        >
          {t(`community.passport.linkedAccounts`)}
        </Text>
      </GradientButton>
    </Container>
  );
}
