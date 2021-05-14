import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeContext } from '../../../../theme';
import { NavigationInterface } from '../../../types';
import GradientButton from '../../../../components/gradientButton';
import { tagScreenName, logEvent } from '../../../../utils/uxcamHelper';

import { Container, HeaderCover } from '../styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function FailedScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('FailedWalletStatusScreen');
    logEvent('Verify user identity', { from: 'passport' });
  }, []);

  const handleNavigation = () => {
    navigation.navigate('BankCountryScreen');
  };

  return (
    <Container>
      <HeaderCover>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE + 5),
            color: colors.PRIMARY_TEXT,
            lineHeight: RFValue(30),
            marginTop: RFValue(150)
          }}
        >
          Failed
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
          Sorry, we could not verify your identity with your current photos.
          Please try again, making sure your identity document is fully visible
          and readable and the photo is not too dark or too bright.
        </Text>
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
        Retry
      </GradientButton>
    </Container>
  );
}
