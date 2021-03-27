import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import CustomChannelPreview from './widget';
import { NavigationInterface } from '../../../types';
import { tagScreenName } from '../../../../utils/uxcamHelper';
import { ChannelList, Chat, DefaultCommandType } from 'stream-chat-expo';
import { useQuery } from '@apollo/react-hooks';
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
import { useStreamContext } from '../../../../stream';
import { MyPassportInterface } from '../../../../graphql/types';
import { GET_USER_PASSPORT } from '../../../../graphql/server/query';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function ChannelsTab(props: ScreenProp) {
  const { setChannel } = useStreamContext();

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const filters = {
    members: { $in: [userData?.myPassport.id] },
    $or: [{ isDm: { $ne: true } }, { isGroup: { $ne: true } }],
    isNew: { $ne: true },
    type: 'team'
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
          // @ts-ignore
          filters={filters}
          onSelect={(channel) => setChannel(channel as any)}
          sort={sort}
          options={options}
          Preview={CustomChannelPreview}
          additionalFlatListProps={{ showsVerticalScrollIndicator: false }}
        />
      </Container>
    </Chat>
  );
}

export default React.memo(ChannelsTab);
