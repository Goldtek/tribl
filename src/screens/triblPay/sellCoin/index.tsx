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
  const refetch = props?.route?.params?.refetch;
 
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

const [sellWithWallet, { loading: walletLoading, error: walletError }] = useMutation(BUY_CRYPTO_WALLET);



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


  const handleAction = async () => {
    if(number > balance){
      return Toast.show("The amount you want to purchase coin is higher than the amount in your wallet.");
    }
    try {
      const { data } =  
      await sellWithWallet(
        {
          variables: {
          payload: {
            amount: String(number),
            asset: `${short_symbol}`,
            crypto: { market: `${symbol}`, side: 'SELL', price: charmap[symbol].best_bid.price}
          }
        }});
        refetch();
        navigation.navigate('TransactionHistoryScreen');
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
      console.tron('error', walletError)
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
      </Cover>
    
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

      <Modal
        animationType="fade"
        visible={walletLoading}
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
