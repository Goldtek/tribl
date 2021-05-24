import React, { useState, useRef, useEffect } from 'react';
import { Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Image, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import GradientButton from '../../../components/gradientButton';
import DropDownPicker from 'react-native-dropdown-picker';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { Container, Cover, LogoCover, CashCover } from './styles';
import { DONATE_BY_WALLET } from '../../../graphql/server/mutations';
import { Toast } from '../../../components/rootToaster';
import { GET_FUNDING_SOURCES } from '../../../graphql/server/query';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DonateScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const { params } = props.route;
  const { balance, amount, id } = params;
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const myFundingSources = props?.route?.params?.myFundingSources;
  let labels = [];


  if(myFundingSources){
    console.tron('card', myFundingSources.data);
    const dataItems = [{ type: 'WALLET', id: balance }, ...myFundingSources.data]
    for(let source of dataItems) {
      labels.push({label: `${source.type}` , value: `${source.type},${source.id}`});
    }
  }

  
  const [number, setNumber] = useState(amount);
  const inputRef = useRef<TextInput>(null);

  const [SendMoneyByWallet, { data: response }] = useMutation(DONATE_BY_WALLET);

  

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

const process = () => {
  const input = value.split(",");
  if(input[0] === ''){
    return Toast.show("Please select the source to send money from.");
  } else if(input[0] === 'WALLET') {
    
    if(number > input[1]){ 
      return Toast.show("Your wallet balance is less than the amount you want to send.");
    }
 
    SendMoneyByWallet({ variables: { payload:  { amount:number, walletId: id, fiat: {
      verification:'none',
      description: "",
          source: {  asset: 'USD', category: 'WALLET' }
        },
        type: 'TRIBE_DONATE',
        origin: 'TRIBE' 
      }
    }});
    Toast.show("Your transaction is processing");

  } else if(input[0] === 'CARD') {
    SendMoneyByWallet({ variables: { payload:  { amount: number, walletId: id, fiat: {
      verification:'none',
      description: "",
          source: {  asset: 'USD', category: 'WALLET' }
        },
        type: 'TRIBE_DONATE',
        origin: 'TRIBE' 
      }
    }});

  } else if(input[0] === 'BANK') {
    
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
            {'\u0024'}{amount}
          </Title>
          <TextInput
            ref={inputRef}
            onBlur={() => Keyboard.dismiss()}
            onChangeText={(number) => setNumber(number)}
            value={number}
           // placeholder={cost}
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
            items={labels}
            setOpen={setOpen}
            setValue={setValue}
             setItems={setItems}
          />
        </Cover>
      </Cover>

      <GradientButton
        onPress={() =>process()}
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
        {loading ? (<ActivityIndicator size="small" color="white" />) : null}
         {t(`community.tabPanel.donate`)}
      </GradientButton>
    </Container>
  );
}
