import React, { useEffect, useState } from 'react';

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { StyleSheet, Text, View } from 'react-native';

import styled from 'styled-components/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

// import Clipboard from '@react-native-community/clipboard';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType
} from './types';
import { useThemeContext } from '../../theme';

const MESSAGE_ACTIONS = {
  delete: 'delete',
  edit: 'edit',
  reactions: 'reactions',
  reply: 'reply',
  copy: 'copy'
};

export const emojiData = [
  {
    icon: '👍',
    id: 'like'
  },
  {
    icon: '❤️️',
    id: 'love'
  },
  {
    icon: '😂',
    id: 'haha'
  },
  {
    icon: '😮',
    id: 'wow'
  },
  {
    icon: '😔',
    id: 'sad'
  },
  {
    icon: '😠',
    id: 'angry'
  }
];

const ActionSheetButtonContainer = styled.View`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.WHITE};
  height: 50px;
  width: 100%;
  flex-direction: row;
  padding-horizontal: 20px;
  ${({ theme }) => theme.message.actionSheet.buttonContainer.css};
`;

const ActionSheetButtonText = styled.Text`
  color: #388cea;
  font-size: 16px;
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.PRIMARY};
  ${({ theme }) => theme.message.actionSheet.buttonText.css};
`;

export type ActionSheetStyles = {
  body?: StyleProp<ViewStyle>;
  buttonBox?: StyleProp<ViewStyle>;
  buttonText?: StyleProp<TextStyle>;
  cancelButtonBox?: StyleProp<ViewStyle>;
  messageBox?: StyleProp<ViewStyle>;
  messageText?: StyleProp<TextStyle>;
  overlay?: StyleProp<TextStyle>;
  titleBox?: StyleProp<ViewStyle>;
  titleText?: StyleProp<TextStyle>;
  wrapper?: StyleProp<ViewStyle>;
};

export type MessageActionSheetProps<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = {
  /**
   * Handler to delete a current message
   */
  handleDelete: () => Promise<void>;
  /**
   * Handler to edit a current message. This function sets the current message as the `editing` property of channel context.
   * The `editing` prop is used by the MessageInput component to switch to edit mode.
   */
  handleEdit: () => void;
  handleReaction: (reactionType: string) => Promise<void>;
  // message: InsertDatesMessage<At, Ch, Co, Ev, Me, Re, Us>;
  /**
   * Function that opens the reaction picker
   */
  openReactionPicker: () => Promise<void>;
  /**
   * Function that opens a thread and gives the option to add a reply on a message
   */
  openThread: () => void;
  /**
   * Whether or not message reactions are enabled
   */
  reactionsEnabled: boolean;
  /**
   * The action sheet ref declared in MessageContent. To access the ref, ensure the ActionSheet custom
   * component is wrapped in `React.forwardRef`.
   */
  ref: React.MutableRefObject<ActionSheet | undefined>;
  /**
   * Whether or not message replies are enabled
   */
  repliesEnabled: boolean;
  /**
   * React useState hook setter function that toggles action sheet visibility
   */
  setActionSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  // supportedReactions: Reaction[];
  /**
   * Style object for action sheet (used to style message actions)
   * Supported styles: https://github.com/beefe/react-native-actionsheet/blob/master/lib/styles.js
   */
  actionSheetStyles?: ActionSheetStyles;
  /**
   * Function that returns a boolean indicating whether or not the user can delete the message.
   */
  canDeleteMessage?: () => boolean | undefined;
  /**
   * Function that returns a boolean indicating whether or not the user can edit the message.
   */
  canEditMessage?: () => boolean | undefined;
  /**
   * Array of allowed actions on message. e.g. ['edit', 'delete', 'reactions', 'reply']
   * If all the actions need to be disabled, empty array or false should be provided as value of prop.
   */
  messageActions?: boolean | string[];
  /**
   * Whether or not the MessageList is part of a Thread
   */
  threadList?: boolean;
};

