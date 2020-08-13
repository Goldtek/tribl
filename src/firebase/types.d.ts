// CHAT ROOM TYPES
export enum ROOM_TYPES {
  CHANNELS = 'channels',
  GROUPS = 'groups',
  CONVERSATIONS = 'conversations',
  MESSAGE_REPLY = 'message_reply',
  USER_CONVERSATIONS = 'user_conversations'
}

export interface ChatRoom {
  userId: string;
  receivers?: string[];
  roomType: ROOM_TYPES.CHANNELS | ROOM_TYPES.GROUPS;
}

export interface UserConversation {
  conversationId: string;
  conversationType: 'channel_lists' | 'direct_messages' | 'group_messages';
}
