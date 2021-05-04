import React, { useState, useRef, Fragment, useEffect } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { Title, Subheading, Paragraph, IconButton } from 'react-native-paper';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { Toast } from '../../../components/rootToaster';
import { NavigationInterface } from '../../types';
import Input from '../../../components/input';
import Storage from '../../../libs/storage';
import countriesDB from '../../../libs/countries';
import { GET_USER_DETAILS } from '../../../graphql/cache/query';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import { SEND_USER_OTP } from '../../../graphql/server/mutations';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import HTML from 'react-native-render-html';
import {
  StoreInterface,
  OTPInterface,
  VerifyOTPIT
} from '../../../graphql/types';
import { DEVICE_ID, APP_VERSION } from '../../../utils/device';
import GradientButton from '../../../components/gradientButton';
import { htmlContent } from './licence';
import {
  tagScreenName,
  logEvent,
  hideSensitiveView
} from '../../../utils/uxcamHelper';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import hexToRGB from '../../../utils/hexToRGB';
import { StatusBar } from 'expo-status-bar';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function getStartedScreenScreen(props: ScreenProp) {
  const { navigation } = props;

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);
  const { colors, fonts } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  changeNavigationBarColor(colors.WHITE, true, true);

  const modalizeRef = useRef<Modalize>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const openModal = () => modalizeRef.current?.open();
  const closeModal = () => modalizeRef.current?.close();
  const [licenceAccepted, setLicenceAccepted] = useState(false);

  useEffect(() => {
    checkUserLicenceAgreement();
    tagScreenName('GetStartedScreen');
    logEvent('get started', { from: 'signup' });
  }, []);

  const checkUserLicenceAgreement = async () => {
    const value = await Storage.checkEULA();
    setLicenceAccepted(Boolean(Number(!!value)));
  };

  const userDetails = data?.userDetails;
  const country = countriesDB.getCountry(userDetails?.countryCode);

  const onChangeText = (phoneNumber: string) => {
    if (
      phoneNumber.substring(0, country?.phoneCode?.length) == country?.phoneCode
    ) {
      setPhoneNumber(phoneNumber);
    }
  };

  const [sendOtp, { loading }] = useMutation<OTPInterface>(SEND_USER_OTP, {
    variables: { payload: { phoneNumber, deviceId: DEVICE_ID } }
  });

  const [addPhoneNumber] = useMutation(ADD_USER_DETAILS, {
    variables: { details: { phoneNumber: phoneNumber } }
  });

  const handleInputError = (error: string = 'inputError') => {
    Toast.show(t(`signup.getStartedScreen.${error}`));
  };

  const handleSubmit = async () => {
    if (!licenceAccepted) return openModal();
    if (!phoneNumber) return handleInputError();

    try {
      await sendOtp();
      navigation.navigate('OTPScreen');
      Storage.setUserCredentials({ appVersion: APP_VERSION } as VerifyOTPIT);
      addPhoneNumber();
    } catch (error) {
      if (error.message.includes('read ECONNRESET')) {
        handleSubmit();
      } else {
        handleInputError();
      }
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  useEffect(() => {
    if (licenceAccepted && phoneNumber && isSubmit) {
      closeModal();
      handleSubmit();
    }
  }, [licenceAccepted, isSubmit]);

  useEffect(() => {
    if (country?.phoneCode) {
      setPhoneNumber(country?.phoneCode);
    }
  }, [country.phoneCode]);

  const handleAccept = async () => {
    await Storage.setEULA();
    setIsSubmit(true);
    setLicenceAccepted(true);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: colors.WHITE
      }}
    >
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, padding: 20 }}>
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

          <StatusBar style="dark" />
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
              value={phoneNumber}
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

          <Portal>
            <Modalize
              ref={modalizeRef}
              modalStyle={{ marginTop: RFValue(80) }}
              scrollViewProps={{
                style: { flex: 1 },
                contentContainerStyle: {
                  paddingHorizontal: RFValue(10),
                  paddingBottom: RFValue(
                    insets.bottom > 0 ? insets.bottom * 2 : 20 * 2
                  )
                }
              }}
              HeaderComponent={
                <Container
                  style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    alignItems: 'center',
                    padding: RFValue(10),
                    justifyContent: 'space-between',
                    borderBottomColor: colors.DISABLED
                  }}
                >
                  <StatusBar style="light" />
                  <Container
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <IconButton
                      borderless
                      icon="close"
                      size={RFValue(20)}
                      color={colors.RED}
                      onPress={closeModal}
                      style={{ backgroundColor: hexToRGB(colors.RED, 0.3) }}
                    />
                    <Title
                      style={{
                        color: colors.PRIMARY_TEXT,
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(Math.ceil(fonts.MEDIUM_SIZE))
                      }}
                    >
                      {t(`signup.getStartedScreen.decline`)}
                    </Title>
                  </Container>

                  <Title
                    style={{
                      lineHeight: RFValue(30),
                      color: colors.PRIMARY_TEXT,
                      fontFamily: fonts.WORK_SANS_BOLD,
                      fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE - 2))
                    }}
                  >
                    {t(`signup.getStartedScreen.EULA`)}
                  </Title>
                  <Container
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Title
                      style={{
                        color: colors.PRIMARY_TEXT,
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        fontSize: RFValue(Math.ceil(fonts.MEDIUM_SIZE))
                      }}
                    >
                      {t(`signup.getStartedScreen.accept`)}
                    </Title>
                    <IconButton
                      borderless
                      icon="check"
                      size={RFValue(20)}
                      color={colors.ONLINE}
                      onPress={handleAccept}
                      style={{ backgroundColor: hexToRGB(colors.ONLINE, 0.3) }}
                    />
                  </Container>
                </Container>
              }
            >
              <HTML
                source={{ html: htmlContent }}
                classesStyles={{
                  agreement_md: {
                    color: 'teal',
                    fontWeight: '800',
                    marginTop: RFValue(20)
                  }
                }}
                tagsStyles={{
                  h1: {
                    fontWeight: 'bold',
                    fontSize: RFValue(24),
                    lineHeight: RFValue(30),
                    marginVertical: RFValue(10)
                  }
                }}
              />
            </Modalize>
          </Portal>
        </Fragment>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
