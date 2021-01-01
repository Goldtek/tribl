import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { ConversationInterface } from '../../types';
import { useThemeContext } from '../../../../theme';
import formatMessageTime from '../../../../utils/timesince';
import { GET_SINGLE_PASSPORT } from '../../../../graphql/server/query';
import { UserPassportInterface } from '../../../../graphql/types';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';
import { fireAuth } from '../../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, TimeStamp, BadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface RequestChatCard extends ConversationInterface {}

function RequestChatCard(props: RequestChatCard) {
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

  const handleNavigation = () => {
    navigation.navigate('MessageRequestChatScreen', {
      title,
      chatId,
      senderId: sender.id,
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
        {sender?.avatar ? (
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: sender?.avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(4)
            }}
          />
        ) : (
          <Image
            source={require('../../../../../assets/images/profile.png')}
            resizeMode="cover"
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(4)
            }}
          />
        )}

        <NameContainer ref={hideSensitiveView}>
          {title ? (
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE - 2)
              }}
            >
              {title}
            </Title>
          ) : (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                width={RFValue(130)}
                height={RFValue(15)}
              />
            </SkeletonPlaceholder>
          )}
          {/* <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE - 2)
            }}
          >
            `${sender.currentLocation.city} ${sender.currentLocation.state}`
          </Text> */}
        </NameContainer>

        <TimeStamp>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE - 2),
              marginVertical: 5
            }}
          >
            {formatDate()}
          </Text>
          {lastMessage.createdAt >= receiver.readAt ? <BadgeWrapper /> : null}
        </TimeStamp>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(RequestChatCard);
