import { createContext, SetStateAction, Dispatch } from 'react';
import { Channel, StreamChat } from 'stream-chat';
import ENVIRONMENT_VARIABLES from 'react-native-config';
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
import { CommunityInterface, PassportInterface } from '../graphql/types';

export interface LocalAttachmentType extends DefaultAttachmentType {}
export interface LocalReactionType extends DefaultReactionType {}
export interface LocalChannelType extends DefaultChannelType {
  community: CommunityInterface;
}
export interface LocalMessageType extends DefaultMessageType {}
export interface LocalEventType extends DefaultEventType {}
export interface LocalUserType extends DefaultUserType {
  user: PassportInterface;
}

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

type ContextPropType = {
  channel: ChannelType;
  setChannel: Dispatch<SetStateAction<ChannelType>>;
  setThread: Dispatch<SetStateAction<ThreadType>>;
  thread: ThreadType;
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
