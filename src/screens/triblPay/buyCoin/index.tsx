import React, { useState, useRef, useEffect } from 'react';
import {
  Image,
  TextInput,
  Keyboard,
  Modal,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useTranslation } from 'react-i18next';
import OpenPGP from 'react-native-fast-openpgp';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import View from 'react-native-simple-shadow-view';
import DropDownPicker from 'react-native-dropdown-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Title,
  Text,
  Button,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {
  GET_CARD_PCI_OUTPUT,
  GET_FUNDING_SOURCES,
  GET_PORTFOLIO,
  GET_MARKET
} from '../../../graphql/server/query';
import {
  BUY_CRYPTO_BANK,
  BUY_CRYPTO_WALLET,
  BUY_CRYPTO_CARD
} from '../../../graphql/server/mutations';
import { Base64 } from '../../../utils/base64';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { crashlytics } from '../../../firebase/config';
import GradientButton from '../../../components/gradientButton';
import { DEVICE_FULL_HEIGHT, DEVICE_FULL_WIDTH } from '../../../utils/device';

import {
  Container,
  Cover,
  LogoCover,
  CashCover,
  Overlay,
  ModalContentWrapper,
  LoaderMessage
} from './styles';
import { truncateString } from '../../../utils/truncate';
import { Toast } from '../../../components/rootToaster';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function AddCashScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  const { data: userFundingSources } = useQuery(GET_FUNDING_SOURCES, {
    variables: { input: {} }
  });

  const { data: cardPci } = useQuery(GET_CARD_PCI_OUTPUT);
  const balance = props?.route?.params?.balance;
  const amount = props?.route?.params?.amount;
  const action = props?.route?.params?.action;
  const symbol = props?.route?.params?.symbol;
 
  const charmap: any = {};
  const { data: fetched_markets } = useQuery(GET_MARKET);
  const fetchMarket = fetched_markets?.fetchMarket;
  const markets = fetchMarket?.markets

  if(markets){
    for(let item of markets){
      if(item.market === symbol){
        charmap[symbol] ={
          best_bid: item.best_bid,
          best_ask: item.best_ask
        }
      }
    }
  }

