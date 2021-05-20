import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Title, Text, TextInput, Divider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Countries from './widgets/bankCountry';
import LocalStates from './widgets/localStates';
import { Modalize } from 'react-native-modalize';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { countWords } from '../../../utils/countWords';
import { crashlytics } from '../../../firebase/config';
import GradientButton from '../../../components/gradientButton';
import { ONBOARD_USER } from '../../../graphql/server/mutations';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

import {
  HeaderCover,
  LabelContainer,
  InputContainer,
  ContactContainer
} from './styles';
import { View, Switch } from 'react-native';
import hexToRGB from '../../../utils/hexToRGB';

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

  const [billingDetails, setBillingDetails] = useState({
    addressLine: '',
    addressCity: '',
    addressState: '',
    addressCountry: '',
    addressStateCode: '',
    addressPostalCode: '',
    addressCountryCode: ''
  });
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const toggleSwitch = () => setIsSwitchOn((previousState) => !previousState);

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
            {!isSwitchOn && (
              <Fragment>
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
                      Account Number
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
                        fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        color: colors.PRIMARY_TEXT,
                        textTransform: 'capitalize'
                      }}
                    >
                      Routing Number
                    </Title>
                  </LabelContainer>
                  <TextInput
                    value={addressPostalCode}
                    onChangeText={(addressPostalCode: string) =>
                      setBillingDetails({
                        ...billingDetails,
                        addressPostalCode
                      })
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
              </Fragment>
            )}

            {isSwitchOn && (
              <InputContainer>
                <LabelContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT
                    }}
                  >
                    iBan
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
            )}

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
                  Account Name
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
