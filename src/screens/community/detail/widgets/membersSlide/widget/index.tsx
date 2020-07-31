import React from 'react';
import { NavigationInterface } from '../../../../../types';
import { Title, Text } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, JoinContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberWidgetProp extends NavigationInterface {
  avatar: string;
  lastSeen: string;
  name: string;
}

function MemberCard(props: MemberWidgetProp) {
  const { colors, fonts } = useThemeContext();
  const {
    avatar = 'https://picsum.photos/700',
    lastSeen = '3 mins ago',
    name = 'Paul Maet'
  } = props;

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: RFValue(10)
      }}
    >
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{
          width: RFValue(30),
          height: RFValue(30),
          borderRadius: RFValue(5)
        }}
      />
      <NameContainer>
        <Title
          style={{
            color: colors.PRIMARY_TEXT,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE),
            lineHeight: RFValue(19)
          }}
        >
          {name}
        </Title>
        <Text
          style={{
            color: colors.SECONDARY_TEXT,
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.SMALL_SIZE),
            lineHeight: RFValue(10)
          }}
        >
          {lastSeen}
        </Text>
      </NameContainer>
      <JoinContainer>
        <Text style={{ color: colors.WHITE }}>+</Text>
      </JoinContainer>
    </TouchableOpacity>
  );
}

export default React.memo(MemberCard);
