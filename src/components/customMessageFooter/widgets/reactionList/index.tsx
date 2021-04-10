import React, { Fragment, useRef } from 'react';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { Text, Image } from 'react-native';
import { Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import hexToRGB from '../../../../utils/hexToRGB';
import {
  ReactionText,
  Reaction,
  ReactionContainer,
  ReactionDetailContainer,
  ImageContainer,
  UserDetails
} from './styles';

// DEFINE SCREEN PROP TYPES

export const ReactionItem = ({
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
          <ReactionContainer>
            <ReactionDetailContainer>
              <Text style={{ fontSize: 25 }}>
                {emojiDataByType[item.type] !== undefined
                  ? emojiDataByType[item.type].icon
                  : null}
              </Text>
              <ImageContainer>
                <Image
                  style={{ height: 30, width: 30, borderRadius: 20 }}
                  source={{
                    uri: item.user.image
                  }}
                />
                <UserDetails>{item ? item.user.name : null} </UserDetails>
              </ImageContainer>
            </ReactionDetailContainer>

            {/* {isOwnReaction && (
              <Button onPress={() => (item ? handleReaction(item.type) : null)}>
                Undo
              </Button>
            )} */}
          </ReactionContainer>
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
