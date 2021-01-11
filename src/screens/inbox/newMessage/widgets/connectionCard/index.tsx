import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { GET_SINGLE_PASSPORT } from '../../../../../graphql/server/query';
import { useThemeContext } from '../../../../../theme';
import hexToRGB from '../../../../../utils/hexToRGB';
import { PassportInterface } from '../../../../../graphql/types';
import { fireAuth } from '../../../../../firebase/config';
import { hideSensitiveView } from '../../../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionCardProp extends PassportInterface {}

function ConnectionCard(props: ConnectionCardProp) {
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const userId = fireAuth.currentUser?.uid;

  const {
    id,
    avatar,
    firstName,
    lastName,
    conversation,
    currentLocation
  } = props;

  useQuery(GET_SINGLE_PASSPORT, { variables: { id } });

  const handleNavigation = () => {
    const messageRequest = conversation?.messageRequest;
    const senderId = conversation?.messageRequest?.senderId;
    const isRequestApproved = conversation?.messageRequest?.approvedAt;
    const approveRequest =
      senderId !== userId && messageRequest && !isRequestApproved;

    if (approveRequest) {
      return navigation.navigate('MessageRequestChatScreen', {
        title: `${firstName} ${lastName}`,
        chatId: conversation?.id,
        senderId: id,
        ...props
      });
    }

    navigation.navigate('DrawerScreen', {
      screen: conversation?.id ? 'DirectChatScreen' : 'ConnectionChatScreen',
      params: {
        title: `${firstName} ${lastName}`,
        chatId: conversation?.id,
        receiverId: id,
        ...props
      }
    });
  };

  return (
    <TouchableRipple
      ref={hideSensitiveView}
      style={{
        height: RFValue(80),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RFValue(20)
      }}
      rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
      onPress={handleNavigation}
    >
      <Fragment>
        {avatar ? (
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{ width: RFValue(50), height: RFValue(50), borderRadius: 4 }}
          />
        ) : (
          <Image
            source={require('../../../../../../assets/images/profile.png')}
            resizeMode="cover"
            style={{
              width: RFValue(60),
              height: RFValue(60),
              borderRadius: RFValue(4)
            }}
          />
        )}
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE - 2)
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          {currentLocation.length ? (
            <Text
              style={{
                color: colors.SECONDARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE - 2),
                textTransform: 'lowercase'
              }}
            >
              {currentLocation[0].city}, {currentLocation[0].state}
            </Text>
          ) : null}
        </NameContainer>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(ConnectionCard);
