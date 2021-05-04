import { createContext, SetStateAction, Dispatch } from 'react';
import { Channel, StreamChat } from 'stream-chat';
import ENVIRONMENT_VARIABLES from 'react-native-config';
import { CommunityInterface } from '../graphql/types';
import {
  DefaultAttachmentType,
  DefaultReactionType,
  ThreadContextValue,
  DefaultCommandType,
  DefaultChannelType,
  DefaultMessageType,
  DefaultEventType,
  DefaultUserType
} from 'stream-chat-expo';

export interface LocalAttachmentType extends DefaultAttachmentType {}
export interface LocalReactionType extends DefaultReactionType {}
export interface LocalChannelType extends DefaultChannelType {
  isDm: boolean;
  isGroup: boolean;
  channelId: string;
  conversationId: string;
  created_by: LocalUserType;
  community: CommunityInterface;
  messageRequest: { status: boolean };
}
export interface LocalMessageType extends DefaultMessageType {
  receiver: { name: string; image: string; id: string };
  sender: { name: string; image: string; id: string };
  group_system: boolean;
  invitation: boolean;
}

export interface LocalEventType extends DefaultEventType {}
export interface LocalUserType extends DefaultUserType {}

export const chatClient = new StreamChat<
  LocalAttachmentType,
  LocalChannelType,
  DefaultCommandType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
>(ENVIRONMENT_VARIABLES.TRIBL_STREAM_API_KEY);

export type ChannelType = Channel<
  LocalAttachmentType,
  LocalChannelType,
  DefaultCommandType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
>;

export type ThreadType = ThreadContextValue<
  LocalAttachmentType,
  LocalChannelType,
  DefaultCommandType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType
>['thread'];

export type ActivityScreenType =
  | 'channelScreen'
  | 'directMessage'
  | 'channelThreadScreen'
  | 'directMessageThreadScreen';

type ContextPropType = {
  thread: ThreadType;
  channel: ChannelType;
  activityScreen: ActivityScreenType;
  setThread: Dispatch<SetStateAction<ThreadType>>;
  setChannel: Dispatch<SetStateAction<ChannelType>>;
  setActivityScreen: Dispatch<SetStateAction<ActivityScreenType>>;
};

export interface GiphyInterface {
  data: any[];
  pagination: {
    count: number;
    offset: number;
    total_count: number;
  };
  meta?: {
    msg: string;
    status: number;
    response_id: string;
  };
}

export const StreamContext = createContext({} as ContextPropType);
