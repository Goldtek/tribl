import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import { firechat, fireAuth } from './config';
import { ROOM_TYPES } from './types';

class Firechat {
  private userId: string = '';

  async signIn(firebaseToken: string) {
    fireAuth.signInWithCustomToken(firebaseToken);
    fireAuth.onAuthStateChanged((user) => {
      if (user) this.userId = user.uid;
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
  async getUserChannels(
    conversationType: ROOM_TYPES
  ): Promise<FirebaseFirestoreTypes.Query> {
    // get user channels via userId
    return firechat.collection(ROOM_TYPES.CHANNELS);
    // .where(firestore.FieldPath.documentId(), '==', this.userId.trim());
  }

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getConversationMessages(
    conversationIds: string[]
  ): Promise<FirebaseFirestoreTypes.Query> {
    // get user chat history via userId
    return firechat
      .collection(ROOM_TYPES.CONVERSATIONS)
      .where(firestore.FieldPath.documentId(), 'in', conversationIds);
  }

  // GET ROOM CHAT MESSAGES
  getChatMessages(chatId: string): FirebaseFirestoreTypes.Query {
    return firechat
      .collection(ROOM_TYPES.CONVERSATIONS)
      .doc(chatId.trim())
      .collection(ROOM_TYPES.CHATS)
      .orderBy('createdAt', 'desc');
  }

  // GET ALL CHANNEL PARTICIPANTS
  getChannelParticipants(chatId: string): FirebaseFirestoreTypes.Query {
    return firechat
      .collection(ROOM_TYPES.CHANNELS)
      .doc(chatId.trim())
      .collection(ROOM_TYPES.PARTICIPANTS);
  }

  // GET ROOM CHAT MESSAGES
  getChannelMessages(chatId: string): FirebaseFirestoreTypes.Query {
    return firechat
      .collection(ROOM_TYPES.CHANNELS)
      .doc(chatId.trim())
      .collection(ROOM_TYPES.CHATS)
      .orderBy('createdAt', 'desc');
  }

  // GET USER ONLINE PRESENCE
  getOnlineStatus(userId: string): FirebaseFirestoreTypes.DocumentReference {
    return firechat.collection(ROOM_TYPES.USERS).doc(userId.trim());
  }
}

export default new Firechat();
