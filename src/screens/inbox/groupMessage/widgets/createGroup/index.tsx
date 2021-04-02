import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { TouchableRipple, Title, ActivityIndicator } from 'react-native-paper';
import { ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import { NavigationInterface } from '../../../../types';
import { HeaderActionText } from '../../styles';
import { v4 as uuid } from 'uuid';
import { USER_DEFAULT_AVATAR } from '../../../../../constants';
import { PassportInterface } from '../../../../../graphql/types';
import { crashlytics } from '../../../../../firebase/config';
import { chatClient } from '../../../../../stream/types';
import { useStreamContext } from '../../../../../stream';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  HeaderAction,
  HeaderContainer,
  HeaderTitle,
  SelectedMemberContainer,
  SelectedMemberWrapper,
  InputContainer,
  SubjectInput,
  ContentWrapper,
  Overlay,
  LoaderMessage
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: { participants: { [key: string]: PassportInterface } } };
}

export default function CreateGroup(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { setChannel } = useStreamContext();

  const { navigation, route } = props;
  const { participants } = route.params;
  const [subject, setSubject] = useState('');
  const [loader, setLoader] = useState(false);

  const selectedItem = Object.values(participants);

  const createGroup = async () => {
    if (!subject) return;

    setLoader(true);

    const channelId = uuid();

    try {
      const channel = chatClient.channel('team', channelId, {
        conversationId: channelId,
        channelId: channelId,
        members: [
          ...selectedItem.map(({ id }) => id),
          `${chatClient.user?.id}`
        ],
        messageRequest: { status: false },
        // @ts-ignore
        sender: {
          id: `${chatClient.user?.id}`,
          ...chatClient.user?.user,
          readAt: new Date()
        },
        // @ts-ignore
        receiver: {
          id: `${chatClient.user?.id}`,
          ...chatClient.user?.user,
          readAt: new Date()
        },
        name: subject,
        isDm: false,
        isNew: false,
        isGroup: true
      });

      await channel.create();
      setChannel(channel);

      const channelMessages = selectedItem.map(({ firstName, lastName, id }) =>
        channel.sendMessage({
          text: `${firstName} was added by ${chatClient.user?.user.firstName}`,
          group_system: true,
          receiver: { firstName, lastName, id }
        })
      );

      await Promise.all(channelMessages);
      setLoader(false);

      //@ts-ignore
      navigation.navigate('DirectChatScreen', {
        channelId: `${channel?.id}`,
        title: subject
      });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container>
        <HeaderContainer>
          <TouchableRipple
            onPress={navigation.goBack}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RFValue(40 / 2)
            }}
          >
            <Ionicons
              name="md-arrow-back"
              size={RFValue(24)}
              color={colors.PRIMARY}
            />
          </TouchableRipple>
          <HeaderTitle>New Group</HeaderTitle>
          <ContentWrapper style={{ flex: 1, paddingHorizontal: 0 }}>
            <HeaderAction onPress={createGroup}>
              <HeaderActionText>Done</HeaderActionText>
            </HeaderAction>
          </ContentWrapper>
        </HeaderContainer>

        <ContentWrapper>
          <InputContainer>
            <SubjectInput
              placeholder="Type group Subject here..."
              value={subject}
              onChangeText={(text) => setSubject(text)}
            />
          </InputContainer>
          <Title
            style={{ fontSize: RFValue(12), marginBottom: 5, marginTop: 10 }}
          >
            Participants
          </Title>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexGrow: 1,
              paddingBottom: 20,
              flexWrap: 'wrap'
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {selectedItem.map((item) => (
              <SelectedMemberWrapper key={item.id}>
                <SelectedMemberContainer>
                  <FastImage
                    resizeMode={FastImage.resizeMode.stretch}
                    source={{
                      uri: item.avatar || USER_DEFAULT_AVATAR,
                      priority: FastImage.priority.high
                    }}
                    style={{
                      width: RFValue(40),
                      height: RFValue(40),
                      borderRadius: 4
                    }}
                  />
                  <Title
                    numberOfLines={1}
                    style={{
                      color: colors.BLACK,
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      fontSize: RFValue(10)
                    }}
                  >
                    {item.firstName} {item.lastName}
                  </Title>
                </SelectedMemberContainer>
              </SelectedMemberWrapper>
            ))}
          </ScrollView>
        </ContentWrapper>
      </Container>
      <Modal
        animationType="fade"
        onRequestClose={() => setLoader(false)}
        transparent
        visible={loader}
      >
        <Overlay>
          <ActivityIndicator size="large" color={colors.WHITE} />
          <LoaderMessage>Creating Group...</LoaderMessage>
        </Overlay>
      </Modal>
    </SafeAreaView>
  );
}
