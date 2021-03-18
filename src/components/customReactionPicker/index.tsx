import React from 'react';
import {
  Modal,
} from 'react-native';

import EmojiBoard from 'react-native-emoji-board';

import { useThemeContext } from '../../theme';
import { Overlay, PickerContainer, BoardContainer, InnerWrapper } from './styles';

export const ReactionPicker = (props: any) => {
  const {dismissReactionPicker, handleReaction, reactionPickerVisible} = props;
  
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
      visible={reactionPickerVisible}>
      <Overlay
        activeOpacity={1}
        onPress={() => {
          _dismissReactionPicker();
        }}
      >
          <PickerContainer>
            <BoardContainer>
              <InnerWrapper>
                <EmojiBoard containerStyle={{backgroundColor: colors.WHITE}} hideBackSpace showBoard onClick={_handleReaction} />
              </InnerWrapper>
            </BoardContainer>
          </PickerContainer>
				</Overlay>
    </Modal>
  );
};
