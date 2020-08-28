import React, { Fragment, useCallback } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { NavigationInterface } from '../../../../types';
import { useThemeContext } from '../../../../../theme';
import hexToRGB from '../../../../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberProp extends NavigationInterface {
  avatar: string;
  lastSeen: string;
  name: string;
  firstName: string;
  lastName: string;
}

function Member(props: MemberProp) {
  const navigation = useNavigation();

  const { colors, fonts } = useThemeContext();
  const {
    avatar = 'https://picsum.photos/700',
    name = 'Paul Maet',
    firstName,
    lastName,
    lastSeen
  } = props;

  const handleNavigation = useCallback(
    () =>
      navigation.navigate('ChatScreen', { title: `${firstName} ${lastName}` }),
    []
  );

  return (
    <TouchableRipple
      style={{
        height: RFValue(80),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RFValue(20)
      }}
      rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
      onPress={handleNavigation}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(60),
            height: RFValue(60),
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
            {`${firstName} ${lastName}`}
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
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(Member);
