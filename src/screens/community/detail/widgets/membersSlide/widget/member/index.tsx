import React, { Fragment } from 'react';
import { NavigationInterface } from '../../../../../../types';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberProp extends NavigationInterface {
  avatar: string;
  lastSeen: string;
  name: string;
  connect: boolean;
}

function Member(props: MemberProp) {
  const { colors, fonts } = useThemeContext();
  const {
    avatar = 'https://picsum.photos/700',
    lastSeen = '3 mins ago',
    name = 'Paul Maet',
    connect
  } = props;

  return (
    <TouchableRipple
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: RFValue(10),
        paddingLeft: RFValue(10),
        paddingRight: RFValue(10)
      }}
      onPress={() => {}}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(50),
            height: RFValue(50),
            borderRadius: RFValue(4)
          }}
        />
        <NameContainer>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
          >
            {name}
          </Title>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE)
            }}
          >
            {lastSeen}
          </Text>
        </NameContainer>
        {connect ? (
          <TouchableRipple
            style={{
              marginLeft: 'auto',
              width: RFValue(50),
              height: RFValue(35),
              backgroundColor: colors.WHITE,
              borderWidth: 1,
              borderColor: colors.INPUT,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => {}}
          >
            <Feather name="send" size={20} color={colors.PRIMARY_TEXT} />
          </TouchableRipple>
        ) : (
          <TouchableRipple
            style={{
              marginLeft: 'auto',
              width: RFValue(50),
              height: RFValue(35),
              backgroundColor: colors.PRIMARY,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={() => {}}
          >
            <Feather name="plus" size={20} color={colors.WHITE} />
          </TouchableRipple>
        )}
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(Member);
