import React, { useEffect, useState } from 'react';
import Clipboard from '@react-native-community/clipboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeContext } from '../../theme';
import type { MessageActionSheetProps } from 'stream-chat-react-native-core/lib/typescript/src/components/Message/MessageSimple/MessageActionSheet';
import { Reaction } from 'stream-chat-expo';
import {
  Entypo,
} from '@expo/vector-icons';

import {
  ActionSheetButtonContainer,
  ActionSheetButtonText,
  ReactionItemContainer,
  ReactionItemText,
  ReactionListContainer,
  ReactionPickerContainer,
  MoreEmoji,
} from './styles';

type ReactionItemProps = {
  type: string;
  handleReaction: (type: string) => void;
  icon: string;
};

const MESSAGE_ACTIONS = {
  delete: 'delete',
  edit: 'edit',
  reactions: 'reactions',
  reply: 'reply',
  copy: 'copy'
};

export const MessageActionSheet = React.forwardRef(
  (props: MessageActionSheetProps, actionSheetRef) => {
    const {
      message,
      threadList,
      handleEdit,
      openThread,
      handleDelete,
      handleReaction,
      canEditMessage,
      repliesEnabled,
      canDeleteMessage,
      openReactionPicker,
      setActionSheetVisible,
      messageActions = Object.keys(MESSAGE_ACTIONS)
    } = props;

    const { colors } = useThemeContext();
    const insets = useSafeAreaInsets();
    const [options, setOptions] = useState([
      { id: 'cancel', title: 'Cancel', icon: 'cancel' }
    ]);

    const ActionSheetBottomMargin = insets.bottom > 0 ? insets.bottom : 10;

    useEffect(() => {
      const newOptions: {
        id: string;
        title: string;
        icon: string;
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

        if (messageActions.indexOf(MESSAGE_ACTIONS.copy) > -1) {
          newOptions.splice(1, 0, {
            id: MESSAGE_ACTIONS.copy,
            title: 'Copy Text',
            icon: 'content-copy'
          });
        }
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
        case MESSAGE_ACTIONS.copy:
          Clipboard.setString(message.text || '');
          break;
        default:
          break;
      }
      setActionSheetVisible(false);
    };

    const handleOpenReactionPicker = () => {
      props.setActionSheetVisible(false);
      setTimeout(() => {
        props.openReactionPicker();
      }, 100);
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
                name={option.icon}
                size={20}
                color={colors.PRIMARY}
              />
              <ActionSheetButtonText>{option.title}</ActionSheetButtonText>
            </ActionSheetButtonContainer>
          );
        })}
        ref={actionSheetRef as React.MutableRefObject<ActionSheet>}
        title={renderReactions((type) => {
          handleReaction(type);
          setActionSheetVisible(false);
        }, handleOpenReactionPicker, colors)}
        styles={{
          body: {
            backgroundColor: colors.WHITE,
            borderRadius: 50,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          },
          buttonBox: {
            alignItems: 'flex-start',
            height: 50,
            marginTop: 1,
            justifyContent: 'center',
            backgroundColor: colors.TRANSPARENT
          },
          cancelButtonBox: {
            display: 'none',
            marginBottom: ActionSheetBottomMargin
          },
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
          }
        }}
      />
    );
  }
);

export const renderReactions = (
  handleReaction: (type: string) => void,
  handleOpenReactionPicker: () => void,
  colors: any,
) => {
  const supportedReactions: Reaction[]=[
    {id: 'joy', icon: '😂'},
    {id: 'rage', icon: '😡'},
    {id: 'astonished', icon: '😲'},
    {id: 'heart', icon: '❤️'},
    {id: '100', icon: '💯'},
    {id: 'grinning', icon: '😀'},
  ]
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <ReactionListContainer>
      {supportedReactions.map((r, index) => (
        <ReactionItem
          key={index}
          type={r.id}
          icon={r.icon}
          handleReaction={handleReaction}
        />
      ))}
      <ReactionPickerContainer
        onPress={() => {
          handleOpenReactionPicker();
        }}
      >
        <MoreEmoji>+</MoreEmoji>
        <Entypo name='emoji-happy' color={colors.BLACK} size={20} />
      </ReactionPickerContainer>
    </ReactionListContainer>
  );
};

const ReactionItem = ({ type, handleReaction, icon }: ReactionItemProps) => {
  return (
    <ReactionItemContainer onPress={() => handleReaction(type)}>
      <ReactionItemText>{icon}</ReactionItemText>
    </ReactionItemContainer>
  );
};

MessageActionSheet.displayName = 'messageActionSheet';

