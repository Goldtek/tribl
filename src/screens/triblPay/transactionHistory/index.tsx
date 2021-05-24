import React, { useState } from 'react';
import uuid from 'uuid';
import { useQuery } from '@apollo/react-hooks';
import { NavigationInterface } from '../../types';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import TransactionCard from './widget';
import { FlatList } from 'react-native';

import { Container } from './styles';
import { GET_TRANSACTION_HISTORY } from '../../../graphql/server/query';
import TransactionModal from './widget/modal';
import { useThemeContext } from '../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function TransactionHistory(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const {
    data: { getMyTransactionHistory: { data = [] } = {} } = {},
    networkStatus,
    refetch,
    fetchMore
  } = useQuery(GET_TRANSACTION_HISTORY, {
    variables: { input: { limit: 5 } },
    notifyOnNetworkStatusChange: true
  });

  const transactions = data.map((transaction: any) => {
    let avatarUrl =
      'https://res.cloudinary.com/akinduko-tribl-network/image/upload/v1621702328/tribl/Component_8_1_d8wi88.png';

    if (transaction.type === 'TRIBE_DONATE') {
      avatarUrl = transaction.payee.community.avatar;
    }

    if (transaction.type === 'BUY_CRYPTO' && transaction.asset === 'BTC') {
      avatarUrl =
        'https://res.cloudinary.com/akinduko-tribl-network/image/upload/v1621702328/tribl/bitcoin-btc-logo_1_1_e0ytbz.png';
    }

    if (transaction.type === 'BUY_CRYPTO' && transaction.asset === 'TC') {
      avatarUrl =
        'https://res.cloudinary.com/akinduko-tribl-network/image/upload/v1621702328/tribl/bitcoin-btc-logo_1_1_e0ytbz.png';
    }

    if (transaction.type === 'BUY_CRYPTO' && transaction.asset === 'ETH') {
      avatarUrl =
        'https://res.cloudinary.com/akinduko-tribl-network/image/upload/v1621702328/tribl/ethereum_wonb3_1_1_xcuthr.png';
    }

    return { ...transaction, avatar: avatarUrl, id: uuid.v4() };
  });

  const [modalState, setModalState] = useState(false);
  const [currentTransaction, setTransaction] = useState(null);

  const handleTransactionPress = (id: string) => {
    const transaction = transactions.find((t: any) => t.id === id);

    if (transaction) {
      setTransaction(transaction);
      setModalState(true);
    }
  };

  const fetchMoreTransactions = () => {
    fetchMore({
      variables: { skip: data.length, limit: 5 },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        console.tron(prev);
        console.tron(fetchMoreResult);
        if (!fetchMoreResult) {
          return prev;
        }

        return Object.assign({}, prev, {
          communityInvites: {
            ...prev?.getMyTransactionHistory,
            data: [
              ...prev?.getMyTransactionHistory.data,
              ...fetchMoreResult?.getMyTransactionHistory.data
            ]
          }
        });
      }
    });
  };

  const renderItem = ({ item }: any) => (
    <TransactionCard {...item} onPress={handleTransactionPress} />
  );

  return (
    <Container>
      <FlatList
        refreshing={networkStatus === 4}
        onRefresh={() => {
          refetch();
        }}
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          fetchMoreTransactions();
        }}
        ListEmptyComponent={
          <Text
            style={{
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              margin: RFValue(20),
              textAlign: 'center'
            }}
          >
            There is no transactions
          </Text>
        }
      />

      {currentTransaction && (
        <TransactionModal
          isOpen={modalState}
          onClose={() => setModalState(false)}
          data={currentTransaction}
        />
      )}
    </Container>
  );
}
