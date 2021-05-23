import React, { Fragment } from 'react';
import { View, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, Title, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import timeSince from '../../../../utils/timeAgo';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useThemeContext } from '../../../../theme';
import { USER_DEFAULT_AVATAR } from '../../../../constants';

// DEFINE SCREEN PROP TYPES
interface TranasactionCardProp {
  id: string;
  narration: string;
  asset: string;
  createdAt: string;
  costPrice: string;
  side: string;
  source: string;
  type: string;
  avatar: string;
  onPress: (id: string) => void;
}

export default function WalletCard(props: TranasactionCardProp) {
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const handleNavigation = () => {};

  return (
    <TouchableRipple
      onPress={() => props.onPress(props.id)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: RFValue(20),
        backgroundColor: colors.WHITE
      }}
    >
      <Fragment>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: props.avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(5)
            }}
          />
          <View style={{ marginLeft: 15 }}>
            <Title
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT
              }}
            >
              {props?.narration}
            </Title>
            <Paragraph
              style={{
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                color: colors.PRIMARY_TEXT
              }}
            >
              {props?.asset}
            </Paragraph>
            <Paragraph
              style={{
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                fontFamily: fonts.WORK_SANS_MEDIUM,
                color: colors.PRIMARY_TEXT
              }}
            >
              {timeSince(parseInt(props.createdAt))}
            </Paragraph>
          </View>
        </View>
        <Text
          style={{
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            margin: 0,
            padding: 0,
            color: colors.RED
          }}
        >
          ${props.costPrice}
        </Text>
      </Fragment>
    </TouchableRipple>
  );
}
