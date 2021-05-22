import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { Title, Text } from 'react-native-paper';
// import { Feather, FontAwesome } from '@expo/vector-icons';
// import { RFValue } from 'react-native-responsive-fontsize';

// import GradientButton from '../../../components/gradientButton';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import TransactionCard from './widget';
import { ScrollView, FlatList } from 'react-native';

import { Container } from './styles';

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
  // const { colors, fonts } = useThemeContext();
  // const { t } = useTranslation();
  // const { navigation } = props;

  const renderItem = ({ item }: any) => <TransactionCard {...item} />;

  return (
    <Container>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
