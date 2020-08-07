import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavigationInterface } from '../../types';
import { Button, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { Ionicons } from '@expo/vector-icons';
import { IMessage } from './types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }
      }
    ]);
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <GiftedChat
        placeholder="Start typing ..."
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              width: RFValue(35),
              height: RFValue(35),
              backgroundColor: colors.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: RFValue(35 / 2),
              marginRight: 10,
              marginBottom: 5
            }}
          >
            <Ionicons name="ios-send" color={colors.WHITE} size={RFValue(25)} />
          </Send>
        )}
        textInputProps={{
          style: {
            flex: 1,
            // height: RFValue(40),
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            paddingLeft: 10,
            paddingRight: 10,
            color: colors.PRIMARY_TEXT,
            borderColor: colors.GREY,
            borderTopWidth: 1
          }
        }}
      />

      {Platform.select({
        android: (
          <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={RFValue(90)}
          />
        )
      })}
    </SafeAreaView>
  );
}
