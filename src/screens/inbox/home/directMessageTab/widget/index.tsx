import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Image } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { ConversationInterface } from '../../../types';
import { useThemeContext } from '../../../../../theme';
import formatMessageTime from '../../../../../utils/timesince';
import { GET_SINGLE_PASSPORT } from '../../../../../graphql/server/query';
import { UserPassportInterface } from '../../../../../graphql/types';
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
  const title = `${receiverPassport?.firstName} ${receiverPassport?.lastName}`;

  const showNotificationBadge =
    lastMessage.receiverId === userId &&
    lastMessage.createdAt >= receiver.readAt;

  const handleNavigation = () => {
    navigation.navigate('DirectChatScreen', {
      title,
      chatId,
      receiverId: receiverPassport?.id,
      ...receiverPassport
    });
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
        <Image
          source={{ uri: receiverPassport?.avatar, cache: 'force-cache' }}
          defaultSource={require('../../../../../../assets/images/profile.png')}
          width={RFValue(50)}
          height={RFValue(50)}
          style={{
            width: RFValue(50),
            height: RFValue(50),
            resizeMode: 'cover',
            borderRadius: RFValue(4)
          }}
        />

        <NameContainer>
          <Fragment>
            {receiverPassport?.firstName ? (
              <Title
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  textTransform: 'capitalize'
                }}
              >
                {title.length >= 30 ? `${title.substr(0, 30)}...` : title}
              </Title>
            ) : (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item
                  width={RFValue(130)}
                  height={RFValue(15)}
                />
              </SkeletonPlaceholder>
            )}
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
        </NameContainer>

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
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(DirectChatCard);
