import React from 'react';
import { useTranslation } from 'react-i18next';
import { Title, Text } from 'react-native-paper';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';

import {
  Container,
  BalanceCover,
  ButtonCover,
  Cover,
  LeftCover,
  RightCover
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function WalletScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  return (
    <Container>
      <Title
        style={{
          color: colors.BLACK,
          fontSize: RFValue(fonts.LARGE_SIZE * 2),
          fontFamily: fonts.WORK_SANS_BOLD,
          lineHeight: RFValue(40),
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
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            lineHeight: RFValue(17),
            textTransform: 'capitalize'
          }}
        >
          {t(`community.passport.cashBalance`)}
        </Text>
      </BalanceCover>
      <ButtonCover>
        <GradientButton
          onPress={() => navigation.navigate('AddCashScreen')}
          style={{
            height: 50
          }}
          gradientContainerstyle={{
            height: 50,
            width: '48%'
          }}
          contentStyle={{
            height: 50
          }}
        >
          {t(`community.passport.addCash`)}
        </GradientButton>
        <GradientButton
          onPress={() => {}}
          style={{
            height: 50
          }}
          gradientContainerstyle={{
            height: 50,
            width: '48%'
          }}
          contentStyle={{
            height: 50
          }}
        >
          {t(`community.passport.cashOut`)}
        </GradientButton>
      </ButtonCover>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          marginTop: RFValue(25),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.linkedAccounts`)}
      </Title>
      <Cover>
        <LeftCover>
          <FontAwesome name="bank" size={22} color={colors.PRIMARY_TEXT} />
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize',
              marginLeft: RFValue(10)
            }}
          >
            Bank of America
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            ...12345
          </Text>
        </RightCover>
      </Cover>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          marginTop: RFValue(25),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.cashAccount`)}
      </Title>
      <Cover>
        <LeftCover>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.nativeCurrency`)}
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'uppercase',
              marginRight: RFValue(5)
            }}
          >
            USD
          </Text>
          <Feather
            name="chevron-right"
            size={22}
            color={colors.SECONDARY_TEXT}
          />
        </RightCover>
      </Cover>
      <Cover>
        <LeftCover>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.country`)}
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize',
              marginRight: RFValue(5)
            }}
          >
            United States
          </Text>
          <Feather
            name="chevron-right"
            size={22}
            color={colors.SECONDARY_TEXT}
          />
        </RightCover>
      </Cover>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          marginTop: RFValue(25),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.cryptocurrency`)}
      </Title>
      <Cover>
        <LeftCover>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.triblCoin`)}
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17)
            }}
          >
            {'\u0024'}0.00 0.00000 TC
          </Text>
        </RightCover>
      </Cover>
      <Text
        style={{
          color: colors.PRIMARY,
          fontSize: RFValue(fonts.LARGE_SIZE + 5),
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          lineHeight: RFValue(20),
          textAlign: 'center',
          textTransform: 'capitalize',
          marginTop: RFValue(60)
        }}
      >
        {t(`community.passport.learn`)}
      </Text>
    </Container>
  );
}
