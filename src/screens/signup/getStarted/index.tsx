import React, { useState, Fragment } from 'react';
import {
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, Subheading, Paragraph, Snackbar } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { NavigationInterface } from '../../types';
import Input from '../../../components/input';
import Countries from '../../../libs/countries';
import { GET_USER_DETAILS } from '../../../graphql/cache/query';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import { SEND_USER_OTP } from '../../../graphql/server/mutations';
import { StoreInterface, OTPInterface } from '../../../graphql/types';
import { DEVICE_OS, DEVICE_ID } from '../../../utils/device';
import GradientButton from '../../../components/gradientButton';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function getStartedScreenScreen(props: ScreenProp) {
  const { navigation } = props;

  const { data } = useQuery<StoreInterface>(GET_USER_DETAILS);
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const userDetails = data?.userDetails;

  const country = Countries.getCountryDataByCode(userDetails?.countryCode);

  const [state, setState] = useState({
    number: '',
    inputError: false,
    loading: false
  });

  const onChangeText = (number: string) => setState({ ...state, number });

  const [sendOtp] = useMutation<OTPInterface>(SEND_USER_OTP, {
    variables: {
      payload: { phoneNumber: `+${state.number}`, deviceId: DEVICE_ID }
    }
  });

  const [addPhoneNumber] = useMutation(ADD_USER_DETAILS, {
    variables: { details: { number: `+${state.number}` } }
  });


  const handleInputError = () => {
    setState({ ...state, inputError: !state.inputError });
  };

  const handleSubmit = async () => {
    if (!state.number) return handleInputError();

    setState({ ...state, loading: true });
    const { data } = await sendOtp();

    if (data?.sendOtp.success) {
      setState({ ...state, loading: false });
      navigation.navigate('OTPScreen');
      addPhoneNumber();
    }
  };

 

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: colors.WHITE,
        padding: 20
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
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
                defaultValue={country?.dialCode}
                onChangeText={onChangeText}
                keyboardType="phone-pad"
                returnKeyType="done"
              >
                <TouchableOpacity
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
                    <Image
                      style={{
                        width: RFValue(25),
                        height: RFValue(30),
                        resizeMode: 'contain'
                      }}
                      //@ts-ignore
                      source={Countries.getFlag(userDetails?.countryCode)}
                    />
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

              <GradientButton loading={state.loading} onPress={handleSubmit}>
                {t(
                  `signup.getStartedScreen.${
                    state.loading ? 'loading' : 'submit'
                  }`
                )}
              </GradientButton>
            </Container>

            <Snackbar
              duration={Snackbar.DURATION_SHORT}
              visible={state.inputError}
              onDismiss={handleInputError}
              action={{ label: 'Dismiss', onPress: handleInputError }}
            >
              {t(`signup.getStartedScreen.inputError`)}
            </Snackbar>
          </Fragment>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
