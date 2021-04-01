import React, { Fragment, useRef } from 'react';
import EmojiIcon from '../../../assets/icons/emoji';
import {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultUserType,
  MessageSimpleProps
} from 'stream-chat-react-native-core';
import { ReactionPicker } from '../customReactionPicker';

import { ReactionText, Container, MoreReaction, Reaction } from './styles';
import { Portal } from 'react-native-portalize';
import { StatusBar } from 'expo-status-bar';
import { Modalize } from 'react-native-modalize';
import { Text, View, Image } from 'react-native';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import { MessageAvatar, Avatar } from 'stream-chat-expo';
import { Divider, Button } from 'react-native-paper';
import hexToRGB from '../../utils/hexToRGB';

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

  return hasReactions ? (
    <Container>
      {renderReactions(props)}
      <ReactionPicker {...props} />
      <MoreReaction onPress={openReactionPicker}>
        <EmojiIcon />
      </MoreReaction>
    </Container>
  ) : null;
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

const ReactionItem = ({
  type,
  handleReaction,
  reactionCounts,
  emojiDataByType,
  ownReactionTypes,
  latestReactions
}: any) => {
  const isOwnReaction = ownReactionTypes.indexOf(type) > -1;

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const { colors, fonts } = useThemeContext();

  const _renderItem = ({ item }: any) => {
    return (
      <Fragment>
        {emojiDataByType[item.type] && (
          <View
            style={{
              marginVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 25 }}>
                {emojiDataByType[item.type] !== undefined
                  ? emojiDataByType[item.type].icon
                  : null}
              </Text>
              <View
                style={{
                  marginLeft: 15,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Image
                  style={{ height: 30, width: 30, borderRadius: 20 }}
                  source={{
                    uri: item.user.image
                  }}
                />
                <Text
                  style={{
                    marginHorizontal: 5,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD
                  }}
                >
                  {item ? item.user.user.firstName : null}{' '}
                  {item ? item.user.user.lastName : null}
                </Text>
              </View>
            </View>

            {/* {isOwnReaction && (
              <Button onPress={() => (item ? handleReaction(item.type) : null)}>
                Undo
              </Button>
            )} */}
          </View>
        )}
      </Fragment>
    );
  };

  return (
    <>
      <Reaction
        isOwnReaction={isOwnReaction}
        onPress={() => handleReaction(type)}
        onLongPress={() => openModal()}
        key={type}
      >
        <ReactionText>
          {emojiDataByType[type].icon} {reactionCounts[type]}
        </ReactionText>
      </Reaction>

      <Portal>
        <StatusBar translucent animated style="light" />

        <Modalize
          ref={modalizeRef}
          modalHeight={DEVICE_FULL_HEIGHT / 2.5}
          modalStyle={{
            paddingTop: RFValue(30),
            paddingBottom: RFValue(20),
            paddingHorizontal: RFValue(10),
            backgroundColor: colors.WHITE
          }}
          handlePosition="inside"
          HeaderComponent={
            <Fragment>
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  lineHeight: 20,
                  marginBottom: RFValue(10),
                  textAlign: 'center'
                }}
              >
                Reactions
              </Text>
              <Divider />
            </Fragment>
          }
          flatListProps={{
            data: latestReactions,
            renderItem: _renderItem,
            showsVerticalScrollIndicator: true,
            keyExtractor: ({ id }: any) => id,
            contentContainerStyle: {
              marginTop: 20,
              marginBottom: 100,
              paddingHorizontal: 15,
              paddingBottom: 40,
              backgroundColor: colors.WHITE
            },
            ItemSeparatorComponent: () => (
              <Divider
                style={{
                  height: 1.5,
                  backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
                }}
              />
            ),
            ListFooterComponentStyle: { justifyContent: 'center' }
          }}
        />
      </Portal>
    </>
  );
};
