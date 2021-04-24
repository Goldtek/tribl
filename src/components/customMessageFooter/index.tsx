import React from 'react';
import {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultUserType,
  MessageSimpleProps
} from 'stream-chat-react-native-core';

import { ReactionPicker } from '../customReactionPicker';
import EmojiIcon from '../../../assets/icons/emoji';
import { Container, MoreReaction } from './styles';
import { ReactionItem } from './widgets/reactionList';

// DEFINE SCREEN PROP TYPES
type MessageProps = MessageSimpleProps<
  DefaultAttachmentType,
  DefaultChannelType,
  string & {},
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  DefaultUserType
>;

export default function CustomMessageFooter(props: MessageProps) {
  const { openReactionPicker, message } = props;

  const hasReactions =
    message.latest_reactions && message.latest_reactions.length > 0;

  return (
    <Container>
      {renderReactions(props)}
      <ReactionPicker {...props} />
      {hasReactions && (
        <MoreReaction onPress={openReactionPicker}>
          <EmojiIcon />
        </MoreReaction>
      )}
    </Container>
  );
}

export const renderReactions = (props: MessageProps) => {
  const { supportedReactions, handleReaction, message } = props;

  const { latest_reactions, own_reactions, reaction_counts } = message;

  const reactionsByType: Record<string, any> = {};

  const ownReactionTypes = own_reactions?.map((or: any) => or.type);

  latest_reactions &&
    latest_reactions.forEach((item: any) => {
      if (latest_reactions[item.type] === undefined) {
        return (reactionsByType[item.type] = [item]);
      } else {
        return (reactionsByType[item.type] = [
          ...(reactionsByType[item.type] || []),
          item
        ]);
      }
    });

  const emojiDataByType: Record<string, any> = {};
  supportedReactions?.forEach((e) => (emojiDataByType[e.id] = e));

  const reactionTypes = supportedReactions?.map((e) => e.id);
  return Object.keys(reactionsByType).map((type, index) =>
    //@ts-ignore
    reactionTypes?.indexOf(type) > -1 ? (
      <ReactionItem
        key={index}
        type={type}
        handleReaction={handleReaction}
        reactionCounts={reaction_counts}
        emojiDataByType={emojiDataByType}
        ownReactionTypes={ownReactionTypes}
        latestReactions={latest_reactions}
      />
    ) : null
  );
};
