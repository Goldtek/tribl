import React, { useEffect, useRef, useState } from 'react';
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
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { UserResponse } from 'stream-chat';
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import {
  FlatList,
  GestureResponderEvent,
  View,
  ActivityIndicator
} from 'react-native';
import { Text } from 'react-native';
import { useThemeContext } from '../../theme';

import {
  Container,
  IconContainer,
  ButtonContainer,
  OuterInputContainer,
  InnerInputContainer,
  SendButtonContainer,
  InputWrapper,
  GifContainer,
  GifImageWrapper,
  HeaderWrapper
} from './styles';
import { StatusBar } from 'expo-status-bar';
import { DEVICE_FULL_HEIGHT, DEVICE_FULL_WIDTH } from '../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { Searchbar } from 'react-native-paper';
import { PAGINATION_DEFAULT } from '../../constants';

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
  const { colors, fonts } = useThemeContext();
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
  const modalizeRef = useRef<Modalize>(null);
  const [gif, setGif] = useState([] as any);
  const [backupGif, setBackupGif] = useState([] as any);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query: string) => {
    if (query === '') setGif(backupGif);
    setSearchQuery(query);
  };

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=zx2JFMr82HSMvceaNeHZwgWFSr9jqioH&limit=${2}`
    )
      .then((response) => response.json())
      .then((data) => {
        setGif(data.data);
        setBackupGif(data.data);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=zx2JFMr82HSMvceaNeHZwgWFSr9jqioH&q=${searchQuery}&limit=${2}`
    )
      .then((response) => response.json())
      .then((data) => {
        setGif(data.data);
        setLoading(false);
      });
  };
  const openModal = () => modalizeRef.current?.open();

  return (
    <InputWrapper>
      <Container>
        <OuterInputContainer>
          <InnerInputContainer>
            <IconContainer
              borderColor={colors.STATUS_BAR_COLOR}
              onPress={openModal}
            >
              <MaterialIcons
                name="gif"
                size={25}
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

      <Portal>
        <StatusBar translucent animated style="light" />
        <Modalize
          ref={modalizeRef}
          modalStyle={{
            height: DEVICE_FULL_HEIGHT / 2,
            paddingTop: RFValue(30),
            paddingBottom: RFValue(20),
            marginTop: RFValue(90),
            width: DEVICE_FULL_WIDTH
          }}
          HeaderComponent={
            <HeaderWrapper>
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  lineHeight: 20,
                  marginBottom: RFValue(10)
                }}
              >
                Select a Gif
              </Text>
              <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                onSubmitEditing={handleSearch}
                // blurOnSubmit
              />
            </HeaderWrapper>
          }
        >
          <ActivityIndicator
            animating={loading}
            size="large"
            color={colors.RED}
          />
          <GifContainer>
            <FlatList
              data={gif || []}
              keyExtractor={({ id }) => id}
              numColumns={2}
              horizontal={false}
              // columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 5 }}
              renderItem={({ item }) => (
                <GifImageWrapper
                  onPress={(e) => console.tron('Stream Context', e)}
                >
                  <FastImage
                    resizeMode={FastImage.resizeMode.cover}
                    source={{
                      uri: item.images.original.url,
                      priority: FastImage.priority.high
                    }}
                    style={{
                      height: RFValue(150),
                      borderRadius: RFValue(2)
                    }}
                  />
                </GifImageWrapper>
              )}
            />
          </GifContainer>
        </Modalize>
      </Portal>
    </InputWrapper>
  );
}

export default React.memo(StreamInputBox);