const [buyWithWallet, { loading: walletLoading, error: walletError }] = useMutation(BUY_CRYPTO_WALLET);
const [buyWithCard,  { loading: cardLoading }] = useMutation(BUY_CRYPTO_CARD);
const [buyWithBank,  { loading: bankLoading }] = useMutation(BUY_CRYPTO_BANK);


  const { myFundingSources } = userFundingSources;

  const [number, setNumber] = useState<any>(amount);
  const [open, setOpen] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [bankModalState, setBankModalState] = useState(false);
  const [cardCvc, setCardCvc] = useState<any>(null);
  const [fundingSource, setFundingSource] = useState<any>({});
  const short_symbol =  symbol === 'ETHUSD' ?  'ETH' : symbol === 'PAXGUSD' ? 'USD' : 'BTC';
  const inputRef = useRef<TextInput>(null);
  const modalInputRef = useRef<TextInput>(null);

  const [value, setValue] = useState<any>();
  const [items, setItems] = useState<any>();

  useEffect(() => {
    if (myFundingSources.data) {
      setItems([
        ...myFundingSources.data
          .filter((item: any) => item.card)
          .map((x: any) => {
            return {
              label: `**** **** **** ${x.card.last4}`,
              value: x.id,
              icon: () => (
                <FontAwesome
                  name="credit-card"
                  size={22}
                  color={colors.PRIMARY_TEXT}
                />
              )
            };
          }),
        ...myFundingSources.data
          .filter((item: any) => item.bank)
          .map((x: any) => {
            return {
              label: `${x.bank.name} - ${truncateString(
                x.bank.accountNumber,
                4
              )}`,
              value: x.id,
              icon: () => (
                <FontAwesome
                  name="bank"
                  size={22}
                  color={colors.PRIMARY_TEXT}
                />
              )
            };
          }),
          {
            label: `WALLET - ${truncateString(
               `$${balance}`,
            )}`,
            value: 'WALLET',
            icon: () => (
              <AntDesign
                name="wallet"
                size={22}
                color={colors.PRIMARY_TEXT}
              />
            )
          }

      ]);

      myFundingSources.data[0].type === 'BANK'
        ? setValue(myFundingSources.data[0]?.id)
        : setValue(myFundingSources.data[0]?.id);
    }
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setFundingSource(
      [
        ...myFundingSources.data
          .filter((item: any) => item.bank)
          .map((x: any) => {
            return {
              id: x.id,
              type: 'BANK_TRANSFER',
              verification: 'none',
              name: x.bank.name,
              accountNumber: x.bank.accountNumber,
              paymentInstruction: {
                id: x.bank.paymentInstruction.id,
                entityName: x.bank.paymentInstruction.entityName,
                trackingRef: x.bank.paymentInstruction.trackingRef,
                beneficiaryName: x.bank.paymentInstruction.beneficiaryName,
                beneficiaryAddress1:
                  x.bank.paymentInstruction.beneficiaryAddress1,
                beneficiaryAddress2:
                  x.bank.paymentInstruction.beneficiaryAddress2,
                beneficiaryBankName:
                  x.bank.paymentInstruction.beneficiaryBankName,
                beneficiaryBankAddress:
                  x.bank.paymentInstruction.beneficiaryBankAddress,
                beneficiaryBankPostalCode:
                  x.bank.paymentInstruction.beneficiaryBankPostalCode,
                beneficiaryBankSwiftCode:
                  x.bank.paymentInstruction.beneficiaryBankSwiftCode,
                beneficiaryBankCountry:
                  x.bank.paymentInstruction.beneficiaryBankCountry,
                beneficiaryBankCity:
                  x.bank.paymentInstruction.beneficiaryBankCity,
                beneficiaryBankAccountNumber:
                  x.bank.paymentInstruction.beneficiaryBankAccountNumber,
                beneficiaryBankRoutingNumber:
                  x.bank.paymentInstruction.beneficiaryBankRoutingNumber
              }
            };
          }),
        ...myFundingSources.data
          .filter((item: any) => item.card)
          .map((x: any) => {
            return {
              id: x.id,
              type: x.type,
              verification: 'cvv',
              last4: x.card.last4
            };
          })
      ].filter((item: any) => item.id === value)[0]
    );
    inputRef.current?.focus();
  }, [value]);

  const handleAction = () => {
    if (number < 20) {
      return Alert.alert(
        'Add Amount',
        `please add an amount before you proceed`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: 'Add',
            onPress: () => inputRef.current?.focus()
          }
        ]
      );
    }
    if(fundingSource){
      fundingSource.type === 'CARD'
        ? setModalState(!modalState)
        : handleTransaction();
    }
    if(value){
      if(value === 'WALLET'){
        if(number > balance){
          return Toast.show("The amount you want to purchase coin is higher than the amount in your wallet.");
        }
        buyWithWallet(
          {variables: {
            payload: {
              amount: String(number),
              asset: `${short_symbol}`,
              crypto: { market: `${symbol}`, side: `${action.toUpperCase()}`, price: charmap[symbol].best_ask.price}
            }
          }});
          navigation.navigate('TransactionHistoryScreen');
      }
    }
    
  };

  const handleTransaction = async () => {
    
      const { key, keyId } = await cardPci.getCardPciKey;
      const options = {
        cvv: cardCvc
      };
    const encrypted = await OpenPGP.encrypt(
      JSON.stringify(options),
      Base64.atob(`${key}`)
    );

    try {
      const { data } =
        fundingSource.type === 'CARD'
          ? await buyWithCard({
              variables: {
                payload: {
                  amount: String(number),
                  asset: `${short_symbol}`,
                  fiat: {
                    verification: 'cvv',
                    description: '',
                    encryptedData: Base64.btoa(encrypted),
                    keyId,
                    source: {
                      asset: 'USD',
                      category: fundingSource?.type,
                      id: fundingSource?.id
                    }
                  },
                  crypto: { 
                    market: `${symbol}`, 
                    side: `${action.toUpperCase()}`,
                    price: charmap[symbol].best_ask.price
                  }
                }
              }
            })
          :  fundingSource.type === 'BANK_TRANSFER' ?
           await buyWithBank({
              variables: {
                payload: {
                  amount: String(number),
                  asset: 'USD',
                  fiat: {
                    verification: fundingSource.verification,
                    description: '',
                    source: {
                      asset: 'USD',
                      category: fundingSource?.type,
                      id: fundingSource?.id
                    }
                  },
                  crypto: { 
                    market: `${symbol}`, 
                    side: `${action.toUpperCase()}`,
                    price:  charmap[symbol].best_ask.price
                  }
                }
              }
            }) 
            :null;
            // navigation.navigate('TriblPayScreen', { screen: 'TransactionHistoryScreen' })
      data && fundingSource.type === 'CARD' || value === 'WALLET'
        ? navigation.navigate('TransactionHistoryScreen')
        : setBankModalState(!bankModalState);
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  return (
    <Container onPress={() => Keyboard.dismiss()}>
      <Cover>
        <LogoCover>
          <Image
            source={require('../../../../assets/images/logo.png')}
            style={{
              resizeMode: 'contain',
              width: RFValue(40),
              height: RFValue(40)
            }}
          />
          <Text
            style={{
              color: colors.PRIMARY,
              fontSize: RFValue(fonts.LARGE_SIZE + 7),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.pay`)}
          </Text>
        </LogoCover>
        <CashCover>
          <Title
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.LARGE_SIZE * 3),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(50)
            }}
          >
            {'\u0024'}
          </Title>
          <TextInput
            ref={inputRef}
            onChangeText={(number) => setNumber(number)}
            value={number}
            placeholder={`${number}`}
            keyboardType="numeric"
            returnKeyType="done"
            placeholderTextColor={colors.BLACK}
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.LARGE_SIZE * 3),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(55),
              minWidth: RFValue(50),
              textAlign: 'center'
            }}
          />
        </CashCover>

        <DropDownPicker
          containerStyle={{ marginTop: 50 }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
      </Cover>
      {fundingSource && (
        <GradientButton
          onPress={handleAction}
          style={{
            height: 50
          }}
          gradientContainerstyle={{
            height: 50,
            marginBottom: RFValue(30),
            backgroundColor: colors.WHITE
          }}
          contentStyle={{
            height: 50
          }}
        >
          {fundingSource.type === 'BANK_TRANSFER' ? 'Submit' : 'Next'}
        </GradientButton>
      )}
      {value === 'WALLET' && (
        <GradientButton
          onPress={handleAction}
          style={{
            height: 50
          }}
          gradientContainerstyle={{
            height: 50,
            marginBottom: RFValue(30),
            backgroundColor: colors.WHITE
          }}
          contentStyle={{
            height: 50
          }}
        >
          Submit
        </GradientButton>
      )}

      {fundingSource && fundingSource.type === 'CARD' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalState}
          onRequestClose={() => setModalState(!modalState)}
        >
          <Overlay activeOpacity={1} onPress={() => setModalState(!modalState)}>
            <KeyboardAwareScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              keyboardShouldPersistTaps={'always'}
              enableOnAndroid={true}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: DEVICE_FULL_HEIGHT / 2.5,
                  marginBottom: 100
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.WHITE,
                    borderRadius: 10,
                    padding: 20,
                    width: DEVICE_FULL_WIDTH * 0.9,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                  }}
                >
                  <FontAwesome
                    name="credit-card"
                    size={60}
                    color={colors.PRIMARY}
                  />
                  <Title>Please Confirm CVV/CVC</Title>

                  <Text>{`**** **** **** ${fundingSource.last4}`}</Text>

                  <View>
                    <TextInput
                      ref={modalInputRef}
                      autoFocus={true}
                      onChangeText={(number) => setCardCvc(number)}
                      value={cardCvc}
                      placeholder="xxx"
                      keyboardType="numeric"
                      placeholderTextColor={colors.INACTIVE}
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.LARGE_SIZE + 10),
                        fontFamily: fonts.WORK_SANS_BOLD,
                        marginTop: 10,
                        lineHeight: RFValue(30)
                      }}
                    />
                  </View>
                  <Button
                    onPress={() => handleTransaction()}
                    style={{ marginTop: 20 }}
                    labelStyle={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                      color: colors.PRIMARY,
                      textTransform: 'uppercase'
                    }}
                    contentStyle={{ justifyContent: 'flex-start' }}
                  >
                    Done
                  </Button>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </Overlay>
        </Modal>
      )}

      {fundingSource && fundingSource.type === 'BANK_TRANSFER' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={bankModalState}
          onRequestClose={() => setBankModalState(!bankModalState)}
        >
          <Overlay activeOpacity={1}>
            <KeyboardAwareScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              keyboardShouldPersistTaps={'always'}
              enableOnAndroid={true}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: DEVICE_FULL_HEIGHT / 3.5,
                  marginBottom: 100
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.WHITE,
                    borderRadius: 10,
                    padding: 10,
                    paddingTop: 30,
                    width: DEVICE_FULL_WIDTH * 0.9,
                    // alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5
                  }}
                >
                  <TouchableOpacity
                    onPress={() => { 
                      setBankModalState(!bankModalState)
                      navigation.navigate('TransactionHistoryScreen')
                    }}
                    style={{ position: 'absolute', right: 5, top: 5 }}
                  >
                    <AntDesign name="close" size={30} />
                  </TouchableOpacity>
                  <Title
                    style={{
                      color: colors.PRIMARY,
                      fontFamily: fonts.WORK_SANS_BOLD
                    }}
                  >
                    Bank Payment Instruction
                  </Title>
                  <Title
                    style={{
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 3),
                      fontFamily: fonts.WORK_SANS_REGULAR
                      // textTransform: 'capitalize'
                    }}
                  >
                    Kindly make transaction with the following bank
                    information...
                  </Title>

                  <Divider />
                  <Divider />
                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_BOLD,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      Bank Name:
                    </Text>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_MEDIUM,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      {fundingSource.paymentInstruction.beneficiaryBankName}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_BOLD,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      Swift Code:
                    </Text>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_MEDIUM,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      {
                        fundingSource.paymentInstruction
                          .beneficiaryBankSwiftCode
                      }
                    </Text>
                  </View>

                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_BOLD,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      ACCOUNT NUMBER:
                    </Text>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_MEDIUM,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      {
                        fundingSource.paymentInstruction
                          ?.beneficiaryBankAccountNumber
                      }
                    </Text>
                  </View>

                  <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_BOLD,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      BENEFICIARY NAME:
                    </Text>
                    <Text
                      style={{
                        color: colors.BLACK,
                        fontSize: RFValue(fonts.MEDIUM_SIZE),
                        fontFamily: fonts.WORK_SANS_MEDIUM,
                        marginTop: 10,
                        lineHeight: RFValue(30),
                        textTransform: 'capitalize'
                      }}
                    >
                      {' '}
                      {fundingSource.paymentInstruction?.beneficiaryName}
                    </Text>
                  </View>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </Overlay>
        </Modal>
      )}

      <Modal
        animationType="fade"
        visible={bankLoading || cardLoading || walletLoading}
        transparent
      >
        <Overlay>
          <ModalContentWrapper>
            <ActivityIndicator size="small" color={colors.BLACK} />
            <LoaderMessage>processing...</LoaderMessage>
          </ModalContentWrapper>
        </Overlay>
      </Modal>
    </Container>
  );
}
