import { UserAvailability, _Neo4jDate } from '../../graphql/types';

export interface MessageInterface {
  _id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  replayCount?: number;
  user: { _id: string; avatar: string; name: string };
  sender: { avatar: string; firstName: string; lastName: string };
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
  status: string;
  lastSeen: number;
  lastOffline?: number;
  lastOnline?: number;
}

interface ConversationUser {
  id: string;
  readAt: Date;
  avatar: string;
  lastName: string;
  firstName: string;
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
  members: ConversationUser[];
}

export interface ChannelConversationInterface {
  id: string;
  lastMessage: {
    text: string;
    image?: string;
    video?: string;
    audio?: string;
    createdAt: Date;
  };
  channel: { name: string };
  sender: ConversationUser;
  community: {
    id: string;
    name: string;
    avatar: string;
    createdAt: _Neo4jDate;
    updatedAt: _Neo4jDate;
  };
}
