import React, { Fragment } from 'react';
import { Paragraph, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../../theme';
import formatMessageTime from '../../../../../utils/timesince';

import { Container, LeftCover, IconCover } from './styles';

interface ActivityCardProps {
  message: string;
  timeStamp: number;
  tribeAvatar: string;
  userAvatar: string;
  activityType: string;
  messageType: string;
  channelName: string;
  userName: string;
  userID: string;
  tribeName: string;
  tribeID: string;
  count: string;
  channelID: string;
}

export default function ActivityCard(props: ActivityCardProps) {
  const navigation = useNavigation();
  const {
    message,
    timeStamp,
    tribeAvatar,
    userAvatar,
    activityType,
    messageType,
    channelName,
    tribeName,
    userName,
    tribeID,
    userID,
    count,
    channelID
  } = props;
  const { colors, fonts } = useThemeContext();

  const avatar =
    activityType == 'COMMUNITY' ||
    activityType == 'INVITE' ||
    activityType == 'CHANNEL'
      ? tribeAvatar
      : userAvatar;

  const handleUserNavigation = () => {
    navigation.navigate('MemberDetailScreen', {
      title: userName,
      details: { id: userID, avatar: userAvatar }
    });
  };

  const handleTribeNavigation = () => {
    navigation.navigate('CommunityDetailScreen', {
      title: tribeName,
      details: { id: tribeID, name: tribeName, avatar: tribeAvatar }
    });
  };

  const handleChannelNavigation = () => {
    navigation.navigate('DeepLinkChannelChatScreen', {
      title: channelName,
      details: { channelId: channelID, title: channelName }
    });
  };

  const messageBody = {
    NEW_CHANNEL_CREATED: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        <Text
          onPress={handleChannelNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {channelName}
        </Text>{' '}
        was created by{' '}
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
          onPress={handleUserNavigation}
        >
          {userName}{' '}
        </Text>
        in{' '}
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}.
        </Text>
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    CONNECTION_ADDED_NEW_TRIBE: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        Your connection{' '}
        <Text
          onPress={handleUserNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {userName}{' '}
        </Text>
        just added a new tribe{' '}
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}
        </Text>
        , help them build the community.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    CONNECTION_JOINED_NEW_TRIBE: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        <Text
          onPress={handleUserNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {userName}
        </Text>{' '}
        just joined{' '}
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}
        </Text>
        , take a second to welcome them to the tribe.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    MEMBERS_FROM_YOUR_CITY_IN_TRIBE: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        There are {count} members from your city in{' '}
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}
        </Text>
        , add more friends nearby.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    CONNECTION_BIRTHDAY: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        Tell{' '}
        <Text
          onPress={handleUserNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {userName}
        </Text>{' '}
        Happy Birthday 🥳🎈.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    CONNECTION_ADDED_NEW_PROFILE_PIC: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        Your connection{' '}
        <Text
          onPress={handleUserNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {userName}
        </Text>{' '}
        just added a new profile pic.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    NEW_MEMBER_JOIN_COMMUNITY_THIS_WEEK: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        Your tribe
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {' '}
          {tribeName}
        </Text>{' '}
        added {count} new members this week, keep it up!.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    PENDING_TRIBE_REQUESTS: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        You have {count} new tribe requests, check em' out.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    COMMUNITY_MILESTONE: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}
        </Text>{' '}
        just hit {count} members! Add a celebratory GIF to{' '}
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}'s general channel.
        </Text>
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    NEW_MEMBERS_JOINED_APP_IN_YOUR_CITY_THIS_WEEK: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        {count} new members joined in your city this week.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          Tribl
        </Text>
        , add more friends nearby.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    CONTACT_JOINED_APP: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        Your contact{' '}
        <Text
          onPress={handleUserNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {userName}
        </Text>{' '}
        just joined the app, send a message and make them feel at home.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    USER_JOINED_NEW_TRIBE: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        <Text
          onPress={handleUserNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {userName}
        </Text>{' '}
        just joined{' '}
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}
        </Text>
        , take a second to say hello.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    CONNECTION_JOINED_NEW_TRIBE_IN_CITY: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        <Text
          onPress={handleUserNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {userName}
        </Text>{' '}
        joined{' '}
        <Text
          onPress={handleTribeNavigation}
          style={{
            fontFamily: fonts.WORK_SANS_BOLD
          }}
        >
          {tribeName}
        </Text>
        in your city.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    CONNECTION_ADDED_THIS_WEEK: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        Your connection{' '}
        <Text
          onPress={handleUserNavigation}
          style={{ fontFamily: fonts.WORK_SANS_BOLD }}
        >
          {userName}
        </Text>{' '}
        added {count} new connections this week!.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    ),
    NEW_CONNECTIONS_THIS_WEEK: (
      <Paragraph
        style={{
          width: '80%',
          fontFamily: fonts.WORK_SANS_MEDIUM,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT
        }}
      >
        You added {count} new connections this week!.
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            color: colors.SECONDARY_TEXT
          }}
        >
          {'  '}
          {formatMessageTime(timeStamp)}
        </Text>
      </Paragraph>
    )
  };

  return (
    <Container>
      <LeftCover>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(50),
            height: RFValue(50),
            borderWidth: 1,
            borderRadius: RFValue(50)
          }}
        />
        <IconCover
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 3 }}
          colors={[colors.PRIMARY, colors.SECONDARY]}
        >
          {activityType == 'COMMUNITY' ? (
            <MaterialCommunityIcons
              name="account-group"
              size={18}
              color={colors.WHITE}
            />
          ) : activityType == 'CONNECTION' ? (
            <MaterialIcons name="group" size={18} color={colors.WHITE} />
          ) : activityType == 'BIRTHDAY' ? (
            <FontAwesome name="birthday-cake" size={15} color={colors.WHITE} />
          ) : activityType == 'PERSON' ? (
            <MaterialIcons name="person" size={18} color={colors.WHITE} />
          ) : activityType == 'INVITE' ? (
            <FontAwesome name="user-plus" size={15} color={colors.WHITE} />
          ) : (
            <MaterialCommunityIcons
              name="clipboard-text"
              size={17}
              color={colors.WHITE}
            />
          )}
        </IconCover>
      </LeftCover>
      {messageType === 'NEW_CHANNEL_CREATED' ? (
        messageBody?.NEW_CHANNEL_CREATED
      ) : messageType === 'CONNECTION_ADDED_NEW_TRIBE' ? (
        messageBody?.CONNECTION_ADDED_NEW_TRIBE
      ) : messageType === 'CONNECTION_JOINED_NEW_TRIBE' ? (
        messageBody?.CONNECTION_JOINED_NEW_TRIBE
      ) : messageType === 'MEMBERS_FROM_YOUR_CITY_IN_TRIBE' ? (
        messageBody?.MEMBERS_FROM_YOUR_CITY_IN_TRIBE
      ) : messageType === 'CONNECTION_BIRTHDAY' ? (
        messageBody?.CONNECTION_BIRTHDAY
      ) : messageType === 'CONNECTION_ADDED_NEW_PROFILE_PIC' ? (
        messageBody?.CONNECTION_ADDED_NEW_PROFILE_PIC
      ) : messageType === 'NEW_MEMBER_JOIN_COMMUNITY_THIS_WEEK' ? (
        messageBody?.NEW_MEMBER_JOIN_COMMUNITY_THIS_WEEK
      ) : messageType === 'PENDING_TRIBE_REQUESTS' ? (
        messageBody?.PENDING_TRIBE_REQUESTS
      ) : messageType === 'COMMUNITY_MILESTONE' ? (
        messageBody?.COMMUNITY_MILESTONE
      ) : messageType === 'NEW_MEMBERS_JOINED_APP_IN_YOUR_CITY_THIS_WEEK' ? (
        messageBody?.NEW_MEMBERS_JOINED_APP_IN_YOUR_CITY_THIS_WEEK
      ) : messageType === 'USER_JOINED_NEW_TRIBE' ? (
        messageBody?.USER_JOINED_NEW_TRIBE
      ) : messageType === 'CONTACT_JOINED_APP' ? (
        messageBody?.CONTACT_JOINED_APP
      ) : messageType === 'CONNECTION_JOINED_NEW_TRIBE_IN_CITY' ? (
        messageBody?.CONNECTION_JOINED_NEW_TRIBE_IN_CITY
      ) : messageType === 'CONNECTION_ADDED_THIS_WEEK' ? (
        messageBody?.CONNECTION_ADDED_THIS_WEEK
      ) : messageType === 'NEW_CONNECTIONS_THIS_WEEK' ? (
        messageBody?.NEW_CONNECTIONS_THIS_WEEK
      ) : (
        <Paragraph
          style={{
            width: '80%',
            fontFamily: fonts.WORK_SANS_MEDIUM,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT
          }}
        >
          {message}
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_MEDIUM,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              color: colors.SECONDARY_TEXT
            }}
          >
            {'  '}
            {formatMessageTime(timeStamp)}
          </Text>
        </Paragraph>
      )}
    </Container>
  );
}
