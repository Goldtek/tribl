// @ts-nocheck

import React from 'react';
import { ReactionPicker } from '../customReactionPicker';
import { useThemeContext } from '../../theme';
import { Entypo } from '@expo/vector-icons';

import {
  ReactionListContainer,
  ReactionItemContainer,
  StyledReactionItem,
  ReactionPickerContainer,
  MoreEmoji
} from './styles';

export const MessageFooter = (props) => {
  const { colors } = useThemeContext();
  const { openReactionPicker } = props;
  return (
    <ReactionListContainer>
      {props.message.latest_reactions &&
        props.message.latest_reactions.length > 0 &&
        renderReactions(
          props.message.latest_reactions,
          props.message.own_reactions,
          props.supportedReactions,
          props.message.reaction_counts,
          props.handleReaction
        )}

      <ReactionPicker {...props} />

      {props.message.latest_reactions &&
        props.message.latest_reactions.length > 0 && (
          <ReactionPickerContainer onPress={openReactionPicker}>
            <MoreEmoji>+</MoreEmoji>
            <Entypo name="emoji-happy" color={colors.BLACK} size={18} />
          </ReactionPickerContainer>
        )}
    </ReactionListContainer>
  );
};

export const renderReactions = (
  reactions,
  ownReactions = [],
  supportedReactions,
  reactionCounts,
  handleReaction
) => {
  const reactionsByType = {};
  const ownReactionTypes = ownReactions.map((or) => or.type);
  reactions &&
    reactions.forEach((item) => {
      if (reactions[item.type] === undefined) {
        return (reactionsByType[item.type] = [item]);
      } else {
        return (reactionsByType[item.type] = [
          ...(reactionsByType[item.type] || []),
          item
        ]);
      }
    });

  const emojiDataByType = {};
  supportedReactions.forEach((e) => (emojiDataByType[e.id] = e));

  const reactionTypes = supportedReactions.map((e) => e.id);
  return Object.keys(reactionsByType).map((type, index) =>
    reactionTypes.indexOf(type) > -1 ? (
      <ReactionItem
        key={index}
        type={type}
        handleReaction={handleReaction}
        reactionCounts={reactionCounts}
        emojiDataByType={emojiDataByType}
        ownReactionTypes={ownReactionTypes}
      />
    ) : null
  );
};

const ReactionItem = ({
  type,
  handleReaction,
  reactionCounts,
  emojiDataByType,
  ownReactionTypes
}) => {
  const isOwnReaction = ownReactionTypes.indexOf(type) > -1;
  return (
    <ReactionItemContainer
      onPress={() => {
        handleReaction(type);
      }}
      key={type}
      style={{
        borderColor: isOwnReaction ? '#0064e2' : 'transparent',
        backgroundColor: isOwnReaction ? '#d6ebff' : '#F0F0F0'
      }}
    >
      <StyledReactionItem>
        {emojiDataByType[type].icon} {reactionCounts[type]}
      </StyledReactionItem>
    </ReactionItemContainer>
  );
};
