import React, { useEffect } from 'react';
import CustomChannelPreview from './widget';
import { NavigationInterface } from '../../../types';
import { tagScreenName } from '../../../../utils/uxcamHelper';
import { ChannelList, Chat, DefaultCommandType } from 'stream-chat-expo';
import {
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType,
  chatClient,
  ChannelType
} from '../../../../stream/types';
import { ChannelSort } from 'stream-chat';
import { useStreamContext } from '../../../../stream';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function ChannelsTab(props: ScreenProp) {
  const { navigation } = props;
  const { setChannel } = useStreamContext();

  const filters = {
    example: 'example-apps',
    members: { $in: ['ron'] },
    type: 'messaging'
  };

  const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

  const options = { state: true, watch: true };

  useEffect(() => {
    tagScreenName('ChannelsTab');
  }, []);

  return (
    <Chat
      // @ts-ignore
      client={chatClient}
    >
      <Container>
        <ChannelList<
          LocalAttachmentType,
          LocalChannelType,
          DefaultCommandType,
          LocalEventType,
          LocalMessageType,
          LocalReactionType,
          LocalUserType
        >
          filters={filters}
          onSelect={(channel) => {
            setChannel(channel as ChannelType);
            navigation.navigate('ChannelChatScreen');
          }}
          options={options}
          sort={sort}
          Preview={CustomChannelPreview}
        />
      </Container>
    </Chat>
  );
}

export default React.memo(ChannelsTab);
