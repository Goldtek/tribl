import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import Screens from '../../screens/triblPay';
import { useThemeContext } from '../../theme';
import { NavigationInterface } from '../../screens/types';
import { GLOBAL_HEADER_STYLE } from '../../constants';

import { HeaderRightCover } from './style';

const TriblpayStack = createStackNavigator();

interface TriblPayNavigatorProps extends NavigationInterface {}

export default function TriblPayNavigator(props: TriblPayNavigatorProps) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  return (
    <TriblpayStack.Navigator
      headerMode="screen"
      screenOptions={{
        headerStyle: { height: RFValue(90), ...GLOBAL_HEADER_STYLE }
      }}
    >
      <TriblpayStack.Screen
        name="ActivateWalletScreen"
        component={Screens.ActivateWalletScreen}
        options={{
          headerTitle: () => null,
          headerRight: () => (
            <HeaderRightCover>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(30),
                  height: RFValue(30)
                }}
              />
              <Text
                style={{
                  color: colors.PRIMARY,
                  fontSize: RFValue(fonts.LARGE_SIZE + 2),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.passport.pay`)}
              </Text>
            </HeaderRightCover>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            textTransform: 'capitalize',
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD
          }
        }}
      />
      <TriblpayStack.Screen
        name="BankCountryScreen"
        component={Screens.BankCountryScreen}
        options={{
          headerTitle: `1 of 6 ${t(`community.passport.steps`)}`,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.SECONDARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            fontFamily: fonts.WORK_SANS_REGULAR
          }
        }}
      />

      <TriblpayStack.Screen
        name="VerifyIdentityScreen"
        component={Screens.VerifyIdentityScreen}
        options={{
          headerTitle: `2 of 6 ${t(`community.passport.steps`)}`,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.SECONDARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            fontFamily: fonts.WORK_SANS_REGULAR
          }
        }}
      />

      <TriblpayStack.Screen
        name="SelfieScreen"
        component={Screens.SelfieScreen}
        options={{
          headerTitle: `3 of 6 ${t(`community.passport.steps`)}`,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.SECONDARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            fontFamily: fonts.WORK_SANS_REGULAR
          }
        }}
      />

      <TriblpayStack.Screen
        name="DocumentTypeSelectionScreen"
        component={Screens.DocumentTypeSelectionScreen}
        options={{
          headerTitle: `4 of 6 ${t(`community.passport.steps`)}`,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.SECONDARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            fontFamily: fonts.WORK_SANS_REGULAR
          }
        }}
      />

      <TriblpayStack.Screen
        name="CountryIdScreen"
        component={Screens.CountryIdScreen}
        options={{
          headerTitle: `5 of 6 ${t(`community.passport.steps`)}`,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.SECONDARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            fontFamily: fonts.WORK_SANS_REGULAR
          }
        }}
      />

      <TriblpayStack.Screen
        name="BillingDetailsScreen"
        component={Screens.BillingDetailsScreen}
        options={{
          headerTitle: `6 of 6 ${t(`community.passport.steps`)}`,
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.SECONDARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            fontFamily: fonts.WORK_SANS_REGULAR
          }
        }}
      />

      <TriblpayStack.Screen
        name="FailedWalletStatusScreen"
        component={Screens.WalletStatusScreen.Failed}
        options={{
          headerShown: false
        }}
      />

      <TriblpayStack.Screen
        name="PendingWalletStatusScreen"
        component={Screens.WalletStatusScreen.Pending}
        options={{
          headerShown: false
        }}
      />

      <TriblpayStack.Screen
        name="LinkAccountScreen"
        component={Screens.LinkAccountScreen}
        options={{
          headerTitle: t(`community.passport.linkedAccounts`),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />

      <TriblpayStack.Screen
        name="CreditCardScreen"
        component={Screens.CreditCardScreen}
        options={{
          headerTitle: 'Link Credit Card',
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />

      <TriblpayStack.Screen
        name="BankAccountScreen"
        component={Screens.BankAccountScreen}
        options={{
          headerTitle: 'Link Bank Account',
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />

      <TriblpayStack.Screen
        name="BankBillingDetailsScreen"
        component={Screens.BankBillingDetailsScreen}
        options={{
          headerTitle: 'Link Bank Account',
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />

      <TriblpayStack.Screen
        name="TransactionHistoryScreen"
        component={Screens.TransactionHistoryScreen}
        options={{
          headerTitle: t(`community.passport.transactionHistory`),
          headerLeftContainerStyle: { marginLeft: 15 },
          headerTitleAlign: 'left',
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE * 2),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD
          }
        }}
      />
      <TriblpayStack.Screen
        name="WalletPreviewScreen"
        component={Screens.WalletPreviewScreen}
        options={{
          headerTitle: 'Wallet',
          headerLeftContainerStyle: { marginLeft: 15 },
          headerTitleAlign: 'left',
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE * 2),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD
          }
        }}
      />

      <TriblpayStack.Screen
        name="WalletScreen"
        component={Screens.WalletScreen}
        options={{
          headerTitle: () => null,
          headerRight: () => (
            <HeaderRightCover>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(30),
                  height: RFValue(30)
                }}
              />
              <Text
                style={{
                  color: colors.PRIMARY,
                  fontSize: RFValue(fonts.LARGE_SIZE + 2),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.passport.pay`)}
              </Text>
            </HeaderRightCover>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            textTransform: 'capitalize',
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD
          }
        }}
      />
      <TriblpayStack.Screen
        name="CryptoTransactionHistoryScreen"
        component={Screens.CryptoTransactionHistoryScreen}
        options={{
          headerTitle: () => null,
          headerRight: () => (
            <HeaderRightCover>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(30),
                  height: RFValue(30)
                }}
              />
              <Text
                style={{
                  color: colors.PRIMARY,
                  fontSize: RFValue(fonts.LARGE_SIZE + 2),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.passport.pay`)}
              </Text>
            </HeaderRightCover>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            textTransform: 'capitalize',
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD
          }
        }}
      />
      <TriblpayStack.Screen
        name="AddCashScreen"
        component={Screens.AddCashScreen}
        options={{
          headerTitle: t(`community.passport.addCash`),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />

      <TriblpayStack.Screen
        name="CryptoFaqScreen"
        component={Screens.CryptoFaqScreen}
        options={{
          headerTitle: () => null,
          headerRight: () => (
            <HeaderRightCover>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(30),
                  height: RFValue(30)
                }}
              />
              <Text
                style={{
                  color: colors.PRIMARY,
                  fontSize: RFValue(fonts.LARGE_SIZE + 2),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  textTransform: 'uppercase'
                }}
              >
                {t(`community.passport.pay`)}
              </Text>
            </HeaderRightCover>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />

      <TriblpayStack.Screen
        name="BuyCryptoScreen"
        component={Screens.BuyCryptoScreen}
        options={{
          headerTitle: () => null,
          headerRight: () => (
            <HeaderRightCover>
              <Image
                source={require('../../../assets/images/logo.png')}
                style={{
                  resizeMode: 'contain',
                  width: RFValue(30),
                  height: RFValue(30)
                }}
              />
              <Text
                style={{
                  color: colors.PRIMARY,
                  fontSize: RFValue(fonts.LARGE_SIZE + 2),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  textTransform: 'uppercase'
                }}
              >
                {t(`community.passport.pay`)}
              </Text>
            </HeaderRightCover>
          ),
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />

      <TriblpayStack.Screen
        name="BuyCoinScreen"
        component={Screens.BuyCoinScreen}
        options={{
          headerTitle: 'Buy Coin',
          headerTitleContainerStyle: { alignItems: 'center' },
          headerLeftContainerStyle: { marginLeft: 5 },
          headerRightContainerStyle: {
            marginRight: 10
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.PRIMARY,
          headerTitleStyle: {
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textTransform: 'capitalize'
          }
        }}
      />
    </TriblpayStack.Navigator>
  );
}
