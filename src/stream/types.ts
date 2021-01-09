import { createContext, SetStateAction, Dispatch } from 'react';
import { Channel, StreamChat } from 'stream-chat';
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
export interface LocalChannelType extends DefaultChannelType {}
export interface LocalMessageType extends DefaultMessageType {}
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
>('q95x9hkbyd6p');

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

export const StreamContext = createContext({} as ContextPropType);
