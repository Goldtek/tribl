import React, { useState } from 'react';
import {
  Button,
  ProgressBar,
  Title,
  Paragraph,
  Snackbar
} from 'react-native-paper';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery } from '@apollo/react-hooks';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import {
  VALIDATE_USER_OTP,
  SEND_USER_OTP
} from '../../../graphql/server/mutations';
import {
  StoreInterface,
  OTPInterface,
  VerifyOTPInterface
} from '../../../graphql/types';
import GradientButton from '../../../components/gradientButton';
import { GET_USER_DETAILS } from '../../../graphql/cache/query';
import { NavigationInterface } from '../../types';
import { DEVICE_ID } from '../../../utils/device';
import { useThemeContext } from '../../../theme';
import useCountDown from './useCountDown';
import Storage from '../../../storage';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function OTPScreen(props: ScreenProp) {
  const { navigation } = props;

  const [timeLeft, restartOtpTimer] = useCountDown();
  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    otp: '',
    inputError: false,
    loading: false
  });

  const [sendOtp] = useMutation<OTPInterface>(SEND_USER_OTP, {
    variables: {
      payload: { phoneNumber: data?.userDetails.number, deviceId: DEVICE_ID }
    }
  });

  const [verifyOtp] = useMutation<VerifyOTPInterface>(VALIDATE_USER_OTP, {
    variables: {
      payload: {
        phoneNumber: data?.userDetails.number,
        deviceId: DEVICE_ID,
        otp: state.otp
      }
    }
  });

  const resendOtp = () => {
    sendOtp();
    restartOtpTimer();
  };

  const handleInputError = () => {
    setState({ ...state });
  };

  const handleSubmit = (sentOTP: string) => {
    if (!sentOTP || state.loading) return handleInputError();
    setState({ ...state, otp: sentOTP, loading: true });

    setTimeout(async () => {
      try {
        const { data } = await verifyOtp();

        if (data?.validateOtp) {
          setState({ ...state, loading: false });
          Storage.addUserAuth(data?.validateOtp);
          navigation.reset({
            index: 0,
            routes: [{ name: 'CreateAccountScreen' }]
          });
        }
      } catch (error) {
        setState({ ...state, inputError: !state.inputError, loading: false });
      }
    }, 0);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
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
            {t(`signup.OTPScreen.subTitle`)}
          </Title>

          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
              color: colors.PRIMARY_TEXT,
              lineHeight: RFValue(30),
              marginTop: 20
            }}
          >
            {t(`signup.OTPScreen.title`)}
          </Title>

          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.SECONDARY_TEXT,
              lineHeight: RFValue(22)
            }}
          >
            {t(`signup.OTPScreen.paragraph`) + ' (305) 408-1935.'}
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
              codeInputHighlightStyle={{ borderColor: colors.PRIMARY }}
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
              {t(`signup.OTPScreen.didNotReceiveCode`)}
            </Paragraph>

            {timeLeft ? (
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  marginLeft: 5,
                  padding: 5,
                  paddingTop: 2
                }}
              >
                {timeLeft}
              </Title>
            ) : (
              <Button
                mode="text"
                color={colors.WHITE}
                uppercase={false}
                onPress={resendOtp}
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
                {t(`signup.OTPScreen.resend`)}
              </Button>
            )}
          </Container>

          <Container
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: RFValue(safeAreaBottom + 60)
            }}
          >
            <GradientButton
              loading={state.loading}
              onPress={() => handleSubmit('')}
            >
              {t(`signup.OTPScreen.${state.loading ? 'loading' : 'submit'}`)}
            </GradientButton>
          </Container>
        </Container>
      </TouchableWithoutFeedback>
      <Snackbar
        duration={Snackbar.DURATION_SHORT}
        visible={state.inputError}
        onDismiss={handleInputError}
        wrapperStyle={{ top: 0, paddingLeft: 10, paddingRight: 10 }}
        style={{ minHeight: RFValue(50), borderRadius: 4 }}
        action={{ label: 'Dismiss', onPress: handleInputError }}
      >
        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.WHITE,
            letterSpacing: 2
          }}
        >
          {t(`signup.OTPScreen.inputError`)}
        </Paragraph>
      </Snackbar>
    </SafeAreaView>
  );
}