export const MessageActionSheet = React.forwardRef(
  (props: MessageActionSheetProps, actionSheetRef) => {
    const {
      canDeleteMessage,
      canEditMessage,
      handleDelete,
      handleEdit,
      messageActions = Object.keys(MESSAGE_ACTIONS),
      openReactionPicker,
      openThread,
      handleReaction,
      repliesEnabled,
      setActionSheetVisible,
      threadList
    } = props;

    const { colors } = useThemeContext();

    const [options, setOptions] = useState([{ id: 'cancel', title: 'Cancel' }]);

    useEffect(() => {
      const newOptions: {
        id: string;
        title: string;
        icon?: string;
        handler?: any;
      }[] = [];

      if (Array.isArray(messageActions)) {
        if (
          repliesEnabled &&
          messageActions.indexOf(MESSAGE_ACTIONS.reply) > -1 &&
          !threadList
        ) {
          newOptions.splice(1, 0, {
            id: MESSAGE_ACTIONS.reply,
            title: 'Reply to Thread',
            icon: 'message-reply-text'
          });
        }

        if (
          messageActions.indexOf(MESSAGE_ACTIONS.edit) > -1 &&
          canEditMessage?.()
        ) {
          newOptions.splice(1, 0, {
            id: MESSAGE_ACTIONS.edit,
            title: 'Edit Message',
            icon: 'pencil'
          });
        }

        if (
          messageActions.indexOf(MESSAGE_ACTIONS.delete) > -1 &&
          canDeleteMessage?.()
        ) {
          newOptions.splice(1, 0, {
            id: MESSAGE_ACTIONS.delete,
            title: 'Delete Message',
            icon: 'trash-can-outline'
          });
        }

        // if (messageActions.indexOf(MESSAGE_ACTIONS.copy) > -1) {
        //   newOptions.splice(1, 0, {
        //     id: MESSAGE_ACTIONS.copy,
        //     title: 'Copy Text',
        //     handler: () => {
        //       Clipboard.setString('message');
        //     },
        //     icon: 'content-copy'
        //   });
        // }
      }

      setOptions((prevOptions) => [...prevOptions, ...newOptions]);
    }, []);

    const onActionPress = async (action: string) => {
      switch (action) {
        case MESSAGE_ACTIONS.edit:
          handleEdit();
          break;
        case MESSAGE_ACTIONS.delete:
          await handleDelete();
          break;
        case MESSAGE_ACTIONS.reply:
          openThread();
          break;
        case MESSAGE_ACTIONS.reactions:
          openReactionPicker();
          break;
        default:
          break;
      }
      setActionSheetVisible(false);
    };

    return (
      <ActionSheet
        cancelButtonIndex={0}
        destructiveButtonIndex={0}
        onPress={(index) => onActionPress(options[index].id)}
        options={options.map((option, i) => {
          return (
            <ActionSheetButtonContainer
              key={option.title}
              testID={`action-sheet-item-${option.title}`}
            >
              <MaterialCommunityIcons
                // @ts-ignore
                name={option.icon}
                size={20}
                color={colors.PRIMARY}
              />
              <ActionSheetButtonText>{option.title}</ActionSheetButtonText>
            </ActionSheetButtonContainer>
          );
        })}
        ref={actionSheetRef as React.MutableRefObject<ActionSheet>}
        title={renderReactions((type: any) => {
          handleReaction(type);
          setActionSheetVisible(false);
        })}
        styles={{
          body: {
            backgroundColor: colors.WHITE,
            borderRadius: 50
          },
          buttonBox: {
            alignItems: 'flex-start',
            height: 50,
            marginTop: 1,
            justifyContent: 'center',
            backgroundColor: colors.TRANSPARENT
          },
          buttonText: {},
          cancelButtonBox: {
            display: 'none'
          },
          messageBox: {},
          messageText: {},
          overlay: {},
          titleBox: {
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.WHITE,
            borderBottomColor: colors.PRIMARY,
            borderBottomWidth: 1,
            padding: 15,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          },

          titleText: {},
          wrapper: {}
        }}
      />
    );
  }
);

export const renderReactions = (handleReaction: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const reactions = emojiData;
  return (
    <View style={styles.reactionListContainer}>
      {reactions.map((r, index) => (
        <ReactionItem
          key={index}
          type={r.id}
          icon={r.icon}
          handleReaction={handleReaction}
        />
      ))}
    </View>
  );
};

const ReactionItem = ({ type, handleReaction, icon }: any) => {
  const { colors } = useThemeContext();
  return (
    <View
      key={type}
      style={[
        styles.reactionItemContainer,
        {
          borderColor: 'transparent',
          backgroundColor: colors.WHITE
        }
      ]}
    >
      <Text
        onPress={() => {
          handleReaction(type);
        }}
        style={[
          styles.reactionItem,
          {
            color: colors.PRIMARY
          }
        ]}
      >
        {icon}
      </Text>
    </View>
  );
};

MessageActionSheet.displayName = 'messageActionSheet';

const styles = StyleSheet.create({
  reactionListContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 30,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reactionItemContainer: {
    borderWidth: 1,
    padding: 3,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reactionItem: {
    fontSize: 28
  },
  reactionPickerContainer: {
    padding: 4,
    paddingLeft: 8,
    paddingRight: 6,
    borderRadius: 10
  }
});
