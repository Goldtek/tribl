import React, { Fragment, useEffect, useState } from 'react';
import { connectHighlight } from 'react-instantsearch-native';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import { rootNavigator } from '../../constants';
import { PassportInterface } from '../../graphql/types';
import { OnlinePresence } from '../../screens/inbox/types';
import formatMessageTime from '../../utils/timesince';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import Firechat from '../../firebase';
import { fireAuth } from '../../firebase/config';
import { useLazyQuery } from '@apollo/react-hooks';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, Container } from './style';

// DEFINE SCREEN PROP TYPES
interface HighlightProp {
  attribute: string;
  hit: PassportInterface;
  highlight(T: any): any[];
}

const Highlight = (props: HighlightProp) => {
  const { attribute, hit, highlight } = props;
  const highlights = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit
  });

  const userId = fireAuth.currentUser?.uid;

  const { colors, fonts } = useThemeContext();

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT, {
    variables: { id: hit.id }
  });

  useEffect(() => {
    getUserPassport();
  }, []);

  const handleNavigation = () => {
    const senderId = hit.conversation?.messageRequest.senderId;
    const messageRequest = hit.conversation?.messageRequest;
    const isRequestApproved = hit.conversation?.messageRequest.approvedAt;
    const approveRequest =
      senderId !== userId && messageRequest && !isRequestApproved;

    if (approveRequest) {
      return rootNavigator.navigate('MessageRequestChatScreen', {
        title: `${hit.firstName} ${hit.lastName}`,
        chatId: hit.conversation?.id,
        senderId: hit.id,
        ...hit
      });
    }

    rootNavigator.navigate('DrawerScreen', {
      screen: hit.conversation?.id
        ? 'DirectChatScreen'
        : 'ConnectionChatScreen',
      params: {
        title: `${hit.firstName} ${hit.lastName}`,
        chatId: hit.conversation?.id,
        receiverId: hit.id,
        ...hit
      }
    });
  };

  return (
    <Container>
      {highlights.map((_, index: number) => {
        return (
          <TouchableRipple
            key={index}
            style={{
              height: RFValue(80),
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center'
            }}
            rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
            onPress={handleNavigation}
          >
            <Fragment>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: hit.avatar,
                  priority: FastImage.priority.high
                }}
                style={{
                  width: RFValue(60),
                  height: RFValue(60),
                  borderRadius: RFValue(4)
                }}
              />
              <NameContainer>
                <Title
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    textTransform: 'capitalize',
                    lineHeight: RFValue(16)
                  }}
                >
                  {`${hit.firstName} ${hit.lastName}`}
                </Title>
                <Text
                  style={{
                    color: colors.SECONDARY_TEXT,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    textTransform: 'lowercase'
                  }}
                >
                  {hit.currentLocation?.city
                    ? `${hit.currentLocation?.city}, ${hit.currentLocation?.state}`
                    : `${hit.currentLocation?.state}, ${hit.currentLocation?.country}`}
                </Text>
                {hit?.citizenship?.length ? (
                  <Title
                    style={{
                      fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                      lineHeight: RFValue(18)
                    }}
                  >
                    {hit?.citizenship?.map((country: any) => country.flag)}
                  </Title>
                ) : null}
              </NameContainer>
            </Fragment>
          </TouchableRipple>
        );
      })}
    </Container>
  );
};

//@ts-ignore
export default connectHighlight(Highlight);
