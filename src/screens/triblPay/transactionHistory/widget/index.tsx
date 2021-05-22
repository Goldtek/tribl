import React, { Fragment } from 'react';
import { View, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, Title, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useThemeContext } from '../../../../theme';
import { USER_DEFAULT_AVATAR } from '../../../../constants';

// DEFINE SCREEN PROP TYPES
interface TranasactionCardProp {
  // avatar: string;
  name: string;
  location: string;
  time: string;
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
        padding: RFValue(20),
        backgroundColor: colors.WHITE
      }}
    >
      <Fragment>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: USER_DEFAULT_AVATAR,
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
                fontSize: RFValue(fonts.LARGE_SIZE + 2),
                color: colors.PRIMARY_TEXT
              }}
            >
              {props.name}
            </Title>
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR,
                color: colors.PRIMARY_TEXT
              }}
            >
              {props.location}
            </Paragraph>
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_REGULAR,
                color: colors.PRIMARY_TEXT
              }}
            >
              {props.time}
            </Paragraph>
          </View>
        </View>
        <Text
          style={{
            fontSize: RFValue(fonts.LARGE_SIZE + 2),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            margin: 0,
            padding: 0,
            color: colors.RED
          }}
        >
          $100
        </Text>
      </Fragment>
    </TouchableRipple>
  );
}
