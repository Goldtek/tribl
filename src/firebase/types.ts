import { MessageInterface } from '../screens/inbox/types';

// CHAT ROOM TYPES
export enum ROOM_TYPES {
  CHANNELS = 'channels',
  GROUPS = 'groups',
  CONVERSATIONS = 'conversations',
  MESSAGE_REPLY = 'messageReply',
  USER_CONVERSATIONS = 'userConversations',
  CHATS = 'CHATS'
}

export enum CONVERSATION_TYPES {
  CHANNEL_LISTS = 'channelLists',
  DIRECT_MESSAGES = 'directMessages',
  GROUP_MESSAGES = 'groupMessages'
}

export interface ChatRoom {
  conversationType: CONVERSATION_TYPES;
  message: MessageInterface;
  name: string;
  receivers: {
    title: string;
    avatar: string;
    receiverId: string;
  }[];
  roomType: ROOM_TYPES.CHANNELS | ROOM_TYPES.GROUPS;
}
