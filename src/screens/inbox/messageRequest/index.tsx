import React, { useState, useEffect, useCallback } from 'react';
import { NavigationInterface } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { MessageInterface } from '../types';
import { fireAuth } from '../../../firebase/config';
import { Text, Button } from 'react-native-paper';
import Firechat from '../../../firebase';
import { MyPassportInterface } from '../../../graphql/types';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { useQuery } from '@apollo/react-hooks';

import { Container, Cover, TextContainer, RequestContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: { title: string; avatar: string; chatId: string };
  };
}

export default function ChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const { chatId } = props.route.params;

  const userId = fireAuth.currentUser?.uid as string;

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const userDetails = userData?.myPassport;

  const [messages, setMessages] = useState<MessageInterface[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const chatMessages = Firechat.getChatMessages(chatId);

    const unsubscribe = chatMessages.onSnapshot({
      next: (snapshot) => {
        const conversations = snapshot.docs.map((documentSnapshot) => {
          return documentSnapshot.data() as MessageInterface;
        });

        setMessages(conversations);
      }
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (messages: MessageInterface[] = []) => {
    const [message] = messages;
    await Firechat.sendMessage(chatId, message);
  }, []);

  return (
    <Container>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
        {/* <GiftedChat
        placeholder="Start typing ..."
        messages={messages}
        user={{
          _id: userId,
          avatar: userDetails?.avatar,
          name: `${userDetails?.firstName} ${userDetails?.lastName}`
        }}
        alwaysShowSend
        onSend={onSend}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              width: RFValue(40),
              height: RFValue(40),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.PRIMARY,
              borderRadius: RFValue(40 / 2),
              marginRight: 10,
              marginVertical: 5
            }}
          >
            <Ionicons name="ios-send" color={colors.WHITE} size={RFValue(20)} />
          </Send>
        )}
        listViewProps={{ style: { marginBottom: RFValue(20) } }}
        textInputProps={{
          style: {
            flex: 1,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: Platform.select({ ios: RFValue(12) }),
            paddingBottom: Platform.select({ ios: RFValue(12) }),
            color: colors.PRIMARY_TEXT,
            borderRadius: 5,
            marginHorizontal: 10,
            marginVertical: 5,
            borderWidth: 1,
            borderColor: colors.INACTIVE
          }
        }}
      /> */}
      </SafeAreaView>
      <RequestContainer>
        <TextContainer>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              paddingBottom: RFValue(7)
            }}
          >
            Amakiri Joseph wants to message you.
          </Text>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              paddingBottom: RFValue(10)
            }}
          >
            0 Communities 2 Connections
          </Text>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              paddingBottom: RFValue(10)
            }}
          >
            if you accept, they will also be to see info such as your activity
            status and when you've seen messages.
          </Text>
        </TextContainer>

        <Cover>
          <Button
            onPress={() => {}}
            mode="text"
            labelStyle={{
              color: colors.RED,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
          >
            block
          </Button>
          <Button
            onPress={() => {}}
            mode="text"
            labelStyle={{
              color: colors.RED,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
          >
            delete
          </Button>
          <Button
            onPress={() => {}}
            mode="text"
            labelStyle={{
              color: colors.PRIMARY,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
          >
            accept
          </Button>
        </Cover>
      </RequestContainer>
    </Container>
  );
}
