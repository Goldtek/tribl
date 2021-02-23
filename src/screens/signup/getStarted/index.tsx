import React, { useState, Fragment, useEffect } from 'react';
import {
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Subheading, Paragraph } from 'react-native-paper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { Toast } from '../../../components/rootToaster';
import { NavigationInterface } from '../../types';
import Input from '../../../components/input';
import countriesDB from '../../../libs/countries';
import { GET_USER_DETAILS } from '../../../graphql/cache/query';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import { SEND_USER_OTP } from '../../../graphql/server/mutations';
import { StoreInterface, OTPInterface } from '../../../graphql/types';
import { DEVICE_OS, DEVICE_ID } from '../../../utils/device';
import GradientButton from '../../../components/gradientButton';
import {
  tagScreenName,
  logEvent,
  hideSensitiveView
} from '../../../utils/uxcamHelper';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function getStartedScreenScreen(props: ScreenProp) {
  const { navigation } = props;

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  changeNavigationBarColor(colors.WHITE, true, true);

  useEffect(() => {
    tagScreenName('GetStartedScreen');
    logEvent('get started', { from: 'signup' });
  }, []);

  const userDetails = data?.userDetails;

  const country = countriesDB.getCountry(userDetails?.countryCode);

  const [phoneNumber, setPhoneNumber] = useState('');

  const onChangeText = (phoneNumber: string) => setPhoneNumber(phoneNumber);

  const [sendOtp, { loading }] = useMutation<OTPInterface>(SEND_USER_OTP, {
    variables: { payload: { phoneNumber, deviceId: DEVICE_ID } }
  });

  const [addPhoneNumber] = useMutation(ADD_USER_DETAILS, {
    variables: { details: { phoneNumber: phoneNumber } }
  });

  const handleInputError = () => {
    Toast.show(t(`signup.getStartedScreen.inputError`));
  };

  const handleSubmit = async () => {
    if (!phoneNumber) return handleInputError();

    try {
      await sendOtp();
      navigation.navigate('OTPScreen');
      addPhoneNumber();
    } catch (error) {
      handleInputError();
      crashlytics.recordError(new Error(error));
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: colors.WHITE
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 20 }}
        behavior={DEVICE_OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Fragment>
            <Container
              style={{
                height: '40%',
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              <Image
                source={require('../../../../assets/images/icon.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(60),
                  height: RFValue(60)
                }}
              />
            </Container>

            <Container style={{ flex: 1, paddingTop: RFValue(20) }}>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  lineHeight: RFValue(30)
                }}
              >
                {t(`signup.getStartedScreen.title`)}
              </Title>
              <Subheading
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.SECONDARY_TEXT
                }}
              >
                {t(`signup.getStartedScreen.subTitle`)}
              </Subheading>
              <Paragraph
                style={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'uppercase',
                  marginTop: 30
                }}
              >
                {t(`signup.getStartedScreen.mobileNumber`)}
              </Paragraph>

              <Input
                placeholder={t(`signup.getStartedScreen.placeholder`)}
                defaultValue={country?.phoneCode}
                onChangeText={onChangeText}
                keyboardType="phone-pad"
                returnKeyType="done"
              >
                <TouchableOpacity
                  ref={hideSensitiveView}
                  onPress={() => navigation.navigate('SelectCountryScreen')}
                  style={{
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: 15
                  }}
                >
                  <Fragment>
                    <Paragraph
                      style={{
                        fontSize: RFValue(fonts.LARGE_SIZE)
                      }}
                    >
                      {country?.emoji}
                    </Paragraph>
                    <Container
                      style={{
                        height: RFValue(30),
                        margin: RFValue(10),
                        borderWidth: 0.7,
                        borderColor: colors.INACTIVE
                      }}
                    />
                  </Fragment>
                </TouchableOpacity>
              </Input>

              <GradientButton loading={loading} onPress={handleSubmit}>
                {t(`signup.getStartedScreen.${loading ? 'loading' : 'submit'}`)}
              </GradientButton>
            </Container>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
