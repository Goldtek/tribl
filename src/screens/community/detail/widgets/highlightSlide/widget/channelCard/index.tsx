import React, { Fragment, useState } from 'react';
import { TouchableRipple, Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { Channel, LiteralStringForUnion } from 'stream-chat';
import { useThemeContext } from '../../../../../../../theme';
import { useNavigation } from '@react-navigation/native';
import { ChannelInterface } from '../../../../../../../graphql/types';
import {
  chatClient,
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
} from '../../../../../../../stream/types';
import { useStreamContext } from '../../../../../../../stream';

// DEFINE SCREEN PROP TYPES
interface MyChannelProp extends ChannelInterface {}

export default function MyChannel(props: MyChannelProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { name, community, id, isMember } = props;

  const [channel, setChannel] = useState<
    Channel<
      LocalAttachmentType,
      LocalChannelType,
      LiteralStringForUnion,
      LocalEventType,
      LocalMessageType,
      LocalReactionType,
      LocalUserType
    >
  >();

  const { setChannel: activeChannel } = useStreamContext();

  // useEffect(() => {
  //   const channel = chatClient.channel('team', id);
  //   setChannel(channel);
  // }, [channel]);

  const handleNavigation = () => {
    if (channel) activeChannel(channel);

    navigation.navigate('DrawerScreen', {
      screen: 'ChannelChatScreen',
      params: {
        title: `#${name}`,
        chatId: id,
        isMember,
        channelId: channel?.id,
        details: { ...props },
        channel: { name, community: community?.name }
      }
    });
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={colors.PRIMARY}
      style={{
        height: RFValue(80),
        width: RFValue(120),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: RFValue(10),
        borderWidth: 1.3,
        borderRadius: 5,
        borderColor: colors.PRIMARY
      }}
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: community?.avatar,
            priority: FastImage.priority.high
          }}
          style={{ width: '100%', height: '100%', borderRadius: 4 }}
        />
        <Title
          style={{
            position: 'absolute',
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.SMALL_SIZE),
            backgroundColor: colors.WHITE,
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            textAlign: 'center',
            lineHeight: 10,
            paddingHorizontal: RFValue(5),
            paddingVertical: RFValue(3),
            top: RFValue(58),
            left: RFValue(4)
          }}
        >
          #{name}
        </Title>
      </Fragment>
    </TouchableRipple>
  );
}
