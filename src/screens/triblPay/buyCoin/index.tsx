import React, { useState, useRef, useEffect } from 'react';
import { Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Image, TextInput, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { BUY_CRYPTO } from '../../../graphql/server/mutations';
import GradientButton from '../../../components/gradientButton';
import DropDownPicker from 'react-native-dropdown-picker';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { Container, Cover, LogoCover, CashCover } from './styles';
import { GET_PORTFOLIO , GET_MARKET} from '../../../graphql/server/query';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function BuyCoinScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const { params } = props.route;
  const { title, avatar, refetch, symbol, action, amount, balance } = params;
  const [cost, setCost] = useState(String(amount));
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: `Wallet Balance - ${balance}`, value: balance},
  ]);
  const short_symbol =  symbol === 'ETHUSD' ?  'ETH' : symbol === 'PAXGUSD' ? 'USD' : 'BTC';
  const [number, setNumber] = useState('');
  const inputRef = useRef<TextInput>(null);
  const charmap = {};
  const { data: fetched_markets } = useQuery(GET_MARKET);
  const fetchMarket = fetched_markets?.fetchMarket;
  const markets = fetchMarket?.markets;

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

  const [buyOrSellCoin, { data: buyResponse }] = useMutation(BUY_CRYPTO, {
    variables: {
      payload: {
        amount: amount,
        asset: `${short_symbol}`,
        crypto: { market: `${symbol}`, side: `${action.toUpperCase()}`, price: action === 'Buy' ? charmap[symbol].best_ask.price : charmap[symbol].best_bid.price}
      }
    }
  });


  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const handleTrade = () => {
    if(value < amount){

    } else {
      buyOrSellCoin();
    }
  }


  return (
    <Container>
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
              textTransform: 'uppercase'
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
            onBlur={() => Keyboard.dismiss()}
            onChangeText={(number) => setNumber(number)}
            value={number}
            placeholder={cost}
            keyboardType="numeric"
            placeholderTextColor={colors.BLACK}
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.LARGE_SIZE * 3),
              fontFamily: fonts.WORK_SANS_BOLD,
              lineHeight: RFValue(50)
            }}
          />
        </CashCover>
        <Cover>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
  
          />
        </Cover>
      </Cover>

      <GradientButton
        onPress={() =>handleTrade()}
        style={{
          height: 50
        }}
        gradientContainerstyle={{
          height: 50,
          marginBottom: RFValue(30)
        }}
        contentStyle={{
          height: 50
        }}
      >
      {action}
      </GradientButton>
    </Container>
  );
}
