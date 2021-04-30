import React, { useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView } from 'react-native';

import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { ActivityIndicator, TouchableRipple } from 'react-native-paper';

import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../../../theme';
import {
  Container,
  HeaderTitle,
  SubjectInput,
  HeaderAction,
  LoaderMessage,
  InputContainer,
  ContentWrapper,
  HeaderContainer,
  HeaderActionText,
  ModalContentWrapper,
  Overlay
} from './styles';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { crashlytics } from '../../../../firebase/config';
import { chatClient } from '../../../../stream/types';

export default function EditGroupName(props: any) {
  const { channel, user, isAdmin, displayEdit } = props;
  const insets = useSafeAreaInsets();
  const { colors } = useThemeContext();
  const [subject, setSubject] = useState(channel.data?.name);
  const [loader, setLoader] = useState(false);
  const closeModal = () => props.modalizeRef.current?.close();

  const updateGroupName = async () => {
    if (isAdmin && displayEdit) {
      try {
        setLoader(true);

        await channel.updatePartial({ set: { name: subject } });
        await channel.sendMessage({
          text: `${
            chatClient.user?.name?.split(' ')[0]
          } changed the subject to ${subject}`,
          group_system: true,
          receiver: {
            id: `${user?.id}`,
            name: `${user?.name}`,
            image: `${user?.image}`
          }
        });

        setLoader(false);
        closeModal();
      } catch (error) {
        setLoader(false);
        crashlytics.recordError(new Error(error));
        crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
      }
    }
  };

  return (
    <SafeAreaView>
      <Portal>
        <Modalize
          ref={props.modalizeRef}
          modalHeight={DEVICE_FULL_HEIGHT}
          modalStyle={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingBottom: 20,
            paddingTop: insets.top,
            backgroundColor: colors.WHITE
          }}
          childrenStyle={{ paddingBottom: insets.bottom }}
          handlePosition="inside"
          panGestureEnabled={false}
        >
          <Container>
            <HeaderContainer>
              <TouchableRipple
                onPress={closeModal}
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
              <HeaderTitle>Edit Group Subject</HeaderTitle>
              <ContentWrapper style={{ flex: 1, paddingHorizontal: 0 }}>
                <HeaderAction
                  onPress={updateGroupName}
                  disabled={!Boolean(subject)}
                >
                  <HeaderActionText selectedParticipants={Boolean(subject)}>
                    Save
                  </HeaderActionText>
                </HeaderAction>
              </ContentWrapper>
            </HeaderContainer>
            <InputContainer>
              <SubjectInput
                autoFocus
                placeholder="Type new group subject here..."
                value={subject}
                onChangeText={(text) => setSubject(text)}
              />
            </InputContainer>
          </Container>
        </Modalize>
      </Portal>
      <Modal
        animationType="fade"
        onRequestClose={() => setLoader(false)}
        visible={loader}
        transparent
      >
        <Overlay>
          <ModalContentWrapper>
            <ActivityIndicator size="large" color={colors.BLACK} />
            <LoaderMessage>Renaming group...</LoaderMessage>
          </ModalContentWrapper>
        </Overlay>
      </Modal>
    </SafeAreaView>
  );
}
