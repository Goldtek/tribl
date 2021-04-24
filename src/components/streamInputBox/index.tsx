import React, {
  useEffect,
  useCallback,
  useRef,
  useState,
  Fragment
} from 'react';
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
import { logEvent } from '../../utils/uxcamHelper';
import { Mixpanel } from '../../config';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { UserResponse } from 'stream-chat';
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import FastImage from 'react-native-fast-image';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import { PAGINATION_DEFAULT, GIHPY_DEFAULT_URL } from '../../constants';
import { useStreamContext } from '../../stream';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureResponderEvent, View, Keyboard } from 'react-native';
import { useThemeContext } from '../../theme';
import ENVIRONMENT_VARIABLES from '../../config';
import hexToRGB from '../../utils/hexToRGB';
import { chatClient, GiphyInterface } from '../../stream/types';
import Storage from '../../libs/storage';

import {
  Container,
  IconContainer,
  LoadingGiphys,
  LoadingWrapper,
  GifImageWrapper,
  ButtonContainer,
  OuterInputContainer,
  InnerInputContainer,
  SendButtonContainer,
  GifImageWrapperPlaceholder
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

const defaultGiphy = {
  data: [],
  pagination: { count: 0, offset: 0, total_count: 0 }
};

function StreamInputBox(props: InputProps) {
  const { bottom } = useSafeAreaInsets();
  const { colors } = useThemeContext();
  const { disabled = false } = props;
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
  const [searchQuery, setSearchQuery] = useState('');
  const { channel, activityScreen } = useStreamContext();
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);
  const [GIFs, setGIFs] = useState<GiphyInterface>(defaultGiphy);
  const [backupGif, setBackupGif] = useState<GiphyInterface>(defaultGiphy);

  const onChangeSearch = (query: string) => {
    if (!query) setGIFs(backupGif);
    setSearchQuery(query);
  };

  const sendMessage = () => {
    if (Boolean(channel.data?.isGroup)) {
      trackGroupMessages();
    } else if (Boolean(channel.data?.isDm)) {
      trackDirectMessages();
    } else {
      trackChannelMessages();
    }

    if (Boolean(channel.data?.isNew)) {
      channel.updatePartial({ set: { isNew: false } });
    }

    props.sendMessage();
  };

  const trackChannelMessages = () => {
    if (activityScreen === 'channelScreen') {
      logEvent('send channel message', { from: 'chat' });

      if (editing) {
        Mixpanel.track('User Edits Channel Message', {
          info: `User edits message on ${channel.data?.name} channel in ${channel.data?.community?.name} community`,
          'Activity Screen': 'Channel Message Screen'
        });
      } else {
        Mixpanel.track('User Sends Channel Message', {
          info: `User sends message on ${channel.data?.name} channel in ${channel.data?.community?.name} community`,
          'Activity Screen': 'Channel Message Screen'
        });
      }
    }

    if (activityScreen === 'channelThreadScreen') {
      logEvent('send channel thread message', { from: 'chat' });

      if (editing) {
        Mixpanel.track('User Edits Channel Thread Message', {
          info: `User edits message on ${channel.data?.name} channel thread in ${channel.data?.community?.name} community`,
          'Activity Screen': 'Channel Thread Message Screen'
        });
      } else
        Mixpanel.track('User Sends Channel Thread Message', {
          info: `User sends message on ${channel.data?.name} channel thread in ${channel.data?.community?.name} community`,
          'Activity Screen': 'Channel Thread Message Screen'
        });
    }
  };

  const trackDirectMessages = () => {
    const member = Object?.values(channel?.state?.members).find(
      ({ user }) => user?.id !== chatClient?.user?.id
    );

    if (activityScreen === 'directMessage') {
      logEvent('send direct message', { from: 'chat' });

      if (editing) {
        Mixpanel.track('User Edits Direct Message', {
          info: `User edits direct message sent to ${member?.user?.name}`,
          'Activity Screen': 'Direct Message Screen'
        });
      } else {
        Mixpanel.track('User Sends Channel Message', {
          info: `User sends direct message to ${member?.user?.name}`,
          'Activity Screen': 'Direct Message Screen'
        });
      }
    }

    if (activityScreen === 'directMessageThreadScreen') {
      logEvent('send message on DM thread screen', { from: 'chat' });

      if (editing) {
        Mixpanel.track('User Edits Message on DM Thread', {
          info: `User edits direct message sent to ${member?.user?.name} on DM thread`,
          'Activity Screen': 'Direct Message Thread Screen'
        });
      } else
        Mixpanel.track('User Sends Message on DM Thread', {
          info: `User sends direct message to ${member?.user?.name} on DM thread`,
          'Activity Screen': 'Direct Message Thread Screen'
        });
    }
  };

  const trackGroupMessages = () => {
    if (activityScreen === 'channelScreen') {
      logEvent('send group message', { from: 'chat' });

      if (editing) {
        Mixpanel.track('User Edits Group Message', {
          info: `User edits message on ${channel.data?.name} group`,
          'Activity Screen': 'Group Message Screen'
        });
      } else {
        Mixpanel.track('User Sends Channel Message', {
          info: `User sends message on ${channel.data?.name} group`,
          'Activity Screen': 'Group Message Screen'
        });
      }
    }

    if (activityScreen === 'channelThreadScreen') {
      logEvent('send group thread message', { from: 'chat' });

      if (editing) {
        Mixpanel.track('User Edits Group Thread Message', {
          info: `User edits message on ${channel.data?.name} group thread`,
          'Activity Screen': 'Group Thread Message Screen'
        });
      } else
        Mixpanel.track('User Sends Group Thread Message', {
          info: `User sends message on ${channel.data?.name} group thread`,
          'Activity Screen': 'Group Thread Message Screen'
        });
    }
  };

  const fetchGiphys = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();

    const uniqueMap: { [key: string]: string } = {};
    const uniqueArray = [];

    const possibleDuplicates = [...GIFs.data, ...data.data];

    for (let index = 0; index < possibleDuplicates.length; index++) {
      const giphy = possibleDuplicates[index];

      if (!uniqueMap[giphy.id]) {
        uniqueMap[giphy.id] = giphy.id;
        uniqueArray.push(giphy);
      }
    }

    setGIFs({ ...GIFs, ...data, data: uniqueArray });

    if (!searchQuery) {
      Storage.setGiphys({ ...GIFs, ...data, data: uniqueArray.slice(0, 20) });
      setBackupGif({ ...GIFs, ...data, data: uniqueArray });
    }

    setCallOnScrollEnd(false);
  };

  useEffect(() => {
    const getGiphyCache = async () => {
      const giphys = await Storage.getGiphys();

      if (!giphys) {
        return fetchGiphys(
          `${GIHPY_DEFAULT_URL}/gifs/trending?api_key=${ENVIRONMENT_VARIABLES.TRIBL_GIPHY_API_KEY}&limit=${PAGINATION_DEFAULT}`
        );
      }

      setGIFs({ ...GIFs, ...JSON.parse(giphys) });
    };

    getGiphyCache();
  }, []);

  const _renderFooter = useCallback(
    () =>
      callOnScrollEnd ? (
        <ActivityIndicator size="small" color={colors.RED} />
      ) : null,
    [callOnScrollEnd]
  );

  const handleEndReach = async () => {
    if (!callOnScrollEnd) return;

    fetchGiphys(
      searchQuery
        ? `${GIHPY_DEFAULT_URL}/gifs/search?api_key=${ENVIRONMENT_VARIABLES.TRIBL_GIPHY_API_KEY}&q=${searchQuery}&limit=${PAGINATION_DEFAULT}&offset=${GIFs.data.length}`
        : `${GIHPY_DEFAULT_URL}/gifs/trending?api_key=${ENVIRONMENT_VARIABLES.TRIBL_GIPHY_API_KEY}&limit=${PAGINATION_DEFAULT}&offset=${GIFs.data.length}`
    );
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    setGIFs(defaultGiphy);
  };

  useEffect(() => {
    if (!GIFs.data.length && searchQuery) {
      fetchGiphys(
        `${GIHPY_DEFAULT_URL}/gifs/search?api_key=${ENVIRONMENT_VARIABLES.TRIBL_GIPHY_API_KEY}&q=${searchQuery}&limit=${PAGINATION_DEFAULT}`
      );
    }
  }, [GIFs.data.length, searchQuery]);

  const openModal = () => {
    Keyboard.dismiss();
    modalizeRef.current?.open();
  };

  return (
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

      <Portal>
        <Modalize
          ref={modalizeRef}
          modalHeight={DEVICE_FULL_HEIGHT / 1.4}
          modalStyle={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            paddingTop: 20
          }}
          overlayStyle={{ backgroundColor: hexToRGB(colors.BLACK, 0.4) }}
          handlePosition="inside"
          HeaderComponent={
            <Searchbar
              placeholder="Search GIPHY"
              onChangeText={onChangeSearch}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              value={searchQuery}
              style={{
                borderRadius: 10,
                shadowOpacity: 0,
                marginHorizontal: 10,
                backgroundColor: colors.INPUT
              }}
            />
          }
          flatListProps={{
            data: GIFs.data,
            bounces: false,
            numColumns: 2,
            keyExtractor: (item: any) => `${item.id}_${item.url}`,
            onEndReachedThreshold: 0.01,
            ListFooterComponentStyle: { marginVertical: 20 },
            ListEmptyComponent: () => (
              <LoadingWrapper>
                <ActivityIndicator size="small" color={colors.RED} />
                <LoadingGiphys>Loading giphys...</LoadingGiphys>
              </LoadingWrapper>
            ),
            renderItem: ({ item }: any) => (
              <GifImageWrapper
                onPress={() => {
                  channel.sendMessage({
                    attachments: [
                      {
                        thumb_url: item.images.fixed_height.url,
                        type: 'giphy'
                      }
                    ]
                  });
                  Keyboard.dismiss();
                  modalizeRef.current?.close();
                }}
              >
                <Fragment>
                  <GifImageWrapperPlaceholder />
                  <FastImage
                    resizeMode={FastImage.resizeMode.stretch}
                    source={{
                      uri: item.images.preview_gif.url,
                      priority: FastImage.priority.high
                    }}
                    style={{ height: '100%' }}
                  />
                </Fragment>
              </GifImageWrapper>
            ),
            ListFooterComponent: _renderFooter,
            onEndReached: () => {
              if (GIFs.pagination.total_count > GIFs.data.length) {
                setCallOnScrollEnd(true);
              }
            },
            onMomentumScrollEnd: handleEndReach,
            style: { marginTop: 10 },
            contentContainerStyle: {
              justifyContent: 'center',
              paddingHorizontal: 10,
              paddingBottom: bottom + 20
            }
          }}
        />
      </Portal>
    </Container>
  );
}

export default React.memo(StreamInputBox);
