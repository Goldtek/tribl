import React, { Fragment, useEffect, useRef, useState } from 'react';

import {
  Title,
  Text,
  TouchableRipple,
  Divider,
  TextInput
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import OpenPGP from 'react-native-fast-openpgp';
import { Modalize } from 'react-native-modalize';
import { TouchableOpacity, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { SimpleLineIcons, Octicons } from '@expo/vector-icons';
import { CreditCardInput } from 'react-native-input-credit-card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  GET_CARD_PCI_OUTPUT,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import Countries from './widgets/bankCountry';
import { Base64 } from '../../../utils/base64';
import LocalStates from './widgets/localStates';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { crashlytics } from '../../../firebase/config';
import ErrorModal from '../../../components/errorModal';
import { MyPassportInterface } from '../../../graphql/types';
import GradientButton from '../../../components/gradientButton';
import { SAVE_CARD_DETAILS } from '../../../graphql/server/mutations';

import {
  ContactContainer,
  Container,
  InputContainer,
  LabelContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CreditCardScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const modalizeRef = useRef<Modalize>(null);
  const modalizeErrorRef = useRef<Modalize>(null);
  const modalizeStateRef = useRef<Modalize>(null);

  const openErrorModal = () => modalizeErrorRef.current?.open();

  const openStateModal = () => modalizeStateRef.current?.open();

  const openModal = () => modalizeRef.current?.open();

  const { data: cardPci } = useQuery(GET_CARD_PCI_OUTPUT);

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userBillingDetails = userDetails?.wallet.billingDetails;

  const [saveCardDetails, { loading }] = useMutation(SAVE_CARD_DETAILS);
  const [savebillIdCardDetails, { loading: billIdLoading }] = useMutation(
    SAVE_CARD_DETAILS
  );

  const [billingDetailsType, setBillingDetailsType] = useState('old');

  const [billingDetails, setBillingDetails] = useState({
    addressLine: '',
    addressCity: '',
    addressState: '',
    addressCountry: 'Select',
    addressStateCode: '',
    addressPostalCode: '',
    addressCountryCode: ''
  });

  const [cardDetails, setCardDetails] = useState<any>();
  const [isLocal, setIsLocal] = useState(false);

  const {
    addressLine,
    addressCity,
    addressState,
    addressCountry,
    addressStateCode,
    addressPostalCode,
    addressCountryCode
  } = billingDetails;

  const handleInput = (form: any) => {
    setCardDetails(form);
  };

  useEffect(() => {
    if (!userBillingDetails) setBillingDetailsType('new');
    if (billingDetailsType === 'new') {
      scrollRef.current?.scrollToEnd(true);
    }
  }, [billingDetailsType]);

  const handleExistingSelection = (type: string) => {
    if (!userBillingDetails) return;
    setBillingDetailsType(type);
  };

  const handleStateValue = () => {
    if (isLocal && addressState === '')
      setBillingDetails({ ...billingDetails, addressState: 'Select' });
    return addressState;
  };

  const submitCreditCardDetails = async () => {
    const { key, keyId } = await cardPci.getCardPciKey;
    const { values } = cardDetails;

    const expiry = values.expiry.split('/');
    const expMonth = +expiry[0];
    const expYear = +expiry[1] + 2000;

    const options = {
      number: values.number.replace(/\s/g, ''),
      cvv: values.cvc
    };

    const encrypted = await OpenPGP.encrypt(
      JSON.stringify(options),
      Base64.atob(`${key}`)
    );

    const payload = {
      expYear,
      expMonth,
      encryptedData: Base64.btoa(encrypted),
      keyId
    };

    try {
      const { data } =
        billingDetailsType === 'old' && userBillingDetails
          ? await saveCardDetails({
              variables: {
                payload: {
                  ...payload,
                  billingId: userBillingDetails[0]?.id
                }
              }
            })
          : await savebillIdCardDetails({
              variables: {
                payload: {
                  ...payload,
                  billingAddress: {
                    addressLine,
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

      if (data) {
        navigation.navigate('WalletScreen');
      }
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
      openErrorModal();
    }
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        ref={scrollRef}
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps={'always'}
        enableOnAndroid={true}
        contentContainerStyle={{
          backgroundColor: colors.WHITE
        }}
      >
        <CreditCardInput onChange={handleInput} />

        <Divider style={{ marginTop: 10 }} />
        <Title style={{ paddingHorizontal: 20 }}>Enter Billing Details</Title>
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableRipple
            onPress={() => handleExistingSelection('old')}
            style={{
              flexDirection: 'row',
              borderColor: userBillingDetails
                ? colors.PRIMARY
                : colors.DISABLED,
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
                <SimpleLineIcons name="note" size={22} color={colors.PRIMARY} />
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
        <Divider style={{ marginTop: 10 }} />

        <ContactContainer
          style={{ display: billingDetailsType === 'new' ? 'flex' : 'none' }}
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
              placeholder="Enter Address"
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
                placeholder="Enter Country"
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
                onChangeText={(addressState: string) =>
                  setBillingDetails({
                    ...billingDetails,
                    addressState,
                    addressStateCode: addressState
                  })
                }
                placeholder="Enter State"
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
          disabled={loading || billIdLoading}
          loading={loading || billIdLoading}
          onPress={submitCreditCardDetails}
          style={{ height: 50 }}
          gradientContainerstyle={{
            height: 50,
            marginBottom: RFValue(30),
            marginHorizontal: RFValue(15)
          }}
          contentStyle={{ height: 50 }}
        >
          {loading || billIdLoading ? 'loading...' : 'Submit'}
        </GradientButton>
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
    </Container>
  );
}
