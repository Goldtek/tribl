import React from 'react';
import { Modal } from 'react-native';
import { useThemeContext } from '../../theme';
import EmojiBoard from 'react-native-emoji-board';

import { Overlay, PickerContainer } from './styles';

export const ReactionPicker = (props: any) => {
  const {
    handleReaction,
    dismissReactionPicker,
    reactionPickerVisible
  } = props;

  const { colors } = useThemeContext();

  const _dismissReactionPicker = () => {
    dismissReactionPicker();
  };

  const _handleReaction = (type: { name: string }) => {
    handleReaction(type.name);
    _dismissReactionPicker();
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={_dismissReactionPicker}
      transparent
      visible={reactionPickerVisible}
    >
      <Overlay activeOpacity={1} onPress={_dismissReactionPicker}>
        <PickerContainer>
          <EmojiBoard
            containerStyle={{
              width: '100%',
              borderRadius: 5,
              backgroundColor: colors.WHITE
            }}
            hideBackSpace
            showBoard
            onClick={_handleReaction}
          />
        </PickerContainer>
      </Overlay>
    </Modal>
  );
};
