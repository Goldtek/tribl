import React, { Fragment, useCallback } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { GroupInterface } from '../../../types';
import { useThemeContext } from '../../../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, TimeStamp, BadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberProp extends GroupInterface {}

function Member(props: MemberProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const {
    id: chatId,
    avatar = 'https://picsum.photos/700',
    name = 'Paul Maet',
    displayMessage = 'Girl, I saw your message...',
    lastMessageTime,
    unseenCount
  } = props;

  const handleNavigation = useCallback(
    () => navigation.navigate('ChatScreen', { title: name, avatar, chatId }),
    []
  );

  const formatMessageTime = useCallback(() => {
    if (!lastMessageTime) return;
    return format(new Date(lastMessageTime), 'p');
  }, []);

  return (
    <TouchableRipple
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: RFValue(20),
        paddingLeft: RFValue(15),
        paddingRight: RFValue(15)
      }}
      onPress={handleNavigation}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
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
            {displayMessage}
          </Text>
        </NameContainer>
        <TimeStamp>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE)
            }}
          >
            {formatMessageTime()}
          </Text>
          {unseenCount ? (
            <BadgeWrapper>
              <Text
                style={{
                  color: colors.WHITE,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.SMALL_SIZE)
                }}
              >
                {unseenCount}
              </Text>
            </BadgeWrapper>
          ) : null}
        </TimeStamp>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(Member);
