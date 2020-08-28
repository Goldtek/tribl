interface User {
  _id: string;
  name: string;
  avatar: string;
}

export interface MessageInterface {
  _id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  replayCount: number;
  user: User;
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

export interface GroupInterface {
  id: string;
  avatar: string;
  name: string;
  unseenCount: number;
  displayMessage: string;
  lastMessageTime: Date;
  members: {
    title: string;
    avatar: string;
    receiverId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
