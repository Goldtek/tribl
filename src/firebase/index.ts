import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';

import { firechat, database, fireAuth } from './config';

import { ROOM_TYPES } from './types';

class Firechat {
  private userId: string = '';

  async signIn(firebaseToken: string) {
    fireAuth.signInWithCustomToken(firebaseToken);
    fireAuth.onAuthStateChanged(async (user) => {
      if (user) this.userId = user.uid;
    });
  }

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getUserConversations(
    conversationType: ROOM_TYPES
  ): Promise<FirebaseFirestoreTypes.CollectionReference> {
    // get user chat history via userId
    return firechat
      .collection(ROOM_TYPES.USERS)
      .doc(this.userId.trim())
      .collection(conversationType);
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

  // USER ONLINE STATUS METHOD TO TRACK USER PRESENCE
  async onlineStatus(userId: string) {
    const userStatusRef = database.ref(`/status/${userId.trim()}`);

    // Set the user online status to be through
    userStatusRef.set({
      state: 'online',
      last_changed: firestore.FieldValue.serverTimestamp()
    });

    return userStatusRef.onDisconnect().update({
      state: 'offline',
      last_changed: firestore.FieldValue.serverTimestamp()
    });
  }
}

export default new Firechat();
