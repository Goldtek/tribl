import React, { useState } from 'react';
import uuid from 'uuid';
import { useQuery } from '@apollo/react-hooks';
import { NavigationInterface } from '../../types';
import TransactionCard from './widget';
import { FlatList } from 'react-native';

import { Container } from './styles';
import { GET_TRANSACTION_HISTORY } from '../../../graphql/server/query';
import TransactionModal from './widget/modal';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function TransactionHistory(props: ScreenProp) {
  const {
    data: { getMyTransactionHistory: { data = [] } = {} } = {}
  } = useQuery(GET_TRANSACTION_HISTORY, {
    variables: { input: {} }
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

  const renderItem = ({ item }: any) => (
    <TransactionCard {...item} onPress={handleTransactionPress} />
  );

  return (
    <Container>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
