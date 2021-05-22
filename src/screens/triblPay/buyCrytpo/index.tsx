import React, { useState, useRef, useEffect } from 'react';
import { Text } from 'react-native-paper';
import { Dimensions } from "react-native";
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { LineChart } from "react-native-chart-kit";
import ActionSheet from 'react-native-actionsheet';
import { useMutation, useQuery } from '@apollo/react-hooks';
import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import {
  Container,
  Cover,
  Icon
} from './styles';
import { chartConfig } from "../../../utils/chart";
import {GET_PORTFOLIO} from '../../../graphql/server/query';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

const { width } = Dimensions.get("window");

export default function BuyCryptoScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const { params } = props.route;
  const { title, avatar, value, refetch, symbol } = params;
  const [index, setIndex] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isset, setIsset] = useState(false);
  const actionRef = useRef<ActionSheet>(null);
  const charMap = {};
  const data = {
    labels: ["24H", "1W", "1M", "3M", "6M", "1Y", "ALL"],
    datasets: [
      {
        data: [20, 45, 50, 80, 100, 500],
        color: (opacity = 1) => `rgba(0, 108, 255, ${opacity})`, 
        strokeWidth: 2 
      }
    ],
  };
 
  const { data: requestData } = useQuery(GET_PORTFOLIO);
  const portfolio = requestData?.fetchPortfolio;
  
  useEffect(()=>{
    if(isset){
      actionRef.current.show();
    }
  },[isset]);

  const Trade = async ()=> {
    setAmount(0);
    setIsset(true);
  }

  
  if(portfolio){
    for(let item of portfolio.items){
      if(item.asset === 'USD'){
        charMap['USD'] = {
          available: item.available
        }
      }
    }
  }


  const handleTradeSelection =async (i: number) => {
    if(isset){
      setIsset(false);
    }
    navigation.navigate("BuyCoinScreen", 
    {
      title,
      avatar, 
      symbol,
      refetch, 
      amount,
      balance: Math.ceil(charMap['USD'].available),
      action: i == 0 ? 'Buy' : 'Sell',
    });
  }


  return (
    <Container>
      <Cover>
        <Text
          style={{
            color: colors.BLACK,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            fontFamily: fonts.WORK_SANS_BOLD,
            lineHeight: RFValue(25),
            textAlign: 'center',
            marginTop: RFValue(-30),
          }}
        >
          {title} Coin
        </Text>     
      </Cover>

      <Cover>
      <Text
        style={{
          color: colors.BLACK,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          fontFamily: fonts.WORK_SANS_BOLD,
          lineHeight: RFValue(25),
          textAlign: 'center',
          textTransform: 'capitalize',
          marginTop: RFValue(-20),
        }}
          >
          $0.0001
        </Text>
      </Cover>

      <Cover>
      <Text
            style={{
              color: colors.CONTENT_COLOR,
              fontSize: RFValue(fonts.SMALL_SIZE + 2),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(25),
              textAlign: 'center',
              textTransform: 'capitalize',
              marginTop: RFValue(-16),
            }}
          >
          {value}% Past 24 hours
        </Text>
      </Cover>

      {/* <BorderLine /> */}

      <Cover>
      <LineChart
        data={data}
        width={width}
        height={220}
        chartConfig={chartConfig}
      />
      </Cover>

    
      <Cover>
        <GradientButton
        gradientContainerstyle={{
          height: 40,
          width: '100%',
          borderRadius: 15,
          margin: 0.1,
        }}
        bgColor={colors.bandColor}
        onPress={Trade}
        > 
          Trade
        </GradientButton>
      </Cover>


      <Cover>
        <GradientButton
          gradientContainerstyle={{
            height: 40,
            borderRadius: 5,
            borderColor: index === 1 ? colors.WHITE : colors.primary,
            borderWidth: 2,
            borderStyle: "solid"
          }}
          
          bgColor={index === 1 ? colors.primary : colors.WHITE}
          color={ index === 1 ? colors.WHITE : colors.primary}
          mode="outlined"
          onPress={()=> { 
            setIndex(1);
            setAmount(20);
            setIsset(true);
          }}
        > 
          $20
        </GradientButton>

        <GradientButton
          gradientContainerstyle={{
            height: 40,
            borderRadius: 5,
            borderColor: index === 2 ? colors.WHITE : colors.primary,
            borderWidth: 2,
            borderStyle: "solid"
          }}
          
          bgColor={index === 2 ? colors.primary : colors.WHITE}
          color={ index === 2 ? colors.WHITE : colors.primary}
          mode="outlined"
          onPress={()=> {
            setIndex(2)
            setAmount(50);
            setIsset(true);
          }}
        > 
          $50
        </GradientButton>

        <GradientButton
          gradientContainerstyle={{
            height: 40,
            borderRadius: 5,
            borderColor: index === 3 ? colors.WHITE : colors.primary,
            borderWidth: 2,
            borderStyle: "solid"
          }}
        
          bgColor={index === 3 ? colors.primary : colors.WHITE}
          color={ index === 3 ? colors.WHITE : colors.primary}
          mode="outlined"
          onPress={()=> { 
            setIndex(3)
            setAmount(100);
            setIsset(true);
          }}
        > 
          $100
        </GradientButton>

        <GradientButton
          gradientContainerstyle={{
            height: 40,
            borderRadius: 5,
            borderColor: index === 4 ? colors.WHITE : colors.primary,
            borderWidth: 2,
            borderStyle: "solid"
          }}
          bgColor={index === 4 ? colors.primary : colors.WHITE}
          color={ index === 4 ? colors.WHITE : colors.primary}
          mode="outlined"
          onPress={()=> {
            setIndex(4);
            setAmount(500);
            setIsset(true);
          }}
        > 
          $500
        </GradientButton>
      </Cover>

      <Cover>
          <Icon source={avatar} />
      </Cover>

      <Cover>
        <Text
          style={{
            color: colors.BLACK,
            fontSize: RFValue(fonts.LARGE_SIZE + 2),
            fontFamily: fonts.WORK_SANS_BOLD,
            fontWeight: "bold",
            textAlign: 'center',
            textTransform: 'capitalize',
            marginBottom: RFValue(-5),
          }}
        >
          About {title} Coin
        </Text> 
      </Cover>

      <Cover>
        <Text
          style={{
            color: colors.BLACK,
            fontSize: RFValue(fonts.SMALL_SIZE + 5),
            fontFamily: fonts.WORK_SANS_REGULAR,
            textAlign: 'left',
            textTransform: 'capitalize',
            marginTop: RFValue(0),
          }}
        >
          Write up about {title}
        </Text>
      </Cover>

      <ActionSheet
          ref={actionRef}
          options={['Buy', 'Sell', 'cancel']}
          cancelButtonIndex={2}
         // destructiveButtonIndex={1}
          onPress={handleTradeSelection}
        />
    </Container>
  );
}


