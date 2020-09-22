import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { ConversationInterface } from '../../../types';
import { useThemeContext } from '../../../../../theme';
import formatMessageTime from '../../../../../utils/timesince';
import { GET_SINGLE_PASSPORT } from '../../../../../graphql/server/query';
import { UserPassportInterface } from '../../../../../graphql/types';
import { fireAuth } from '../../../../../firebase/config';
import { MARK_MESSAGE_READ } from '../../../../../graphql/server/mutations';

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

  const [markConversationAsRead] = useMutation(MARK_MESSAGE_READ, {
    variables: { payload: { conversationId: chatId } }
  });

  const { data: passportData, loading } = useQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id: sender.id } }
  );

  const receiverPassport = passportData?.singlePassport;

  const showNotificationBadge =
    lastMessage.receiverId === userId &&
    lastMessage.createdAt >= receiver.readAt;

  const handleNavigation = () => {
    navigation.navigate('DirectChatScreen', {
      title: `${receiverPassport?.firstName} ${receiverPassport?.lastName}`,
      avatar: receiverPassport?.avatar,
      receiverId: receiverPassport?.id,
      chatId
    });

    if (showNotificationBadge) markConversationAsRead();
  };

  const formatDate = () => {
    if (!lastMessage.createdAt) return;
    return formatMessageTime(lastMessage.createdAt);
  };

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
        {loading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={RFValue(50)}
              height={RFValue(50)}
              borderRadius={RFValue(4)}
            />
          </SkeletonPlaceholder>
        ) : (
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: receiverPassport?.avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(4)
            }}
          />
        )}

        <NameContainer>
          {!loading ? (
            <Fragment>
              <Title
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  textTransform: 'capitalize'
                }}
              >
                {`${receiverPassport?.firstName} ${receiverPassport?.lastName}`}
              </Title>
              <Text
                numberOfLines={1}
                style={{
                  color: colors.SECONDARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE)
                }}
              >
                {lastMessage.text.length >= 30
                  ? `${lastMessage.text.substr(0, 30)}...`
                  : lastMessage.text}
              </Text>
            </Fragment>
          ) : (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={RFValue(110)}
                height={RFValue(15)}
              />
              <SkeletonPlaceholder.Item
                marginTop={RFValue(5)}
                width={RFValue(150)}
                height={RFValue(7)}
              />
            </SkeletonPlaceholder>
          )}
        </NameContainer>

        {!loading ? (
          <TimeStamp>
            <Text
              style={{
                color: colors.SECONDARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                marginVertical: 5
              }}
            >
              {formatDate()}
            </Text>

            {showNotificationBadge ? <BadgeWrapper /> : null}
          </TimeStamp>
        ) : null}
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(DirectChatCard);
