import React, { useState } from 'react';
import { Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../../../../../theme';
import { Container, LeftCover, Row, Icon, ButtonContainer } from './styles';
import { RightCover } from '../../../../inbox/groupInformation/styles';

// @ts-ignore
import bitcoin from "../../../../../../assets/images/bitcoin.png";
// @ts-ignore
 import etherum from "../../../../../../assets/images/etherum.jpeg";
 // @ts-ignore
import tribl from "../../../../../../assets/images/tribl.png";

interface ItemProps {
 item: Market;
 refetch: () => void;
}

interface Market {
  today: DayTrade;
  last_day: DayTrade;
  market: string
  best_bid?: Rate;
  best_ask?: Rate;
}

interface DayTrade {
  open?: number;
  high: number;
  low?: number;
  price?: number;
  volume?: number;
}

interface Rate {
  amount?: number;
  price: number;
}

export default function Item(props: ItemProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    item,
    refetch
  } = props;
  const { colors, fonts } = useThemeContext();


  const calculatePercentagePrice = (market: Market) => {
    const today = market.today;
    const last_day = market.last_day;
    const today_high: number = today.high !== null ? today.high : 0;
    const last_day_high: number = last_day.high !== null ? last_day.high : 0;
    const percentage: number = ((today_high - last_day_high) / (today_high + last_day_high) || 1) * 100;
    return percentage.toFixed(2) != 'NaN' ? percentage.toFixed(2) : 0;
  }
  const percent = Number(calculatePercentagePrice(item));
  const direction = percent < 0 ? 'down' : 'up';
  const avatar = item.market === 'ETHUSD' ?  etherum : item.market === 'PAXGUSD' ? tribl : item.market === 'BTCUSD' ? bitcoin : '';
  const name =  item.market === 'ETHUSD' ?  t(`community.currency.etherum`) : item.market === 'PAXGUSD' ? t(`community.currency.tribl`) : item.market === 'BTCUSD' ?  t(`community.currency.bitcoin`) : '';

  const handleNavigation = () => {
    navigation.navigate('BuyCryptoScreen', {
        title: name,
        avatar,
        value: percent,
        data: item,
        symbol: item.market,
        refetch,
    });
  };
  
  return (
    <Container>
      <ButtonContainer onPress={handleNavigation}>
      <Row>
          <LeftCover>
           <Icon source={avatar} /> 
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.SMALL_SIZE + 3),
                color: colors.BLACK
              }}
            >
            {name}
            </Text>
          </LeftCover>

          <RightCover>
            <MaterialCommunityIcons
                 name={`arrow-${direction}`}
                size={20}
                color={direction === 'up' ? colors.GREEN : colors.RED} 
              />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_MEDIUM,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: direction === 'up' ? colors.GREEN : colors.RED 
              }}
            >
              {percent}%
            </Text>

            <MaterialCommunityIcons
              name="chevron-right"
              size={30}
              color={colors.BLACK}
            />
          </RightCover> 
        
      </Row>
      </ButtonContainer>

          
    </Container>
  );
}
