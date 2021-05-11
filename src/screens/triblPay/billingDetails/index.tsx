import React, { Fragment, useEffect, useState } from 'react';

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
import { useMutation, useQuery } from '@apollo/react-hooks';
import { ONBOARD_USER } from '../../../graphql/server/mutations';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function BillingDetailsScreen(props: ScreenProp) {
  const { navigation } = props;
  const { job } = props.route.params;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [billingDetails, setBillingDetails] = useState({
    addressLine: '',
    addressCity: '',
    addressState: '',
    addressPostalCode: '',
    addressCountryCode: ''
  });
  const {
    addressLine,
    addressCity,
    addressState,
    addressPostalCode,
    addressCountryCode
  } = billingDetails;

  const [verifyKyc, { data, loading }] = useMutation(ONBOARD_USER);
  useEffect(() => {
    tagScreenName('BillingDetailsScreen');
    logEvent('Verify user identity', { from: 'passport' });
  }, []);

  const handleNavigation = () => {
    navigation.navigate('WalletStatusScreen', {});
  };

  const submitKyc = () => {
    verifyKyc({
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
          isLocal: true
        }
      }
    });

    handleNavigation();
  };

  return (
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
                State
              </Title>
            </LabelContainer>
            <TextInput
              value={addressState}
              onChangeText={(addressState: string) =>
                setBillingDetails({ ...billingDetails, addressState })
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
              onChangeText={(addressCountryCode: string) =>
                setBillingDetails({ ...billingDetails, addressCountryCode })
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
          onPress={submitKyc}
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
  );
}
