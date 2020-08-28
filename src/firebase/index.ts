import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';

import { firechat, database, fireAuth } from './config';

import { GroupInterface, MessageInterface } from '../screens/inbox/types';
import { ROOM_TYPES, ChatRoom } from './types';

const batch = firechat.batch();

class Firechat {
  private userId: string = '';

  async signIn(firebaseToken: string) {
    fireAuth.signInWithCustomToken(firebaseToken);
    fireAuth.onAuthStateChanged((user) => {
      if (user) this.userId = user.uid;
    });
  }

  // // THIS METHOD CREATES A CHANNEL AND GROUP
  async createRoom(roomId: string, payload: ChatRoom) {
    const timestamp = new Date().toString();

    // get chat collection via roomID
    const chatroom = firechat.collection(payload.roomType).doc(roomId.trim());

    // make a write batch for chatroom collection via roomId
    batch.set(
      chatroom,
      {
        id: roomId.trim(),
        name: payload.name,
        unseenCount: 0,
        members: payload.receivers,
        displayMessage: payload.message.text,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      { merge: true }
    );

    payload.receivers.forEach(({ receiverId }) => {
      const docRef = firechat
        .collection(ROOM_TYPES.USER_CONVERSATIONS)
        .doc(receiverId);

      batch.set(
        docRef,
        {
          [payload.conversationType]: firestore.FieldValue.arrayUnion(roomId)
        },
        { merge: true }
      );
    });

    return batch.commit();
  }

  // // THIS METHOD ADDS A NEW MEMBER TO CHANNEL OR GROUP
  // async addMemberToRoom(roomId: string, payload: ChatRoom) {
  //   return firechat
  //     .doc(`${payload.roomType}/${roomId}`)
  //     .collection('members')
  //     .add({ [this.userId]: true });
  // }

  // // THIS METHOD CREATES USER CONVERSATION REF OBJECT
  // async createUserConversation(userId: string, payload: any) {
  //   return firechat
  //     .doc(`${ROOM_TYPES.USER_CONVERSATIONS}/${userId}`)
  //     .update({
  //       [payload.conversationType]: firestore.FieldValue.arrayUnion(
  //         payload.conversationId
  //       )
  //     })
  //     .catch((error) => {
  //       firechat.doc(`${ROOM_TYPES.USER_CONVERSATIONS}/${userId}`).set({
  //         [payload.conversationType]: [payload.conversationId]
  //       });
  //     });
  // }

  // THIS METHOD CREATES A NEW MESSAGE
  async sendMessage(chatId: string, message: MessageInterface) {
    const timestamp = new Date().toString();

    await firechat
      .collection(ROOM_TYPES.CONVERSATIONS)
      .doc(chatId.trim())
      .collection(ROOM_TYPES.CHATS)
      .doc(message._id)
      .set({
        ...message,
        replayCount: 0,
        createdAt: timestamp,
        updatedAt: timestamp
      });

    await firechat
      .collection(ROOM_TYPES.GROUPS)
      .doc(chatId.trim())
      .update({
        updatedAt: timestamp,
        displayMessage: message.text,
        unseenCount: firestore.FieldValue.increment(1)
      });
  }

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getUserConversations() {
    // get user chat history via userId
    const groups = await firechat
      .collection(ROOM_TYPES.USER_CONVERSATIONS)
      .doc(this.userId.trim())
      .get();

    if (!groups.exists) return null;

    return groups.data() as {
      groupMessages: string[];
      channelLists: string[];
      directMessages: string[];
    };
  }

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getUserDirectMessages(): Promise<FirebaseFirestoreTypes.Query | null> {
    // get user chat history via userId
    const groups = await this.getUserConversations();

    if (!groups) return null;

    const directMessages = groups?.directMessages;

    return firechat
      .collection(ROOM_TYPES.GROUPS)
      .where(firestore.FieldPath.documentId(), 'in', directMessages)
      .limit(30);
  }

  // THIS METHOD GETS USERS CONVERSATIONS
  async getUserGroupMessages(): Promise<FirebaseFirestoreTypes.Query | null> {
    // get user chat history via userId
    const groups = await this.getUserConversations();

    if (!groups) return null;

    const groupMessages = groups?.groupMessages;

    return firechat
      .collection(ROOM_TYPES.GROUPS)
      .where(firestore.FieldPath.documentId(), 'in', groupMessages)
      .limit(30);
  }

  // GET ROOM CHAT MESSAGES
  getChatMessages(chatId: string) {
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
