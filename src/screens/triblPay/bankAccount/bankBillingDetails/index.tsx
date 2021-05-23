import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Title,
  Text,
  ProgressBar,
  TextInput,
  TouchableRipple,
  Divider
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
import { View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Octicons, SimpleLineIcons } from '@expo/vector-icons';
import { MyPassportInterface } from '../../../../graphql/types';
import { GET_USER_PASSPORT } from '../../../../graphql/server/query';
import { Toast } from '../../../../components/rootToaster';
import ErrorModal from '../../../../components/errorModal';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function BankBillingDetailsScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const modalizeRef = useRef<Modalize>(null);
  const modalizeStateRef = useRef<Modalize>(null);
  const modalizeErrorRef = useRef<Modalize>(null);
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

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userBillingDetails = userDetails?.wallet.billingDetails;

  const [saveiBanBankDetails, { loading: ibanBankLoading }] = useMutation(
    SAVE_BANK_DETAILS
  );
  const [saveiBanBillIdBankDetails, { loading: ibanBillLoading }] = useMutation(
    SAVE_BANK_DETAILS
  );
  const [saveAccBankDetails, { loading: accBankLoading }] = useMutation(
    SAVE_BANK_DETAILS
  );
  const [saveAccBillIdBankDetails, { loading: accBillLoading }] = useMutation(
    SAVE_BANK_DETAILS
  );

  const [isLocal, setIsLocal] = useState(false);
  const [billingDetailsType, setBillingDetailsType] = useState('old');
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
    if (!userBillingDetails) setBillingDetailsType('new');
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

  const openErrorModal = () => modalizeErrorRef.current?.open();

  const handleInputError = (error: string) => {
    Toast.show(`${error}`);
  };

  const handleExistingSelection = (type: string) => {
    if (!userBillingDetails) return;
    setBillingDetailsType(type);
  };

  const openModal = () => modalizeRef.current?.open();
  const openStateModal = () => modalizeStateRef.current?.open();

  const bankAdressPayload = {
    bankAddress: {
      name,
      line1,
      line2,
      city,
      district,
      postalCode,
      country
    }
  };

  const billingAdressPayload = {
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
  };

  const accountDetailsPayload = {
    accountDetails: {
      accountNumber,
      routingNumber
    }
  };

  const submitBankDetails = async () => {
    const withIban =
      billingDetailsType === 'old' && userBillingDetails
        ? async () =>
            await saveiBanBillIdBankDetails({
              variables: {
                payload: {
                  ...bankAdressPayload,
                  iBan,
                  billingId: userBillingDetails[0].id
                }
              }
            })
        : async () =>
            await saveiBanBankDetails({
              variables: {
                payload: {
                  ...bankAdressPayload,
                  ...billingAdressPayload,
                  iBan
                }
              }
            });

    const withoutIban =
      billingDetailsType === 'old' && userBillingDetails
        ? async () =>
            await saveAccBillIdBankDetails({
              variables: {
                payload: {
                  ...bankAdressPayload,
                  ...accountDetailsPayload,
                  billingId: userBillingDetails[0].id
                }
              }
            })
        : async () =>
            await saveAccBankDetails({
              variables: {
                payload: {
                  ...bankAdressPayload,
                  ...billingAdressPayload,
                  ...accountDetailsPayload
                }
              }
            });

    try {
      const { data } = isSwitchOn ? await withIban() : await withoutIban();
      if (data) {
        navigation.navigate('WalletScreen');
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
      openErrorModal();
    }
  };

  const handleStateValue = () => {
    if (isLocal && addressState === '')
      setBillingDetails({ ...billingDetails, addressState: 'Select' });
    return addressState;
  };

  return (
    <View style={{ backgroundColor: colors.WHITE, flex: 1 }}>
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

          <View style={{ paddingHorizontal: 20 }}>
            <TouchableRipple
              onPress={() => handleExistingSelection('old')}
              style={{
                flexDirection: 'row',
                borderColor: colors.PRIMARY,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: RFValue(10),
                marginVertical: RFValue(10)
              }}
            >
              <Fragment>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Octicons name="note" size={25} color={colors.PRIMARY} />
                  <Text
                    style={{
                      fontFamily: fonts.WORK_SANS_MEDIUM,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
                      color: colors.SECONDARY_TEXT,
                      textTransform: 'capitalize',
                      lineHeight: RFValue(19),
                      marginLeft: RFValue(10)
                    }}
                  >
                    Use existing details
                  </Text>
                </View>
                <CheckBox
                  disabled={true}
                  value={billingDetailsType === 'old'}
                  tintColors={{
                    true: colors.PRIMARY,
                    false: colors.INACTIVE
                  }}
                  animationDuration={0.2}
                  tintColor={colors.INACTIVE}
                  onCheckColor={colors.WHITE}
                  onFillColor={colors.PRIMARY}
                  onTintColor={colors.PRIMARY}
                  style={{ width: RFValue(20), height: RFValue(20) }}
                />
              </Fragment>
            </TouchableRipple>

            {userBillingDetails && (
              <View
                style={{
                  display: billingDetailsType === 'old' ? 'flex' : 'none',
                  marginBottom: 10
                }}
              >
                {userBillingDetails.map((item) => (
                  <Text
                    key={item.id}
                    style={{
                      paddingHorizontal: 10,
                      fontFamily: fonts.WORK_SANS_MEDIUM
                    }}
                  >
                    {`- ${item.addressLine} ${item.city}, ${item.state}, ${item.countryCode} - ${item.postCode}`}
                  </Text>
                ))}
              </View>
            )}

            <TouchableRipple
              onPress={() => setBillingDetailsType('new')}
              style={{
                flexDirection: 'row',
                borderColor: colors.PRIMARY,
                borderWidth: 1,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: RFValue(10),
                marginVertical: RFValue(10)
              }}
            >
              <Fragment>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SimpleLineIcons
                    name="note"
                    size={22}
                    color={colors.PRIMARY}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.WORK_SANS_MEDIUM,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
                      color: colors.SECONDARY_TEXT,
                      textTransform: 'capitalize',
                      lineHeight: RFValue(19),
                      marginLeft: RFValue(10)
                    }}
                  >
                    Enter New Details
                  </Text>
                </View>
                <CheckBox
                  disabled={true}
                  value={billingDetailsType === 'new'}
                  tintColors={{
                    true: colors.PRIMARY,
                    false: colors.INACTIVE
                  }}
                  animationDuration={0.2}
                  tintColor={colors.INACTIVE}
                  onCheckColor={colors.WHITE}
                  onFillColor={colors.PRIMARY}
                  onTintColor={colors.PRIMARY}
                  style={{ width: RFValue(20), height: RFValue(20) }}
                />
              </Fragment>
            </TouchableRipple>
          </View>
          <Divider style={{ marginTop: 5 }} />

          <ContactContainer
            style={{
              display: billingDetailsType === 'new' ? 'flex' : 'none'
            }}
          >
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
            disabled={
              ibanBankLoading ||
              ibanBillLoading ||
              accBankLoading ||
              accBillLoading
            }
            loading={
              ibanBankLoading ||
              ibanBillLoading ||
              accBankLoading ||
              accBillLoading
            }
            onPress={submitBankDetails}
            style={{ height: 50 }}
            gradientContainerstyle={{
              height: 50,
              marginBottom: RFValue(30),
              marginHorizontal: RFValue(15)
            }}
            contentStyle={{ height: 50 }}
          >
            {ibanBankLoading ||
            ibanBillLoading ||
            accBankLoading ||
            accBillLoading
              ? 'loading...'
              : 'Submit'}
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
      <ErrorModal modalizeErrorRef={modalizeErrorRef} />
    </View>
  );
}
