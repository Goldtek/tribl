import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { Avatar } from 'stream-chat-expo';
import { ConversationInterface } from '../../../types';
import { useThemeContext } from '../../../../../theme';
import formatMessageTime from '../../../../../utils/timesince';
import { GET_SINGLE_PASSPORT } from '../../../../../graphql/server/query';
import { UserPassportInterface } from '../../../../../graphql/types';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';
import { fireAuth } from '../../../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, TimeStamp, BadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface DirectChatProp extends ConversationInterface {}

function DirectChatCard(props: DirectChatProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { id: chatId, lastMessage, members } = props;

  const userId = fireAuth.currentUser?.uid;

  const [sender, receiver] = members.sort((a) => {
    if (a.id !== userId) return -1;
    return 0;
  });

  const { data: passportData } = useQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id: sender.id } }
  );

  const receiverPassport = passportData?.singlePassport;
  const title = `${sender.firstName} ${sender.lastName}`;

  const showNotificationBadge =
    lastMessage.receiverId === userId &&
    lastMessage.createdAt >= receiver.readAt;

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'DirectChatScreen',
      params: {
        title,
        chatId,
        receiverId: sender.id,
        ...receiverPassport
      }
    });
  };

  const formatDate = () => {
    if (!lastMessage.createdAt) return;
    return formatMessageTime(lastMessage.createdAt);
  };

  return (
    <TouchableRipple
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: colors.light,
        borderBottomWidth: 1
      }}
      onPress={handleNavigation}
      ref={hideSensitiveView}
    >
      <Fragment>
        <Avatar image={sender.avatar} name={title} size={RFValue(40)} />

        <NameContainer ref={hideSensitiveView}>
          <Fragment>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE - 1)
              }}
            >
              {title.length >= 30 ? `${title.substr(0, 30)}...` : title}
            </Title>

            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                color: colors.SECONDARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.MEDIUM_SIZE - 2
              }}
            >
              {lastMessage.text.length >= 30
                ? `${lastMessage.text.substr(0, 30)}...`
                : lastMessage.text}
            </Text>
          </Fragment>
        </NameContainer>

        <TimeStamp>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: fonts.MEDIUM_SIZE - 2,
              marginVertical: 5
            }}
          >
            {formatDate()}
          </Text>

          {showNotificationBadge ? <BadgeWrapper /> : null}
        </TimeStamp>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(DirectChatCard);
