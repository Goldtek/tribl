import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Title, Text, Button, Divider } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

import { FlatList } from 'react-native';
import { useLazyQuery } from '@apollo/react-hooks';
import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { GET_CRYPTO_TRANSACTION_HISTORY } from '../../../graphql/server/query';
import TransactionCard from './widget';

import { Container, BalanceCover } from './styles';
import { View } from 'react-native';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CryptoTransactionScreen(props: ScreenProp) {
  const { price = '', asset = '' } = props.route.params;
  const [
    getTransactionHistory,
    { data: { getMyTransactionHistory: { data = [] } = {} } = {} }
  ] = useLazyQuery(GET_CRYPTO_TRANSACTION_HISTORY);
  const { fonts, colors } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  useEffect(() => {
    getTransactionHistory({ variables: { input: { filter: { asset } } } });
  }, [asset]);

  const renderItem = ({ item }: any) => <TransactionCard {...item} />;

  return (
    <Container>
      <View style={{ padding: RFValue(25) }}>
        <Title
          style={{
            color: colors.BLACK,
            fontSize: RFValue(fonts.MEDIUM_SIZE * 2),
            fontFamily: fonts.WORK_SANS_BOLD,
            textAlign: 'center'
          }}
        >
          0 {asset}
        </Title>
        <BalanceCover>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
              fontFamily: fonts.WORK_SANS_REGULAR,
              textTransform: 'capitalize'
            }}
          >
            ${price}
          </Text>
        </BalanceCover>
        <GradientButton
          onPress={() => navigation.navigate('CryptoFaqScreen')}
          style={{
            height: 50
          }}
          gradientContainerstyle={{
            height: 50,
            width: '98%',
            margin: 'auto'
          }}
          contentStyle={{
            height: 50
          }}
          labelStyle={{
            fontSize: RFValue(fonts.MEDIUM_SIZE * 1.5)
          }}
        >
          Trade
        </GradientButton>
      </View>

      <Title
        style={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 3),
          color: colors.BLACK,
          marginTop: RFValue(40),
          marginLeft: RFValue(20),
          marginBottom: RFValue(20),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.passport.transactionHistory`)}
      </Title>
      <Divider></Divider>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
