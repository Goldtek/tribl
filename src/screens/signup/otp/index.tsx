import React, { useState } from 'react';
import { Button, ProgressBar, Title, Paragraph } from 'react-native-paper';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import GradientButton from '../../../components/gradientButton';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function OTPScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const [state, setState] = useState({ otp: '', loading: false });

  const handleSubmit = (otpCode: string) => {
    setState({ ...state, loading: true });

    setTimeout(() => {
      navigation.navigate('CreateAccountScreen');
      setState({ ...state, loading: false });
    }, 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container
        style={{
          height: '100%',
          paddingLeft: RFValue(20),
          paddingRight: RFValue(20)
        }}
      >
        <ProgressBar
          progress={1 / 5}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: RFValue(30)
          }}
        />

        <Title
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
            color: colors.PRIMARY,
            textTransform: 'capitalize',
            lineHeight: RFValue(30)
          }}
        >
          {t(`signup.screenThree.subTitle`)}
        </Title>

        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.8)),
            color: colors.PRIMARY_TEXT,
            lineHeight: RFValue(30),
            marginTop: 20
          }}
        >
          {t(`signup.screenThree.title`)}
        </Title>

        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE),
            color: colors.SECONDARY_TEXT,
            lineHeight: RFValue(22)
          }}
        >
          {t(`signup.screenThree.paragraph`) + ' (305) 408-1935.'}
        </Paragraph>

        <Container style={{ height: RFValue(100), marginTop: 10 }}>
          <OTPInputView
            pinCount={4}
            autoFocusOnLoad={true}
            keyboardType="number-pad"
            placeholderCharacter="0"
            onCodeFilled={handleSubmit}
            codeInputFieldStyle={{
              width: RFValue(65),
              height: RFValue(70),
              fontSize: RFValue(fonts.LARGE_SIZE * 2),
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_BOLD,
              borderWidth: 1.2,
              borderRadius: 4,
              borderColor: colors.INACTIVE
            }}
            placeholderTextColor={colors.DISABLED}
          />
        </Container>
        <Container
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT
            }}
          >
            {t(`signup.screenThree.didNotReceiveCode`)}
          </Paragraph>

          <Button
            mode="text"
            color={colors.WHITE}
            uppercase={false}
            onPress={() => console.log('RESEND OTP')}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              marginLeft: 5,
              padding: 5,
              paddingTop: 2,
              textTransform: 'capitalize'
            }}
          >
            {t(`signup.screenThree.resend`)}
          </Button>
        </Container>

        <Container
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: RFValue(safeAreaBottom + 60)
          }}
        >
          <GradientButton loading={state.loading} onPress={handleSubmit}>
            {t(`signup.screenThree.${state.loading ? 'loading' : 'submit'}`)}
          </GradientButton>
        </Container>
      </Container>
    </TouchableWithoutFeedback>
  );
}
