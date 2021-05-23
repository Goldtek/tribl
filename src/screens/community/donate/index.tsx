import React, { useState, useRef, useEffect } from 'react';
import { Title, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Image, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import GradientButton from '../../../components/gradientButton';
import DropDownPicker from 'react-native-dropdown-picker';
import { useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { Container, Cover, LogoCover, CashCover } from './styles';
import { SEND_MONEY } from '../../../graphql/server/mutations';
import { Toast } from '../../../components/rootToaster';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function DonateScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const { params } = props.route;
  const { balance, amount } = params;
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([
    {label: `Wallet Balance - ${balance !== undefined ? balance : 0}`, value: balance !== undefined ? balance : 0},
  ]);
  
  const [number, setNumber] = useState('');
  const inputRef = useRef<TextInput>(null);

  const [SendMoney, { data: response }] = useMutation(SEND_MONEY);


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

const process = () => {
  // if(value === 0){
  //   return Toast.show("Please select the source to send money from.");
  // } else if(amount > value){ // check if it is wallet that is selected
  //   return Toast.show("Your wallet balance is less than the amount you want to send.");
  // }
  setLoading(true);
  SendMoney({ variables: { payload:  { amount:"111", walletId:"1" }}});
  setLoading(false);
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
            items={items}
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
