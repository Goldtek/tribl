import React, { useState, useRef, useEffect } from 'react';
import { Title, ActivityIndicator } from 'react-native-paper';
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
import { GET_PORTFOLIO , GET_MARKET, GET_FUNDING_SOURCES} from '../../../graphql/server/query';
import { Toast } from '../../../components/rootToaster';

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
  const inputRef = useRef<TextInput>(null);
  const charmap: any = {};
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

  const [buyOrSellCoin, { data: buyResponse, loading, error, onCompleted }] = useMutation(BUY_CRYPTO);

  const { data: funding_sources, refetch: refetchFundingSource } = useQuery(GET_FUNDING_SOURCES, {
    variables: { input: {} }
  });

  const { myFundingSources } = funding_sources;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const handleTrade = () => {
   
    if(value === 0){
      Toast.show("Please select a source of funding to perform your transaction");
    } else if(Number(value) < Number(cost) && action === 'Buy'){
      Toast.show(`You have insufficient funds to purchase $${cost} of ${title}`);
    } else {
      buyOrSellCoin({variables: {
        payload: {
          amount: cost,
          asset: `${short_symbol}`,
          crypto: { market: `${symbol}`, side: `${action.toUpperCase()}`, price: action === 'Buy' ? charmap[symbol].best_ask.price : charmap[symbol].best_bid.price}
        }
      }});
     if(error){
       //Toast.show(`${error}`);
       console.log('error', error);
     }
      refetch();
      if(onCompleted){
        Toast.show(`You have successfully purchased ${title} of $${cost}`);
      }
    }
 
  }


  return (
    <Container>
      <Cover>
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
            onChangeText={(number) => setCost(number)}
            value={cost}
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
        {loading ? (<ActivityIndicator animating={true} color={colors.WHITE} size="small" />) : null}
       {"  "} {action}
      </GradientButton>
    </Container>
  );
}
