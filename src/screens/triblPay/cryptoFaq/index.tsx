import React, { useState, useRef } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { Title, Text, Divider } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';

import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { GET_MARKET } from '../../../graphql/server/query';
import Item from "./widgets/item";

import {
  Container,
  Cover,
  GradientContainer
} from './styles';


// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CryptoFaqScreen(props: ScreenProp) {
  const [data] = useState([]);
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const filtered_markets = [];
  const { params } = props.route;
  const { refetch } = params;
  
  const { data: requestData } = useQuery(GET_MARKET);
  const fetchMarket = requestData?.fetchMarket;
  const markets = fetchMarket?.markets;

  if(markets){
    for(let item of markets){
      if(item.market === 'BTCUSD' || item.market === 'ETHUSD' || item.market === 'PAXGUSD'){
        filtered_markets.push(item);
      }
    }
  }


  return (
    <Container>
      <Cover>
        <Text
            style={{
              color: colors.CONTENT_COLOR,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(25),
              textAlign: 'center',
              textTransform: 'capitalize',
              marginBottom: RFValue(15),
              marginTop: RFValue(-15),
            }}
          >
          {t(`community.passport.content`)}
        </Text>
      
      </Cover>

      <Cover>
        <FlatList
          data={filtered_markets}
          renderItem={({item}) => (
          <Item
              item={item}
              refetch={refetch}
          />
          )}
           keyExtractor={(item, index) => String(index)}
           ItemSeparatorComponent={() => <Divider style={{ height: 1}} />}
           ListFooterComponent={() => <Divider style={{ height: 1}} />}
          />
      </Cover>

      <Cover>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            lineHeight: RFValue(30),
            marginTop: RFValue(25),
            textTransform: 'capitalize'
          }}
        >
          {t(`community.passport.learnmore`)}
        </Title>
      </Cover>

      <Cover>
      
        <ScrollView contentContainerStyle={{ paddingBottom: 350 }} showsVerticalScrollIndicator={false}>
          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
            <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(0),
                marginBottom: RFValue(15),
              }}
            >
            {t(`community.crypto.understand_crypto`)}
          </Text>

          </GradientContainer>

          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
             <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.bitcoin`)}
            </Text>
          </GradientContainer>

          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
             <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.etherum`)}
            </Text>
        </GradientContainer>  

          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
             <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.tribl`)}
            </Text>
          </GradientContainer>


          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
            <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.faq`)}
            </Text>
          </GradientContainer>


          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
            <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.crypto_question`)}
            </Text>
          </GradientContainer>

          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
            <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.comparison`)}
            </Text>
          </GradientContainer>

          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
            <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.glosary`)}
            </Text>
          </GradientContainer>

          <GradientContainer
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              height: RFValue(180)
            }}
          >
            <Text
              style={{
                color: colors.WHITE,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 5),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(25),
                textAlign: 'left',
                textTransform: 'capitalize',
                marginTop: RFValue(5),
                marginBottom: RFValue(15),
              }}
            >
              {t(`community.crypto.blockchain`)}
            </Text>
          </GradientContainer>
        </ScrollView>
      </Cover>
    </Container>
  );
}
