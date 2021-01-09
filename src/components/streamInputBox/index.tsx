import React from 'react';
import {
  AutoCompleteInput,
  AutoCompleteInputProps,
  FileUploadPreviewProps,
  ImageUploadPreviewProps,
  DefaultAttachmentType,
  DefaultReactionType,
  DefaultMessageType,
  DefaultUserType,
  DefaultEventType,
  DefaultChannelType,
  DefaultCommandType,
  useMessagesContext
} from 'stream-chat-expo';
import { UserResponse } from 'stream-chat';
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';
import type { GestureResponderEvent, View } from 'react-native';
import { useThemeContext } from '../../theme';

import {
  Container,
  IconContainer,
  ButtonContainer,
  OuterInputContainer,
  InnerInputContainer,
  SendButtonContainer
} from './styles';

export type SendButtonProps = {
  /** Disables the button */
  disabled?: boolean;
  /** Function that sends message */
  sendMessage?: (event: GestureResponderEvent) => void;
};

type InputProps = AutoCompleteInputProps<
  DefaultCommandType,
  DefaultUserType
> & {
  _pickFile: () => Promise<void>;
  _pickImage: () => Promise<void>;
  _removeFile: FileUploadPreviewProps['removeFile'];
  _removeImage: ImageUploadPreviewProps['removeImage'];
  _uploadFile: FileUploadPreviewProps['retryUpload'];
  _uploadImage: ImageUploadPreviewProps['retryUpload'];
  appendText: (newText: string) => void;
  closeAttachActionSheet: () => void;
  disabled: boolean;
  getUsers: () => UserResponse<DefaultUserType>[];
  handleOnPress: () => Promise<void>;
  isValidMessage: () => boolean;
  onSelectItem: (item: UserResponse<DefaultUserType>) => void;
  sendMessage: () => Promise<void>;
  setInputBoxContainerRef: (ref: View | null) => void;
  updateMessage: () => Promise<void>;
  uploadNewFile: (file: {
    name: string;
    size?: number | string;
    type?: string;
    uri?: string;
  }) => Promise<void>;
  uploadNewImage: (image: { uri?: string }) => Promise<void>;
};

function StreamInputBox(props: InputProps) {
  const { colors } = useThemeContext();
  const { disabled = false, sendMessage } = props;
  const { editing } = useMessagesContext<
    DefaultAttachmentType,
    DefaultChannelType,
    DefaultCommandType,
    DefaultEventType,
    DefaultMessageType,
    DefaultReactionType,
    DefaultUserType
  >();

  return (
    <Container>
      <OuterInputContainer>
        <InnerInputContainer>
          <IconContainer onPress={() => {}}>
            <Entypo
              name="emoji-happy"
              size={18}
              color={colors.STATUS_BAR_COLOR}
            />
          </IconContainer>
          <AutoCompleteInput {...props} />
          <IconContainer onPress={props._pickFile} style={{ marginRight: 0 }}>
            <Entypo
              name="attachment"
              size={18}
              color={colors.STATUS_BAR_COLOR}
            />
          </IconContainer>
          <IconContainer
            onPress={props._pickImage}
            style={{ marginHorizontal: 5 }}
          >
            <FontAwesome
              name="camera"
              size={18}
              color={colors.STATUS_BAR_COLOR}
            />
          </IconContainer>
        </InnerInputContainer>
      </OuterInputContainer>

      <SendButtonContainer>
        <ButtonContainer
          disabled={disabled}
          onPress={sendMessage}
          testID="send-button"
        >
          {editing ? (
            <Entypo name="edit" size={20} color={colors.WHITE} />
          ) : (
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={colors.WHITE}
            />
          )}
        </ButtonContainer>
      </SendButtonContainer>
    </Container>
  );
}

export default React.memo(StreamInputBox);
