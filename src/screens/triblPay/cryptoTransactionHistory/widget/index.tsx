import React, { Fragment } from 'react';
import { View, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, Title, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useThemeContext } from '../../../../theme';
import { Cover, LeftCover, RightCover } from '../styles';

// DEFINE SCREEN PROP TYPES
interface FundingSource {
  bank?: {
    name: string;
    accountNumber: string;
  };
  card?: {
    network: string;
    last4: string;
  };
}
interface TranasactionCardProp {
  id: string;
  narration: string;
  entityName: string;
  accountNumber: string;
  amount: string;
  costPrice: string;
  equivalent: string;
  source: string;
  asset: string;
  salePrice: string;
  fundingSource: FundingSource;
}

export default function WalletCard(props: TranasactionCardProp) {
  const { colors, fonts } = useThemeContext();

  const handleNavigation = () => {};

  let source = '';
  let accountDetails = '';
  let amount = Math.floor(props.costPrice * props.salePrice);

  if (props.source === 'BANK_TRANSFER') {
    source = props.fundingSource?.bank?.name || '';
    accountDetails = props.fundingSource?.bank?.accountNumber || '';
  } else if (props.source === 'CARD') {
    source = props.fundingSource?.card?.network || '';
    accountDetails = props.fundingSource?.card?.last4
      ? `******${props.fundingSource?.card?.last4}`
      : '';
  } else {
    source = 'Using USD Account';
  }

  if (props.source !== 'WALLET' && !props.fundingSource) {
    return <View></View>;
  }

  return (
    <TouchableRipple
      onPress={handleNavigation}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RFValue(20),
        paddingVertical: RFValue(5),
        backgroundColor: colors.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: colors.INACTIVE
      }}
    >
      <Fragment>
        <View style={{ flex: 1 }}>
          <Title
            style={{
              color: colors.BLACK,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              fontFamily: fonts.WORK_SANS_REGULAR,
              padding: 0,
              margin: 0,
              textTransform: 'capitalize'
            }}
          >
            {props.narration}
          </Title>
          <Paragraph
            style={{
              fontSize: fonts.MEDIUM_SIZE,
              margin: 0,
              padding: 0,
              textTransform: 'capitalize'
            }}
          >
            {source}
          </Paragraph>
          <Paragraph style={{ fontSize: fonts.MEDIUM_SIZE }}>
            {accountDetails}
          </Paragraph>
        </View>
        <View style={{}}>
          <Title
            style={{
              color: colors.LIGHT_GREEN,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              textAlign: 'right'
            }}
          >
            {amount} {props.asset}
          </Title>
          <Paragraph
            style={{ fontSize: fonts.MEDIUM_SIZE + 3, textAlign: 'right' }}
          >
            ${props.costPrice}
          </Paragraph>
        </View>
      </Fragment>
    </TouchableRipple>
  );
}
