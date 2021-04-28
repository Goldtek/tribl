import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function LinkAccountScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  return (
    <Container>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.LARGE_SIZE),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          textTransform: 'uppercase'
        }}
      >
        {t(`community.passport.accounts`)}
      </Title>
      <TouchableRipple
        rippleColor={colors.PRIMARY}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: RFValue(30)
        }}
        onPress={() => {}}
      >
        <Fragment>
          <Feather name="plus" size={22} color={colors.PRIMARY_TEXT} />
          <Text
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              textTransform: 'capitalize',
              marginLeft: RFValue(10)
            }}
          >
            {t(`community.passport.linkedCreditCard`)}
          </Text>
        </Fragment>
      </TouchableRipple>
      <TouchableRipple
        rippleColor={colors.PRIMARY}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: RFValue(30)
        }}
        onPress={() => navigation.navigate('BankCountryScreen')}
      >
        <Fragment>
          <FontAwesome name="bank" size={22} color={colors.PRIMARY_TEXT} />
          <Text
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              textTransform: 'capitalize',
              marginLeft: RFValue(10)
            }}
          >
            {t(`community.passport.linkedBankAccount`)}
          </Text>
        </Fragment>
      </TouchableRipple>
    </Container>
  );
}
