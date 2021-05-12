import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { Title, Text, ProgressBar, Paragraph } from 'react-native-paper';

import Input from '../../../components/input';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { CountryInterface } from '../../../libs/countries';
import { MyPassportInterface } from '../../../graphql/types';
import GradientButton from '../../../components/gradientButton';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

import { Container, HeaderCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: { userDetails: MyPassportInterface; details: CountryInterface };
  };
}

export default function VerifyIdentityScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { details, userDetails } = props.route?.params;

  const [number, setNumber] = useState('');

  useEffect(() => {
    tagScreenName('VerifyIdentityScreen');
    logEvent('Verify user identity', { from: 'passport' });
  }, []);

  const handleNavigation = () => {
    navigation.navigate('CountryIdScreen', {
      details,
      userDetails
    });
  };

  return (
    <Container>
      <HeaderCover>
        <ProgressBar
          progress={2 / 5}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: 10
          }}
        />
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE - 1),
            color: colors.PRIMARY,
            textTransform: 'capitalize',
            marginBottom: RFValue(10),
            marginTop: RFValue(15),
            lineHeight: RFValue(19)
          }}
        >
          {' '}
          {t(`community.passport.step`)} 2
        </Text>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE + 5),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            lineHeight: RFValue(30)
          }}
        >
          {t(`community.passport.securityNumber`)}
        </Title>
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            color: colors.SECONDARY_TEXT,
            textTransform: 'capitalize',
            marginBottom: RFValue(10),
            lineHeight: RFValue(19)
          }}
        >
          {t(`community.passport.verifyText`)}
        </Text>
        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'uppercase',
            marginTop: 20
          }}
        >
          {t(`community.passport.securityNumber`)}
        </Paragraph>
        <Input
          placeholder="xxx-xx-xxxx"
          defaultValue={number}
          onChangeText={(number) => setNumber(number)}
          contanierStyle={{ height: RFValue(40) }}
          textInputStyle={{
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR
          }}
        />
      </HeaderCover>
      <GradientButton
        onPress={handleNavigation}
        style={{ height: 50 }}
        gradientContainerstyle={{
          height: 50,
          marginBottom: RFValue(30),
          marginHorizontal: RFValue(15)
        }}
        contentStyle={{ height: 50 }}
      >
        {t(`community.passport.next`)}
      </GradientButton>
    </Container>
  );
}
