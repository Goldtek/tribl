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
interface TranasactionCardProp {
  id: string;
  narration: string;
  entityName: string;
  accountNumber: string;
  amount: string;
}

export default function WalletCard(props: TranasactionCardProp) {
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const handleNavigation = () => {};

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
              margin: 0
            }}
          >
            {props.narration}
          </Title>
          <Paragraph
            style={{ fontSize: fonts.MEDIUM_SIZE, margin: 0, padding: 0 }}
          >
            {props.entityName}
          </Paragraph>
          <Paragraph style={{ fontSize: fonts.MEDIUM_SIZE }}>
            {props.accountNumber}
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
            {props.amount}
          </Title>
          <Paragraph
            style={{ fontSize: fonts.MEDIUM_SIZE + 3, textAlign: 'right' }}
          >
            $20.00
          </Paragraph>
        </View>
      </Fragment>
    </TouchableRipple>
  );
}
