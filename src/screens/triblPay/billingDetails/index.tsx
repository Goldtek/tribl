import React, { Fragment, useEffect, useRef, useState } from 'react';

import { Title, Text, ProgressBar, TextInput } from 'react-native-paper';

import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import GradientButton from '../../../components/gradientButton';

import {
  ContactContainer,
  LabelContainer,
  HeaderCover,
  InputContainer
} from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from '@apollo/react-hooks';
import { ONBOARD_USER } from '../../../graphql/server/mutations';
import { crashlytics } from '../../../firebase/config';
import Countries from './widgets/bankCountry';
import { Modalize } from 'react-native-modalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LocalStates from './widgets/localStates';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function BillingDetailsScreen(props: ScreenProp) {
  const { navigation } = props;
  const { job, details } = props.route.params;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const modalizeRef = useRef<Modalize>(null);
  const modalizeStateRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();
  const openStateModal = () => modalizeStateRef.current?.open();

  const [billingDetails, setBillingDetails] = useState({
    addressLine: '',
    addressCity: '',
    addressState: '',
    addressPostalCode: '',
    addressCountryCode: details.iso2
  });

  const [isLocal, setIsLocal] = useState(false);

  const {
    addressLine,
    addressCity,
    addressState,
    addressPostalCode,
    addressCountryCode
  } = billingDetails;

  useEffect(() => {
    tagScreenName('BillingDetailsScreen');
    logEvent('Verify user identity', { from: 'passport' });
  }, []);

  const [verifyKyc, { loading }] = useMutation(ONBOARD_USER, {
    variables: {
      payload: {
        address: {
          addressLine,
          addressCity,
          addressState,
          addressPostalCode,
          addressCountryCode
        },
        jobId: job.id,
        isLocal
      }
    }
  });

  const countWords = (word: string) => {
    return word.trim().split('').length < 1;
  };

  const submitKyc = async () => {
    if (countWords(addressLine)) return alert('Address field is compulsory');
    if (countWords(addressPostalCode))
      return alert('Postal code field is compulsory');
    if (countWords(addressCountryCode))
      return alert('Country code field is compulsory');
    if (countWords(addressState) || addressState.trim() === 'Select')
      return alert('State field is compulsory');
    if (countWords(addressCity)) return alert('City field is compulsory');
    try {
      const { data } = await verifyKyc();

      if (data) {
        navigation.navigate('WalletStatusScreen', {});
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleStateValue = () => {
    if (isLocal && addressState === '')
      setBillingDetails({ ...billingDetails, addressState: 'Select' });
    return addressState;
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        enableOnAndroid={true}
        contentContainerStyle={{
          backgroundColor: colors.WHITE,
          flex: 1
        }}
      >
        <Fragment>
          <HeaderCover>
            <ProgressBar
              progress={5 / 5}
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
              {t(`community.passport.step`)} 5
            </Text>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 5),
                color: colors.PRIMARY_TEXT,
                lineHeight: RFValue(30)
              }}
            >
              Enter Billing Details
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
              Please Enter billing details.
            </Text>
          </HeaderCover>

          <ContactContainer>
            <InputContainer>
              <LabelContainer>
                <Title
                  style={{
                    fontFamily: fonts.WORK_SANS_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase'
                  }}
                >
                  address
                </Title>
              </LabelContainer>
              <TextInput
                multiline={true}
                dense={true}
                value={addressLine}
                onChangeText={(addressLine: string) =>
                  setBillingDetails({ ...billingDetails, addressLine })
                }
                style={{
                  height: 30,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                  color: colors.PRIMARY_TEXT,
                  backgroundColor: colors.WHITE,
                  borderColor: colors.PRIMARY,
                  textTransform: 'capitalize'
                }}
              />
            </InputContainer>

            <InputContainer>
              <LabelContainer>
                <Title
                  style={{
                    fontFamily: fonts.WORK_SANS_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase'
                  }}
                >
                  Postal Code
                </Title>
              </LabelContainer>
              <TextInput
                value={addressPostalCode}
                onChangeText={(addressPostalCode: string) =>
                  setBillingDetails({ ...billingDetails, addressPostalCode })
                }
                style={{
                  height: 30,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                  color: colors.PRIMARY_TEXT,
                  backgroundColor: colors.WHITE,
                  borderColor: colors.PRIMARY,
                  textTransform: 'capitalize'
                }}
              />
            </InputContainer>

            <TouchableOpacity onPress={openModal}>
              <InputContainer>
                <LabelContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'uppercase'
                    }}
                  >
                    Country code
                  </Title>
                </LabelContainer>

                <TextInput
                  value={addressCountryCode}
                  disabled={true}
                  style={{
                    height: 30,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                    color: colors.PRIMARY_TEXT,
                    backgroundColor: colors.WHITE,
                    borderColor: colors.DISABLED,
                    textTransform: 'capitalize',
                    borderBottomWidth: isLocal ? 1 : 0
                  }}
                />
              </InputContainer>
            </TouchableOpacity>

            <TouchableOpacity onPress={isLocal ? openStateModal : () => {}}>
              <InputContainer>
                <LabelContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'uppercase'
                    }}
                  >
                    State
                  </Title>
                </LabelContainer>
                <TextInput
                  value={handleStateValue()}
                  disabled={isLocal}
                  onChangeText={(addressState: string) =>
                    setBillingDetails({ ...billingDetails, addressState })
                  }
                  style={{
                    height: 30,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                    color: colors.PRIMARY_TEXT,
                    backgroundColor: colors.WHITE,
                    borderColor: colors.DISABLED,
                    textTransform: 'capitalize',
                    borderBottomWidth: isLocal ? 1 : 0
                  }}
                />
              </InputContainer>
            </TouchableOpacity>

            <InputContainer>
              <LabelContainer>
                <Title
                  style={{
                    fontFamily: fonts.WORK_SANS_BOLD,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    color: colors.PRIMARY_TEXT,
                    textTransform: 'uppercase'
                  }}
                >
                  City
                </Title>
              </LabelContainer>
              <TextInput
                value={addressCity}
                onChangeText={(addressCity: string) =>
                  setBillingDetails({ ...billingDetails, addressCity })
                }
                style={{
                  height: 30,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                  color: colors.PRIMARY_TEXT,
                  backgroundColor: colors.WHITE,
                  borderColor: colors.PRIMARY,
                  textTransform: 'capitalize',
                  marginBottom: 10
                }}
              />
            </InputContainer>
          </ContactContainer>

          <GradientButton
            disabled={loading}
            loading={loading}
            onPress={submitKyc}
            style={{ height: 50 }}
            gradientContainerstyle={{
              height: 50,
              marginBottom: RFValue(30),
              marginHorizontal: RFValue(15)
            }}
            contentStyle={{ height: 50 }}
          >
            {loading ? 'loading...' : 'Submit'}
          </GradientButton>
        </Fragment>
      </KeyboardAwareScrollView>

      <Countries
        modalizeRef={modalizeRef}
        billingDetails={billingDetails}
        setBillingDetails={setBillingDetails}
        setIsLocal={setIsLocal}
      />

      <LocalStates
        modalizeStateRef={modalizeStateRef}
        billingDetails={billingDetails}
        setBillingDetails={setBillingDetails}
      />
    </Fragment>
  );
}
