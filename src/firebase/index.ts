import firestore from '@react-native-firebase/firestore';

import { firechat, database, fireAuth } from './config';

import { ROOM_TYPES, ChatRoom } from './types';
import { GroupInterface } from '../screens/inbox/types';

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
  // async createRoom(roomId: string, payload: ChatRoom) {
  //   const timestamp = firestore.FieldValue.serverTimestamp();

  //   // get chat collection via roomID
  //   const chatroom = firechat.collection(payload.roomType).doc(roomId);

  //   // make a write batch for chatroom collection via roomId
  //   batch.set(
  //     chatroom,
  //     {
  //       members: { [this.userId]: true },
  //       createdAt: timestamp,
  //       updatedAt: timestamp
  //     },
  //     { merge: true }
  //   );

  //   const receivers = this.getUserConversations(payload);

  //   receivers.forEach((receiver) =>
  //     batch.set(receiver, { [payload.roomType]: [roomId] })
  //   );

  //   return batch.commit();
  // }

  // // THIS METHOD ADDS A NEW MEMBER TO CHANNEL OR GROUP
  // async addMemberToRoom(roomId: string, payload: ChatRoom) {
  //   return tribl
  //     .doc(`${payload.roomType}/${roomId}`)
  //     .collection('members')
  //     .add({ [this.userId]: true });
  // }

  // // THIS METHOD SENDS A NEW MESSAGE
  // async sendMessage(roomId: string, payload: ChatRoom) {
  //   const conversationRoom = tribl.doc(`${ROOM_TYPES.CONVERSATIONS}/${roomId}`);
  //   const timestamp = firestore.FieldValue.serverTimestamp();

  //   conversationRoom.update({
  //     displayMessage: 'Hello world',
  //     lastMessageTime: timestamp,
  //     unseenCount: 10
  //   });

  //   conversationRoom
  //     .collection('messages')
  //     .add({ ...payload, createdAt: timestamp });
  // }

  // // THIS METHOD GETS USERS CONVERSATIONS
  // getUserConversations(payload: ChatRoom) {
  //   // get user chat history via userId
  //   const userConversions = firechat
  //     .collection(ROOM_TYPES.USER_CONVERSATIONS)
  //     .doc(this.userId);

  //   // get receiver chat history via receiverId
  //   const receiverConversions = payload.receivers?.map((receiver) =>
  //     firechat.collection(ROOM_TYPES.USER_CONVERSATIONS).doc(receiver)
  //   ) as FirebaseFirestoreTypes.DocumentReference[];

  //   return [userConversions, ...receiverConversions];
  // }

  // // THIS METHOD CREATES USER CONVERSATION REF OBJECT
  // async createUserConversation(userId: string, payload: UserConversation) {
  //   return tribl
  //     .doc(`${ROOM_TYPES.CHANNELS}/${userId}`)
  //     .update({
  //       [payload.conversationType]: firestore.FieldValue.arrayUnion(
  //         payload.conversationId
  //       )
  //     })
  //     .catch((error) => {
  //       tribl.doc(`${ROOM_TYPES.CHANNELS}/${userId}`).set({
  //         [payload.conversationType]: [payload.conversationId]
  //       });
  //     });
  // }

  // USER ONLINE STATUS METHOD TO TRACK USER PRESENCE
  async onlineStatus(userId: string) {
    const userStatusRef = database.ref(`/status/${userId}`);

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

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getUserConversations() {
    // get user chat history via userId
    const groups = await firechat
      .collection(ROOM_TYPES.USER_CONVERSATIONS)
      .doc(this.userId)
      .get();

    if (!groups.exists) return null;

    return groups.data() as {
      groupMessages: string[];
      channelLists: string[];
      directMessages: string[];
    };
  }

  // THIS METHOD GETS USERS DIRECT MESSAGES
  async getUserDirectMessages() {
    // get user chat history via userId
    const groups = await this.getUserConversations();

    if (!groups) return null;

    const directMessages = groups?.directMessages;

    const directMessagesData = await firechat
      .collection(ROOM_TYPES.GROUPS)
      .where(firestore.FieldPath.documentId(), 'in', directMessages)
      .get();

    const userDirectMessages = directMessagesData.docs.map(
      (directDm) => directDm.data() as GroupInterface
    );

    return userDirectMessages;
  }

  // THIS METHOD GETS USERS CONVERSATIONS
  async getUserGroupMessages(): Promise<GroupInterface[] | null> {
    // get user chat history via userId
    const groups = await this.getUserConversations();

    if (!groups) return null;

    const groupMessages = groups?.groupMessages;

    const groupMessagesData = await firechat
      .collection(ROOM_TYPES.GROUPS)
      .where(firestore.FieldPath.documentId(), 'in', groupMessages)
      .get();

    const userGroup = groupMessagesData.docs.map(
      (group) => group.data() as GroupInterface
    );

    return userGroup;
  }

  // USER ONLINE STATUS METHOD TO TRACK USER PRESENCE
  async getChatMessages(chatId: string) {
    const chatMessages = await firechat
      .doc(ROOM_TYPES.CONVERSATIONS)
      .collection(chatId)
      .doc('messages')
      .get();

    const messages = chatMessages.data();

    console.tron({ messages });
  }
}

export default new Firechat();
