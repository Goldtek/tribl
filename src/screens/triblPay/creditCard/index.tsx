import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Feather,
  FontAwesome,
  SimpleLineIcons,
  Octicons
} from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  Title,
  Text,
  TouchableRipple,
  Portal,
  Divider,
  TextInput
} from 'react-native-paper';
import { CreditCardInput } from 'react-native-input-credit-card';

import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';

import {
  ContactContainer,
  Container,
  InputContainer,
  LabelContainer
} from './styles';
import { Modalize } from 'react-native-modalize';
import { DEVICE_FULL_HEIGHT } from '../../../utils/device';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Countries from './widgets/bankCountry';
import LocalStates from './widgets/localStates';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GradientButton from '../../../components/gradientButton';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CreditCardScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { navigation } = props;

  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const modalizeRef = useRef<Modalize>(null);
  const modalizeCardRef = useRef<Modalize>(null);
  const modalizeStateRef = useRef<Modalize>(null);

  const openCardModal = () => modalizeCardRef.current?.open();

  const openStateModal = () => {
    modalizeCardRef.current?.close();
    modalizeStateRef.current?.open();
  };
  const openModal = () => {
    modalizeCardRef.current?.close();
    modalizeRef.current?.open();
  };

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
    console.tron('form', form);
  };

  useEffect(() => {
    if (billingDetailsType === 'new') {
      scrollRef.current?.scrollToEnd(true);
    }
  }, [billingDetailsType]);

  const handleSelection = (type: string) => setBillingDetailsType(type);

  const handleStateValue = () => {
    if (isLocal && addressState === '')
      setBillingDetails({ ...billingDetails, addressState: 'Select' });
    return addressState;
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
            onPress={() => handleSelection('old')}
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

          <TouchableRipple
            onPress={() => handleSelection('new')}
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
          // disabled={loading}
          // loading={loading}
          onPress={() => navigation.navigate('WalletScreen')}
          style={{ height: 50 }}
          gradientContainerstyle={{
            height: 50,
            marginBottom: RFValue(30),
            marginHorizontal: RFValue(15)
          }}
          contentStyle={{ height: 50 }}
        >
          Submit
        </GradientButton>
      </KeyboardAwareScrollView>

      <Countries
        modalizeCardRef={modalizeCardRef}
        modalizeRef={modalizeRef}
        billingDetails={billingDetails}
        setBillingDetails={setBillingDetails}
        setIsLocal={setIsLocal}
      />

      <LocalStates
        modalizeCardRef={modalizeCardRef}
        modalizeStateRef={modalizeStateRef}
        billingDetails={billingDetails}
        setBillingDetails={setBillingDetails}
      />
    </Container>
  );
}
