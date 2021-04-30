import React, { useState, useRef, useEffect } from 'react';
import { Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Image, TextInput, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';

import { Container, Cover, LogoCover, CashCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function AddCashScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  const [number, setNumber] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Container>
      <Cover>
        <LogoCover>
          <Image
            source={require('../../../../assets/images/logo.png')}
            style={{
              resizeMode: 'contain',
              width: RFValue(40),
              height: RFValue(40)
            }}
          />
          <Text
            style={{
              color: colors.PRIMARY,
              fontSize: RFValue(fonts.LARGE_SIZE + 7),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'uppercase'
            }}
          >
            {t(`community.passport.pay`)}
          </Text>
        </LogoCover>
        <CashCover>
          <Title
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.LARGE_SIZE * 3),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(50)
            }}
          >
            {'\u0024'}
          </Title>
          <TextInput
            ref={inputRef}
            onBlur={() => Keyboard.dismiss()}
            onChangeText={(number) => setNumber(number)}
            value={number}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor={colors.BLACK}
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.LARGE_SIZE * 3),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(50)
            }}
          />
        </CashCover>

        <Text
          style={{
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            lineHeight: RFValue(17),
            textTransform: 'capitalize',
            textAlign: 'center',
            marginLeft: RFValue(5),
            marginTop: RFValue(5)
          }}
        >
          {t(`community.passport.account`)}: 12345
        </Text>
      </Cover>

      <GradientButton
        onPress={() => navigation.navigate('WalletScreen')}
        style={{
          height: 50
        }}
        gradientContainerstyle={{
          height: 50,
          marginBottom: RFValue(30)
        }}
        contentStyle={{
          height: 50
        }}
      >
        {t(`community.passport.addAmount`)}
      </GradientButton>
    </Container>
  );
}
