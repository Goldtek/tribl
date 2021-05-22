import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Title, Text, ProgressBar, TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Countries from './widgets/bankCountry';
import LocalStates from './widgets/localStates';
import { Modalize } from 'react-native-modalize';
import { useThemeContext } from '../../../../theme';
import { NavigationInterface } from '../../../types';
import { countWords } from '../../../../utils/countWords';
import { crashlytics } from '../../../../firebase/config';
import GradientButton from '../../../../components/gradientButton';
import { SAVE_BANK_DETAILS } from '../../../../graphql/server/mutations';
import { tagScreenName, logEvent } from '../../../../utils/uxcamHelper';

import {
  HeaderCover,
  LabelContainer,
  InputContainer,
  ContactContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function BankBillingDetailsScreen(props: ScreenProp) {
  const { navigation } = props;
  const {
    accountNumber,
    routingNumber,
    iBan,
    name,
    line1,
    line2,
    city,
    district,
    postalCode,
    country
  } = props.route.params.accountDetails;

  const { isSwitchOn } = props.route.params;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const modalizeRef = useRef<Modalize>(null);
  const modalizeStateRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();
  const openStateModal = () => modalizeStateRef.current?.open();

  const [billingDetails, setBillingDetails] = useState({
    addressLine: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    addressCountry: 'Select',
    addressStateCode: '',
    addressPostalCode: '',
    addressCountryCode: ''
  });

  const [isLocal, setIsLocal] = useState(false);

  const {
    addressLine,
    addressLine2,
    addressCity,
    addressState,
    addressCountry,
    addressStateCode,
    addressPostalCode,
    addressCountryCode
  } = billingDetails;

  useEffect(() => {
    if (isLocal === false && addressCountryCode === 'US') {
      setBillingDetails({
        ...billingDetails,
        addressState: 'Select'
      });
      setIsLocal(true);
    }

    tagScreenName('BillingDetailsScreen');
    logEvent('Verify user identity', { from: 'passport' });
  }, []);

  const Payload = {
    payload: {
      accountDetails: {
        accountNumber: isSwitchOn ? '' : accountNumber,
        routingNumber: isSwitchOn ? '' : routingNumber
      },
      iBan: isSwitchOn ? iBan : '',
      bankAddress: {
        name,
        line1,
        line2,
        city,
        district,
        postalCode,
        country
      },
      billingId: '',
      billingAddress: {
        addressLine,
        addressLine2,
        addressCity,
        addressState,
        addressCountry,
        addressStateCode,
        addressPostalCode,
        addressCountryCode
      }
    }
  };
  const [saveBankDetails, { loading }] = useMutation(SAVE_BANK_DETAILS, {
    variables: {
      payload: {
        accountDetails: {
          accountNumber: isSwitchOn ? '' : accountNumber,
          routingNumber: isSwitchOn ? '' : routingNumber
        },
        iBan: isSwitchOn ? iBan : '',
        bankAddress: {
          name,
          line1,
          line2,
          city,
          district,
          postalCode,
          country
        },
        billingId: '',
        billingAddress: {
          addressLine,
          addressLine2,
          addressCity,
          addressState,
          addressCountry,
          addressStateCode,
          addressPostalCode,
          addressCountryCode
        }
      }
    }
  });

  const submitBankDetails = async () => {
    // return console.log('variables', Payload);
    // if (countWords(addressLine)) return alert('Address field is compulsory');
    // if (countWords(addressPostalCode))
    //   return alert('Postal code field is compulsory');
    // if (countWords(addressCountryCode))
    //   return alert('Country code field is compulsory');
    // if (countWords(addressState) || addressState.trim() === 'Select')
    //   return alert('State field is compulsory');
    // if (countWords(addressCity)) return alert('City field is compulsory');

    try {
      const { data } = await saveBankDetails();
      console.tron('data', data);
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
          backgroundColor: colors.WHITE
        }}
      >
        <Fragment>
          <HeaderCover>
            <ProgressBar
              progress={2 / 2}
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
                    textTransform: 'capitalize'
                  }}
                >
                  address line 1
                </Title>
              </LabelContainer>
              <TextInput
                multiline={true}
                dense={true}
                value={addressLine}
                placeholder="Enter Address Line 1"
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
                    textTransform: 'capitalize'
                  }}
                >
                  address line 2
                </Title>
              </LabelContainer>
              <TextInput
                multiline={true}
                dense={true}
                value={addressLine2}
                placeholder="Enter Address Line 2"
                onChangeText={(addressLine2: string) =>
                  setBillingDetails({ ...billingDetails, addressLine2 })
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
                    textTransform: 'capitalize'
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
                placeholder="Enter Postal Code"
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
                      textTransform: 'capitalize'
                    }}
                  >
                    Country
                  </Title>
                </LabelContainer>

                <TextInput
                  value={addressCountry}
                  disabled={true}
                  style={{
                    height: 30,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                    color: colors.PRIMARY_TEXT,
                    backgroundColor: colors.WHITE,
                    borderColor: colors.DISABLED,
                    textTransform: 'capitalize',
                    borderBottomWidth: 1
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
                      textTransform: 'capitalize'
                    }}
                  >
                    State
                  </Title>
                </LabelContainer>
                <TextInput
                  value={handleStateValue()}
                  disabled={isLocal}
                  placeholder="Enter State"
                  onChangeText={(addressState: string) =>
                    setBillingDetails({
                      ...billingDetails,
                      addressState,
                      addressStateCode: addressState
                    })
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
                    textTransform: 'capitalize'
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
                placeholder="Enter City"
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
            // disabled={loading}
            // loading={loading}
            onPress={submitBankDetails}
            style={{ height: 50 }}
            gradientContainerstyle={{
              height: 50,
              marginBottom: RFValue(30),
              marginHorizontal: RFValue(15)
            }}
            contentStyle={{ height: 50 }}
          >
            {/* {loading ? 'loading...' : 'Submit'} */}
            Submit
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
