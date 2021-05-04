import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
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
  chatClient
} from '../../../../stream/types';
import { ChannelSort } from 'stream-chat';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function ChannelsTab(props: ScreenProp) {
  const filters = {
    type: 'team',
    members: { $in: [chatClient.user?.id] },
    $and: [{ isDm: { $ne: true } }, { isGroup: { $ne: true } }]
  };

  const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

  const options = { presence: true, state: true, watch: true };

  useEffect(() => {
    tagScreenName('ChannelsTab');
  }, []);

  return (
    <Chat
      // @ts-ignore
      client={chatClient}
    >
      <StatusBar translucent animated style="dark" />
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
          sort={sort}
          // @ts-ignore
          filters={filters}
          options={options}
          Preview={CustomChannelPreview}
          additionalFlatListProps={{ showsVerticalScrollIndicator: false }}
        />
      </Container>
    </Chat>
  );
}

export default React.memo(ChannelsTab);
