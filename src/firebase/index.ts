import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import fireauth from '@react-native-firebase/auth';
import oldDatabase from '@react-native-firebase/database';
import { ROOM_TYPES, ChatRoom, UserConversation } from './types';

const database = firestore();
const auth = fireauth();
const tribl = database.collection('tribl-chat-app');
const batch = database.batch();

// ------ Setup -------- //

export default class Firechat {
  constructor() {}

  async signIn(firebaseToken: string) {
    return auth.signInWithCustomToken(firebaseToken);
  }

  // THIS METHOD CREATES A CHANNEL AND GROUP
  async createRoom(roomId: string, payload: ChatRoom) {
    const timestamp = firestore.FieldValue.serverTimestamp();

    // get chat collection via roomID
    const chatroom = database.collection(payload.roomType).doc(roomId);

    // make a write batch for chatroom collection via roomId
    batch.set(
      chatroom,
      {
        members: { [payload.userId]: true },
        createdAt: timestamp,
        updatedAt: timestamp
      },
      { merge: true }
    );

    const receivers = this.getUserConversations(payload);

    receivers.forEach((receiver) =>
      batch.set(receiver, { [payload.roomType]: [roomId] })
    );

    return batch.commit();
  }

  // THIS METHOD ADDS A NEW MEMBER TO CHANNEL OR GROUP
  async addMemberToRoom(roomId: string, payload: ChatRoom) {
    return tribl
      .doc(`${payload.roomType}/${roomId}`)
      .collection('members')
      .add({ [payload.userId]: true });
  }

  // THIS METHOD SENDS A NEW MESSAGE
  async sendMessage(roomId: string, payload: ChatRoom) {
    const conversationRoom = tribl.doc(`${ROOM_TYPES.CONVERSATIONS}/${roomId}`);
    const timestamp = firestore.FieldValue.serverTimestamp();

    conversationRoom.update({
      displayMessage: 'Hello world',
      lastMessageTime: timestamp,
      unseenCount: 10
    });

    conversationRoom
      .collection('messages')
      .add({ ...payload, createdAt: timestamp });
  }

  // THIS METHOD GETS USERS CONVERSATIONS
  getUserConversations(payload: ChatRoom) {
    // get user chat history via userId
    const userConversions = database
      .collection(ROOM_TYPES.USER_CONVERSATIONS)
      .doc(payload.userId);

    // get receiver chat history via receiverId
    const receiverConversions = payload.receivers?.map((receiver) =>
      database.collection(ROOM_TYPES.USER_CONVERSATIONS).doc(receiver)
    ) as FirebaseFirestoreTypes.DocumentReference[];

    return [userConversions, ...receiverConversions];
  }

  // THIS METHOD CREATES USER CONVERSATION REF OBJECT
  async createUserConversation(userId: string, payload: UserConversation) {
    return tribl
      .doc(`${ROOM_TYPES.CHANNELS}/${userId}`)
      .update({
        [payload.conversationType]: firestore.FieldValue.arrayUnion(
          payload.conversationId
        )
      })
      .catch((error) => {
        tribl.doc(`${ROOM_TYPES.CHANNELS}/${userId}`).set({
          [payload.conversationType]: [payload.conversationId]
        });
      });
  }

  // USER ONLINE STATUS METHOD TO TRACK USER PRESENCE
  async onlineStatus(userId: string) {
    const userStatusRef = oldDatabase().ref(`/status/${userId}`);

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
