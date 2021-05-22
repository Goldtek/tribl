import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  Title,
  Text,
  TextInput,
  Divider,
  ProgressBar,
  TouchableRipple
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Countries from './widgets/bankCountry';
import LocalStates from './widgets/localStates';
import { Modalize } from 'react-native-modalize';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import GradientButton from '../../../components/gradientButton';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

import {
  HeaderCover,
  LabelContainer,
  InputContainer,
  ContactContainer
} from './styles';
import { View, Switch } from 'react-native';
import hexToRGB from '../../../utils/hexToRGB';
import { Octicons, SimpleLineIcons } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function BankAccountScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const modalizeRef = useRef<Modalize>(null);
  const modalizeStateRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();
  const openStateModal = () => modalizeStateRef.current?.open();

  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    iBan: '',
    name: '',
    line1: '',
    line2: '',
    city: '',
    district: '',
    postalCode: '',
    country: '',
    countryName: 'Select',
    billingId: ''
  });
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [billingDetailsType, setBillingDetailsType] = useState('old');
  const toggleSwitch = () => setIsSwitchOn((previousState) => !previousState);

  const [isLocal, setIsLocal] = useState(false);

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
    country,
    countryName
  } = accountDetails;
  useEffect(() => {
    if (isLocal === false && country === 'United States of America') {
      setAccountDetails({
        ...accountDetails,
        district: 'Select'
      });
      setIsLocal(true);
    }

    tagScreenName('BillingDetailsScreen');
    logEvent('Verify user identity', { from: 'passport' });
  }, []);

  const handleStateValue = () => {
    if (isLocal && district === '')
      setAccountDetails({ ...accountDetails, district: 'Select' });
    return district;
  };
  const handleSelection = (type: string) => setBillingDetailsType(type);

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
              progress={1 / 2}
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
              {t(`community.passport.step`)} 1
            </Text>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 5),
                color: colors.PRIMARY_TEXT,
                lineHeight: RFValue(30)
              }}
            >
              Enter Account Details
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
              Please fill in bank information.
            </Text>
          </HeaderCover>

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

            <View
              style={{
                display: billingDetailsType === 'old' ? 'flex' : 'none',
                marginBottom: 10
              }}
            >
              <Text
                style={{
                  paddingHorizontal: 10,
                  fontFamily: fonts.WORK_SANS_MEDIUM
                }}
              >
                - 12 Boulevarde court, London, United Kingdom
              </Text>
            </View>

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
          <Divider style={{ marginTop: 5, marginBottom: 20 }} />

          <View
            style={{
              display: billingDetailsType === 'new' ? 'flex' : 'none'
            }}
          >
            <HeaderCover>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Title
                  style={{
                    fontFamily: fonts.WORK_SANS_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE + 2),
                    color: colors.PRIMARY
                  }}
                >
                  Account Details
                </Title>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      marginRight: 10,
                      fontFamily: fonts.WORK_SANS_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                      color: colors.PRIMARY_TEXT
                    }}
                  >
                    use iBan
                  </Text>
                  <Switch
                    trackColor={{
                      false: colors.INACTIVE,
                      true: hexToRGB(colors.PRIMARY_LIGHT, 0.7)
                    }}
                    thumbColor={
                      isSwitchOn ? hexToRGB(colors.PRIMARY, 6) : colors.INACTIVE
                    }
                    ios_backgroundColor={colors.INACTIVE}
                    onValueChange={toggleSwitch}
                    value={isSwitchOn}
                  />
                </View>
              </View>
            </HeaderCover>

            <Divider />

            <ContactContainer>
              <InputContainer>
                <LabelContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize'
                    }}
                  >
                    Bank Name
                  </Title>
                </LabelContainer>
                <TextInput
                  value={name}
                  onChangeText={(name: string) =>
                    setAccountDetails({ ...accountDetails, name })
                  }
                  placeholder="Enter Bank Name"
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
            </ContactContainer>

            <HeaderCover>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE + 2),
                  color: colors.PRIMARY
                }}
              >
                Bank Details
              </Title>
            </HeaderCover>

            <Divider />

            <ContactContainer>
              <InputContainer>
                <LabelContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize'
                    }}
                  >
                    Address Line 1
                  </Title>
                </LabelContainer>
                <TextInput
                  value={line1}
                  onChangeText={(line1: string) =>
                    setAccountDetails({ ...accountDetails, line1 })
                  }
                  placeholder="Enter Address Line 1"
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
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize'
                    }}
                  >
                    Address Line 2
                  </Title>
                </LabelContainer>
                <TextInput
                  value={line2}
                  onChangeText={(line2: string) =>
                    setAccountDetails({ ...accountDetails, line2 })
                  }
                  placeholder="Enter Address Line 2"
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
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'capitalize'
                      }}
                    >
                      Country
                    </Title>
                  </LabelContainer>

                  <TextInput
                    value={countryName}
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
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
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
                    onChangeText={(district: string) =>
                      setAccountDetails({ ...accountDetails, district })
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
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize'
                    }}
                  >
                    City
                  </Title>
                </LabelContainer>
                <TextInput
                  value={city}
                  onChangeText={(city: string) =>
                    setAccountDetails({ ...accountDetails, city })
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

              <InputContainer>
                <LabelContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'capitalize'
                    }}
                  >
                    Postal Code
                  </Title>
                </LabelContainer>
                <TextInput
                  value={postalCode}
                  onChangeText={(postalCode: string) =>
                    setAccountDetails({ ...accountDetails, postalCode })
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
            </ContactContainer>
          </View>
        </Fragment>
      </KeyboardAwareScrollView>

      <GradientButton
        onPress={() =>
          navigation.navigate('BankBillingDetailsScreen', {
            accountDetails,
            isSwitchOn
          })
        }
        style={{ height: 50 }}
        gradientContainerstyle={{
          height: 50,
          marginBottom: RFValue(30),
          marginHorizontal: RFValue(15)
        }}
        contentStyle={{ height: 50 }}
      >
        Next
      </GradientButton>

      <Countries
        modalizeRef={modalizeRef}
        accountDetails={accountDetails}
        setAccountDetails={setAccountDetails}
        setIsLocal={setIsLocal}
      />

      <LocalStates
        modalizeStateRef={modalizeStateRef}
        accountDetails={accountDetails}
        setAccountDetails={setAccountDetails}
      />
    </View>
  );
}
