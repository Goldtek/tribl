import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ProgressBar, Title, Paragraph } from 'react-native-paper';
import { TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { Mixpanel } from '../../../config';
import {
  VALIDATE_USER_OTP,
  SEND_USER_OTP
} from '../../../graphql/server/mutations';
import { StoreInterface, VerifyOTPInterface } from '../../../graphql/types';
import GradientButton from '../../../components/gradientButton';
import { GET_USER_DETAILS } from '../../../graphql/cache/query';
import { Toast } from '../../../components/rootToaster';
import useCountDown from '../../../utils/useCountDown';
import { NavigationInterface } from '../../types';
import { DEVICE_ID } from '../../../utils/device';
import { useThemeContext } from '../../../theme';
import Storage from '../../../libs/storage';
import {
  tagScreenName,
  logEvent,
  hideSensitiveView
} from '../../../utils/uxcamHelper';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, Cover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function OTPScreen(props: ScreenProp) {
  const { navigation } = props;

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);
  const { bottom: safeAreaBottom } = useSafeAreaInsets();
  const [timeLeft, restartOtpTimer] = useCountDown();
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('OTPScreen');
    logEvent('enter otp', { from: 'signup' });
  }, []);

  const [sendOtp] = useMutation(SEND_USER_OTP, {
    variables: {
      payload: {
        phoneNumber: data?.userDetails.phoneNumber,
        deviceId: DEVICE_ID
      }
    }
  });

  const [verifyOtp, { loading }] = useMutation<VerifyOTPInterface>(
    VALIDATE_USER_OTP
  );

  const resendOtp = () => {
    sendOtp();
    restartOtpTimer();
  };

  const handleInputError = () => {
    Toast.show(t(`signup.OTPScreen.inputError`));
  };

  const handleSubmit = async (otp: string) => {
    if (!otp || loading) return handleInputError();

    try {
      const { data: otpData } = await verifyOtp({
        variables: {
          payload: {
            phoneNumber: data?.userDetails.phoneNumber,
            deviceId: DEVICE_ID,
            otp
          }
        }
      });

      await Storage.setUserCredentials(otpData?.validateOtp);

      if (!otpData?.validateOtp.verified) {
        Mixpanel.createAlias(`${otpData?.validateOtp.passport.id}`);
        await Storage.setUserRegistration({
          route: 'CreateAccountScreen',
          completed: false
        });

        return navigation.reset({
          index: 0,
          routes: [{ name: 'CreateAccountScreen' }]
        });
      }

      await Storage.setUserRegistration({
        route: 'CommunityScreen',
        completed: true
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'CommunityScreen' }]
      });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      handleInputError();
    }
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
          <Cover ref={hideSensitiveView}>
            <Paragraph
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.SECONDARY_TEXT,
                lineHeight: RFValue(22)
              }}
            >
              {t(`signup.OTPScreen.paragraph`) +
                ` ${data?.userDetails.phoneNumber}`}
            </Paragraph>
          </Cover>

          <Container
            style={{ height: RFValue(100), marginTop: 10 }}
            ref={hideSensitiveView}
          >
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
            ref={hideSensitiveView}
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
            <GradientButton loading={loading} onPress={() => handleSubmit('')}>
              {t(`signup.OTPScreen.${loading ? 'loading' : 'submit'}`)}
            </GradientButton>
          </Container>
        </Container>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
