import React, { Fragment, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';
import { NavigationInterface } from '../../../../../types';
import { useThemeContext } from '../../../../../../theme';
import { Mixpanel } from '../../../../../../config';
import {
  JOIN_COMMUNITY_CHANNEL,
  SEND_CHANNEL_MESSAGE
} from '../../../../../../graphql/server/mutations';
import {
  ChannelInterface,
  CommunityInterface
} from '../../../../../../graphql/types';
import { logEvent } from '../../../../../../utils/uxcamHelper';
import { GET_CHANNEL_MEMBERS } from '../../../../../../graphql/server/query';

// DEFINE SCREEN PROP TYPES
interface ChannelCardProp extends NavigationInterface {
  communityDetails: CommunityInterface;
  item: ChannelInterface;
}

export default function ChannelCard(props: ChannelCardProp) {
  const { item, communityDetails } = props;
  const { isMember, id, name } = item;

  const { colors, fonts } = useThemeContext();
  const joinedChannel = useRef<boolean>(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [sendMessage] = useMutation(SEND_CHANNEL_MESSAGE);
  const [joinChannel] = useMutation(JOIN_COMMUNITY_CHANNEL);
  useQuery(GET_CHANNEL_MEMBERS, { variables: { channelId: id } });

  const handleNavigation = () => {
    if (!isMember && !joinedChannel.current) {
      logEvent('join channel', { from: 'channel' });
      Mixpanel.track('User Joins Channel', {
        info: `User Joins ${name} Channel on ${communityDetails.name} community`,
        'Activity Screen': 'Community Channel Slide Screen'
      });

      joinChannel({ variables: { payload: { channelId: id } } }).then(() => {
        joinedChannel.current = true;
        sendMessage({
          variables: {
            payload: {
              system: true,
              channelId: id,
              content: t(`community.chat.join`)
            }
          }
        });
      });
    }

    navigation.navigate('ChannelChatScreen', {
      isMember,
      chatId: id,
      title: `#${name}`,
      channel: { community: communityDetails?.name, name }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: RFValue(20),
        paddingTop: RFValue(25),
        paddingBottom: RFValue(25),
        backgroundColor: colors.WHITE
      }}
    >
      <Fragment>
        <Paragraph
          style={{
            fontSize: RFValue(fonts.LARGE_SIZE),
            fontFamily: fonts.WORK_SANS_REGULAR,
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize'
          }}
        >
          {name}
        </Paragraph>
        <AntDesign name="caretright" size={18} color={colors.PRIMARY_TEXT} />
      </Fragment>
    </TouchableRipple>
  );
}
