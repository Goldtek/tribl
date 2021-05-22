import React, { useState } from 'react';
import { Title, Text, Divider } from 'react-native-paper';
import { ScrollView, FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@apollo/react-hooks';
import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { GET_PORTFOLIO , GET_MARKET} from '../../../graphql/server/query';
import Portfolio from "./widgets/portfolio";


import {
  Container,
  BalanceCover,
  ButtonCover,
  Cover,
  LeftCover,
  RightCover,
  ListCover
} from './styles';

interface charPortfolio{
  availabble: number;
}

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function WalletScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const filtered_data = [];
  const filtered_markets = []
  const charPortfolio = {};

  const { data: requestData, refetch, error } = useQuery(GET_PORTFOLIO);

  const { data: fetched_markets } = useQuery(GET_MARKET);

  const portfolio = requestData?.fetchPortfolio;

  const fetchMarket = fetched_markets?.fetchMarket;
  const markets = fetchMarket?.markets;

  if(markets){
    for(let item of markets){
      if(item.market === 'BTCUSD' || item.market === 'ETHUSD' || item.market === 'PAXGUSD'){
        filtered_markets.push(item);
      }
    }
  }

  
  if(portfolio){
    for(let item of portfolio.items){
      if(item.asset === 'BTC' || item.asset === 'ETH' || item.asset === 'USD'){
        filtered_data.push(item);
        charPortfolio[item.asset] = {
          available: item.available
        }
      }
    }
  }


  return (
    <Container>
      <Title
        style={{
          color: colors.BLACK,
          fontSize: RFValue(fonts.LARGE_SIZE * 2),
          fontFamily: fonts.WORK_SANS_BOLD,
          lineHeight: RFValue(40),
          textAlign: 'center',
          marginTop: 0,
          paddingTop: 0
        }}
      >
        {'\u0024'}{charPortfolio['USD'] !== undefined ? Math.ceil(charPortfolio['USD'].available) : 0.00}
      </Title>
      <BalanceCover>
        <Text
          style={{
            color: colors.PRIMARY_TEXT,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            lineHeight: RFValue(17),
            textTransform: 'capitalize'
          }}
        >
          {t(`community.passport.cashBalance`)}
        </Text>
      </BalanceCover>
      <ButtonCover>
        { (charPortfolio['USD'] !== undefined && charPortfolio['USD'].available > 0) ?
           <GradientButton
            onPress={() => navigation.navigate('CryptoFaqScreen', { refetch })}
            style={{
              height: 50
            }}
            gradientContainerstyle={{
              height: 50,
              width: '48%'
            }}
            contentStyle={{
              height: 50
            }}
          >
            {t(`community.passport.crypto`)}
          </GradientButton> 
        :
            <GradientButton
              onPress={() => navigation.navigate('AddCashScreen')}
              style={{
                height: 50
              }}
              gradientContainerstyle={{
                height: 50,
                width: '48%'
              }}
              contentStyle={{
                height: 50
              }}
            >
              {t(`community.passport.addCash`)}
            </GradientButton>
        }
       
        <GradientButton
          onPress={() => {}}
          style={{
            height: 50
          }}
          gradientContainerstyle={{
            height: 50,
            width: '48%'
          }}
          contentStyle={{
            height: 50
          }}
        >
          {t(`community.passport.cashOut`)}
        </GradientButton>
      </ButtonCover>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.BLACK,
          lineHeight: RFValue(30),
          marginTop: RFValue(25),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.linkedAccounts`)}
      </Title>
      <Cover>
        <LeftCover>
          <FontAwesome name="bank" size={22} color={colors.PRIMARY_TEXT} />
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.SMALL_SIZE + 3),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize',
              marginLeft: RFValue(10)
            }}
          >
            Bank of America
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.SMALL_SIZE + 3),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            ...12345
          </Text>
        </RightCover>
      </Cover>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 2),
          color: colors.BLACK,
          lineHeight: RFValue(30),
          marginTop: RFValue(25),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.cashAccount`)}
      </Title>
      <Cover>
        <LeftCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.nativeCurrency`)}
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'uppercase',
              marginRight: RFValue(5)
            }}
          >
            USD
          </Text>
          <Feather
            name="chevron-right"
            size={22}
            color={colors.SECONDARY_TEXT}
          />
        </RightCover>
      </Cover>
      <Cover>
        <LeftCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize'
            }}
          >
            {t(`community.passport.country`)}
          </Text>
        </LeftCover>
        <RightCover>
          <Text
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(17),
              textTransform: 'capitalize',
              marginRight: RFValue(5)
            }}
          >
            United States
          </Text>
          <Feather
            name="chevron-right"
            size={22}
            color={colors.SECONDARY_TEXT}
          />
        </RightCover>
      </Cover>
      <ListCover>
          <Cover> 
            <LeftCover>
                <Title
                  style={{
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE + 2),
                    color: colors.BLACK,
                    lineHeight: RFValue(30),
                    marginTop: RFValue(5),
                    textTransform: 'capitalize'
                  }}
                >
                  {t(`community.passport.cryptocurrency`)}
                </Title>
              </LeftCover>
              <RightCover>
                <Feather
                  name="more-vertical"
                  size={22}
                  color={colors.BLACK}
                />
              </RightCover>
          </Cover>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            <FlatList
              data={filtered_data}
              renderItem={({item}) => (
                <Portfolio item={item} markets={filtered_markets}/>
                )}
              ItemSeparatorComponent={() => <Divider style={{ height: 1}} />}
              keyExtractor={(item, index) => String(index)}
            />       
          </ScrollView>
      </ListCover> 
      
    </Container>
  );
}
