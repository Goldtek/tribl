export interface MessageInterface {
  _id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  replayCount: number;
  user: { _id: string; avatar: string };
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

interface Reply {
  title: string;
  value: string;
  messageId?: string;
}

interface QuickReplies {
  type: 'radio' | 'checkbox';
  values: Reply[];
  keepIt?: boolean;
}

interface OnlinePresence {
  status: 'online' | 'offline';
  lastSeen: number;
}

export interface ConversationInterface {
  id: string;
  avatar: string;
  name: string;
  lastMessage: {
    text: string;
    image?: string;
    video?: string;
    audio?: string;
    createdAt: Date;
    receiverId: string;
  };
  members: { id: string; readAt: Date }[];
}
