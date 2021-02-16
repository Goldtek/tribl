import React, { Fragment, useEffect, useState } from 'react';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../theme';
import { GET_SINGLE_PASSPORT } from '../../../../graphql/server/query';
import { useLazyQuery } from '@apollo/react-hooks';
import { Entypo } from '@expo/vector-icons';
import database from '@react-native-firebase/database';
import { OnlinePresence } from '../../../inbox/types';
import { PassportInterface } from '../../../../graphql/types';
import formatMessageTime from '../../../../utils/timesince';
import { hideSensitiveView } from '../../../../utils/uxcamHelper';

import { NameContainer } from './styles';

interface ConnectionProp extends PassportInterface {}

export default function Connection(props: ConnectionProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const {
    id,
    avatar,
    firstName,
    lastName,
    conversation,
    currentLocation
  } = props;

  const [onlinePresence, setOnlinePresence] = useState<OnlinePresence>({
    status: 'OFFLINE',
    lastSeen: new Date().setDate(5)
  });

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT, {
    variables: { id }
  });

  useEffect(() => {
    const reference = database().ref(`/presence/${id}`);
    reference.on('value', (snapshot: any) => {
      const presence = snapshot.val() as OnlinePresence;

      if (presence) setOnlinePresence({ ...onlinePresence, ...presence });
    });

    getUserPassport();
  }, []);

  const handleMessageNavigation = () => {
    navigation.navigate('DirectChatScreen', {
      title: `${firstName} ${lastName}`,
      chatId: conversation?.id,
      receiverId: id,
      ...props
    });
  };

  return (
    <TouchableRipple
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: RFValue(10),
        paddingLeft: RFValue(10),
        paddingRight: RFValue(10)
      }}
      onPress={() =>
        navigation.navigate('MemberDetailScreen', {
          title: `${firstName} ${lastName}`,
          details: { ...props }
        })
      }
    >
      <Fragment>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{
            uri: avatar,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(50),
            height: RFValue(50),
            borderRadius: RFValue(4)
          }}
        />
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'lowercase'
            }}
          >
            {currentLocation?.city
              ? `${currentLocation?.city}, ${currentLocation?.state}`
              : `${currentLocation?.state}, ${currentLocation?.country}`}
          </Text>
        </NameContainer>
        <TouchableRipple
          style={{
            marginLeft: 'auto',
            width: RFValue(50),
            height: RFValue(30),
            backgroundColor: colors.WHITE,
            borderWidth: 1,
            borderColor: colors.INPUT,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={handleMessageNavigation}
        >
          <Entypo name="new-message" size={17} color={colors.PRIMARY_TEXT} />
        </TouchableRipple>
      </Fragment>
    </TouchableRipple>
  );
}
