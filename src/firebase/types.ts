// CHAT ROOM TYPES
export enum ROOM_TYPES {
  CHANNELS = 'channels',
  GROUPS = 'groups',
  CONVERSATIONS = 'conversations',
  MESSAGE_REPLY = 'messageReply',
  USER_CONVERSATIONS = 'userConversations'
}

export enum CONVERSATION_TYPES {
  CHANNEL_LISTS = 'channelLists',
  DIRECT_MESSAGES = 'directMessages',
  GROUP_MESSAGES = 'groupMessages'
}

export interface ChatRoom {
  receivers?: string[];
  roomType: ROOM_TYPES.CHANNELS | ROOM_TYPES.GROUPS;
}
