import React, { Fragment, useEffect, useState } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native';
import Firechat from '../../../../../firebase';
import { RFValue } from 'react-native-responsive-fontsize';
import { ChannelConversationInterface } from '../../../types';
import { useThemeContext } from '../../../../../theme';
import formatMessageTime from '../../../../../utils/timesince';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, TimeStamp, BadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface ChannelChatProp extends ChannelConversationInterface {}

function ChannelChatCard(props: ChannelChatProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const [userReadAt, setUserReadAt] = useState(0);

  const { id: chatId, lastMessage, channel, community, sender } = props;

  const title = `#${community.name.split(' ').join('')}-${channel.name}`;

  let text = lastMessage.text;

  if (text.includes('has joined the channel!')) {
    text = `${sender.firstName} ${sender.lastName} ${lastMessage.text}`;
  }

  if (text.length >= 30) text = `${text.substr(0, 30)}...`;

  const showNotificationBadge =
    new Date(lastMessage.createdAt).getTime() >= new Date(userReadAt).getTime();

  const handleNavigation = () => {
    navigation.navigate('ChannelChatScreen', {
      title: channel.name,
      chatId,
      isMember: true,
      channel: { community: community.name, name: channel.name }
    });
  };

  const formatDate = () => {
    if (!lastMessage.createdAt) return;
    return formatMessageTime(lastMessage.createdAt);
  };

  useEffect(() => {
    const unsubscribe = Firechat.getChannelParticipantReadAt(chatId).onSnapshot(
      {
        next: (snapshot) => {
          const readMessages = snapshot.data();

          readMessages?.readAt
            ? setUserReadAt(readMessages?.readAt)
            : setUserReadAt(readMessages?.createdAt);
        }
      }
    );

    return () => unsubscribe();
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
      ref={hideSensitiveView}
    >
      <Fragment>
        {community.avatar ? (
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{
              uri: community.avatar,
              priority: FastImage.priority.high
            }}
            style={{ width: RFValue(50), height: RFValue(50), borderRadius: 4 }}
          />
        ) : (
          <Image
            source={require('../../../../../../assets/images/profile.png')}
            resizeMode="cover"
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(4)
            }}
          />
        )}

        <NameContainer ref={hideSensitiveView}>
          <Fragment>
            {title ? (
              <Title
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE - 2)
                }}
              >
                {title.length >= 30 ? `${title.substr(0, 20)}...` : title}
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
                fontSize: RFValue(fonts.MEDIUM_SIZE - 2)
              }}
            >
              {text}
            </Text>
          </Fragment>
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

          {showNotificationBadge ? <BadgeWrapper /> : null}
        </TimeStamp>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(ChannelChatCard);
