import React from 'react';
import { useThemeContext } from '../../../theme';
import { useQuery } from '@apollo/react-hooks';
import { NavigationInterface } from '../../types';
import TransactionCard from './widget';
import { ScrollView, FlatList } from 'react-native';

import { Container } from './styles';
import { GET_TRANSACTION_HISTORY } from '../../../graphql/server/query';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

const items = [
  {
    name: 'Donation',
    location: 'Naija Nation',
    time: '5 minutes ago',
    id: '1'
  },
  { name: 'Purchase', location: 'bitcoin', time: 'May 1st', id: '2' }
];

export default function TransactionHistory(props: ScreenProp) {
  const { data: { getTransactionHistory: { data = [] } } = {} } = useQuery(
    GET_TRANSACTION_HISTORY,
    {
      variables: { input: {} }
    }
  );

  const renderItem = ({ item }: any) => <TransactionCard {...item} />;

  return (
    <Container>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
