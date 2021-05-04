import React from 'react';
import { Paragraph, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../../../../theme';
import formatMessageTime from '../../../../../utils/timesince';
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';

import { Container, LeftCover, IconCover } from './styles';

interface ActivityCardProps {
  message: string;
  timeStamp: number;
  tribeAvatar: string;
  userAvatar: string;
  activityType: string;
}

export default function ActivityCard(props: ActivityCardProps) {
  const { message, timeStamp, tribeAvatar, userAvatar, activityType } = props;
  const { colors, fonts } = useThemeContext();

  const avatar =
    activityType == 'COMMUNITY' ||
    activityType == 'INVITE' ||
    activityType == 'CHANNEL'
      ? tribeAvatar
      : userAvatar;

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
    </Container>
  );
}
