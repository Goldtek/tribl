import React, { Fragment, useCallback } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { ConversationInterface } from '../../../types';
import { useThemeContext } from '../../../../../theme';
import formatMessageTime from '../../../../../utils/timesince';
import { GET_SINGLE_PASSPORT } from '../../../../../graphql/server/query';
import { UserPassportInterface } from '../../../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, TimeStamp, BadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface RequestChatCard extends ConversationInterface {}

function RequestChatCard(props: RequestChatCard) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { id: chatId, lastMessage, members } = props;

  const [sender, receiver] = members.sort((a) => {
    if (a.id !== lastMessage.receiverId) return -1;
    return 0;
  });

  const { data: passportData, loading } = useQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id: sender.id } }
  );

  const receiverPassport = passportData?.singlePassport;

  const handleNavigation = useCallback(() => {
    navigation.navigate('MessageRequestScreen', {
      title: `${receiverPassport?.firstName} ${receiverPassport?.lastName}`,
      avatar: receiverPassport?.avatar,
      receiverId: receiver.id,
      senderId: sender.id,
      chatId
    });
  }, [loading]);

  const formatDate = useCallback(() => {
    if (!lastMessage.createdAt) return;
    return formatMessageTime(lastMessage.createdAt);
  }, [lastMessage.createdAt]);

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
                style={{
                  color: colors.SECONDARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE)
                }}
              >
                3 min ago
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
            {lastMessage.createdAt >= receiver.readAt ? <BadgeWrapper /> : null}
          </TimeStamp>
        ) : null}
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(RequestChatCard);
