import React, { useEffect, useState } from 'react';

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import { StyleSheet, Text, View } from 'react-native';

import styled from 'styled-components/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Clipboard from '@react-native-community/clipboard';

import { useThemeContext } from '../../theme';

import type { MessageActionSheetProps } from 'stream-chat-react-native-core/lib/typescript/src/components/Message/MessageSimple/MessageActionSheet';

const MESSAGE_ACTIONS = {
  delete: 'delete',
  edit: 'edit',
  reactions: 'reactions',
  reply: 'reply',
  copy: 'copy'
};

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
      message,
      setActionSheetVisible,
      threadList,
      supportedReactions
    } = props;

    console.tron('action sheet props', props);
    const { colors } = useThemeContext();

    const [options, setOptions] = useState([{ id: 'cancel', title: 'Cancel' }]);

    useEffect(() => {
      const newOptions: {
        id: string;
        title: string;
        icon?: string;
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
        }, supportedReactions)}
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

export const renderReactions = (
  handleReaction: any,
  supportedReactions: any
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const reactions = supportedReactions;
  return (
    <View style={styles.reactionListContainer}>
      {reactions.map((r: any, index: number) => (
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
