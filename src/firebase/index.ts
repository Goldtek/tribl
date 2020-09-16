import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';

import { firechat, fireAuth } from './config';

import { ROOM_TYPES } from './types';

class Firechat {
  private userId: string = '';

  async signIn(firebaseToken: string) {
    fireAuth.signInWithCustomToken(firebaseToken);
    fireAuth.onAuthStateChanged(async (user) => {
      if (user) {
        this.userId = user.uid;
        await this.onlineStatus();
      }
    });
  }

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getUserConversations(
    conversationType: ROOM_TYPES
  ): Promise<FirebaseFirestoreTypes.Query> {
    // get user chat history via userId
    return firechat
      .collection(ROOM_TYPES.USERS)
      .doc(this.userId.trim())
      .collection(conversationType)
      .where(firestore.FieldPath.documentId(), '>', '0');
  }

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getConversationMessages(
    conversationIds: string[]
  ): Promise<FirebaseFirestoreTypes.Query> {
    // get user chat history via userId
    return firechat
      .collection(ROOM_TYPES.CONVERSATIONS)
      .where(firestore.FieldPath.documentId(), 'in', conversationIds)
      .limit(30);
  }

  // GET ROOM CHAT MESSAGES
  getChatMessages(chatId: string): FirebaseFirestoreTypes.Query {
    return firechat
      .collection(ROOM_TYPES.CONVERSATIONS)
      .doc(chatId.trim())
      .collection(ROOM_TYPES.CHATS)
      .orderBy('createdAt', 'desc');
  }
}

export default new Firechat();
