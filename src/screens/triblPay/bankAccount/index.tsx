import React, { Fragment, useEffect, useRef, useState } from 'react';

import {
  Title,
  Text,
  TextInput,
  Divider,
  ProgressBar
} from 'react-native-paper';
import { View, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Countries from './widgets/bankCountry';
import hexToRGB from '../../../utils/hexToRGB';
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
                    value={accountNumber}
                    onChangeText={(accountNumber: string) =>
                      setAccountDetails({ ...accountDetails, accountNumber })
                    }
                    placeholder="Enter Account Number"
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
                    value={routingNumber}
                    onChangeText={(routingNumber: string) =>
                      setAccountDetails({ ...accountDetails, routingNumber })
                    }
                    placeholder="Enter Routing Number"
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
                  value={iBan}
                  onChangeText={(iBan: string) =>
                    setAccountDetails({ ...accountDetails, iBan })
                  }
                  placeholder="Enter iBan"
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
        </Fragment>
      </KeyboardAwareScrollView>

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
    </Fragment>
  );
}
