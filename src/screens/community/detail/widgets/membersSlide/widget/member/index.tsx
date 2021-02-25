import React, { Fragment, useEffect, useState } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Entypo, Feather } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../../../theme';
import { REQUEST_CONNECTION } from '../../../../../../../graphql/server/mutations';
import database from '@react-native-firebase/database';
import {
  PassportInterface,
  SinglePassportRequestInterface
} from '../../../../../../../graphql/types';
import {
  GET_COMMUNITY_MEMBER_PASSPORT,
  GET_SINGLE_PASSPORT,
  GET_USER_PASSPORT
} from '../../../../../../../graphql/server/query';
import { hideSensitiveView } from '../../../../../../../utils/uxcamHelper';
import { OnlinePresence } from '../../../../../../inbox/types';
import { fireAuth, crashlytics } from '../../../../../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberProp extends PassportInterface {}

function Member(props: MemberProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, firstName, lastName, id, currentLocation } = props;

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userId = userDetails?.id;

  if (id === userId) return null;

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { id } }
  });

  const { data: passportData } = useQuery<SinglePassportRequestInterface>(
    GET_COMMUNITY_MEMBER_PASSPORT,
    { variables: { id } }
  );

  const { data: singlePassportData } = useQuery<SinglePassportRequestInterface>(
    GET_SINGLE_PASSPORT,
    {
      variables: { id }
    }
  );

  const [onlinePresence, setOnlinePresence] = useState<OnlinePresence>({
    status: 'OFFLINE',
    lastSeen: new Date().setDate(5)
  });

  useEffect(() => {
    const reference = database().ref(`/presence/${id}`);
    reference.on('value', (snapshot: any) => {
      const presence = snapshot.val() as OnlinePresence;
      if (presence) setOnlinePresence({ ...onlinePresence, ...presence });
    });
  }, []);

  const singlePassport = singlePassportData?.singlePassport;

  const location = singlePassport?.currentLocation;

  const connectedUsers =
    singlePassport?.connected === 'CONNECTED' ||
    singlePassport?.connected === 'ACCEPTED'
      ? true
      : false;

  const handleRequest = async () => {
    try {
      await requestConnection();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: singlePassport?.conversation?.id
        ? 'DirectChatScreen'
        : 'ConnectionChatScreen',
      params: {
        receiverId: id,
        chatId: singlePassport?.conversation?.id,
        title: `${firstName} ${lastName}`,
        ...{ ...props, ...singlePassport }
      }
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
          details: { ...props, ...singlePassport }
        })
      }
    >
      <Fragment>
        <FastImage
          source={{ uri: avatar, priority: FastImage.priority.high }}
          resizeMode={FastImage.resizeMode.cover}
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
            {location?.city
              ? `${location?.city}, ${location?.state}`
              : `${location?.state}, ${location?.country}`}
          </Text>
        </NameContainer>

        <TouchableRipple
          style={{
            marginLeft: 'auto',
            width: RFValue(50),
            height: RFValue(35),
            backgroundColor: connectedUsers ? colors.WHITE : colors.PRIMARY,
            borderWidth: connectedUsers ? 1 : 0,
            borderColor: connectedUsers ? colors.INPUT : colors.TRANSPARENT,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={
            singlePassport?.connectionDetails?.status == 'ACCEPTED'
              ? handleNavigation
              : handleRequest
          }
        >
          {singlePassport?.connectionDetails?.status == 'ACCEPTED' ? (
            <Entypo name="new-message" size={20} color={colors.WHITE} />
          ) : (
            <Feather name="plus" size={20} color={colors.WHITE} />
          )}
        </TouchableRipple>
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(Member, () => false);
