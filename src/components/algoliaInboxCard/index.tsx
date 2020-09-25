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
import Firechat from '../../firebase';
import { fireAuth } from '../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer, Container } from './style';

// DEFINE SCREEN PROP TYPES
interface HighlightProp {
  attribute: string;
  hit: PassportInterface;
  highlight(T: any): any[];
  closeModal(): void;
}

const Highlight = (props: HighlightProp) => {
  const { attribute, hit, highlight, closeModal } = props;
  const highlights = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit
  });

  const userId = fireAuth.currentUser?.uid;

  const { colors, fonts } = useThemeContext();

  const [onlinePresence, setOnlinePresence] = useState<OnlinePresence>({
    status: 'OFFLINE',
    lastSeen: new Date().getTime()
  });

  useEffect(() => {
    Firechat.getOnlineStatus(hit.id).onSnapshot({
      next: (snapshot) => {
        if (snapshot.exists) {
          const { presence } = snapshot.data() as { presence: OnlinePresence };
          setOnlinePresence({ ...onlinePresence, ...presence });
        }
      }
    });
  }, []);

  const handleNavigation = () => {
    closeModal();

    const senderId = hit.conversation?.messageRequest.senderId;
    const messageRequest = hit.conversation?.messageRequest;
    const isRequestApproved = hit.conversation?.messageRequest.approvedAt;
    const approveRequest =
      senderId !== userId && messageRequest && !isRequestApproved;

    if (approveRequest) {
      return rootNavigator.navigate('MessageRequestScreen', {
        title: `${hit.firstName} ${hit.lastName}`,
        chatId: hit.conversation?.id,
        senderId: hit.id,
        ...hit
      });
    }

    rootNavigator.navigate(
      hit.conversation?.id ? 'DirectChatScreen' : 'ConnectionChatScreen',
      {
        title: `${hit.firstName} ${hit.lastName}`,
        chatId: hit.conversation?.id,
        receiverId: hit.id,
        ...hit
      }
    );
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
                    textTransform: 'capitalize'
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
                  {onlinePresence.status === 'ONLINE'
                    ? onlinePresence.status
                    : formatMessageTime(Number(onlinePresence.lastSeen))}
                </Text>
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
