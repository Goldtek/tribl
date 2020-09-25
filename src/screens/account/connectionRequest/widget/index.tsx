import React, { Fragment, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import { ActivityIndicator } from 'react-native';
import * as Sentry from '@sentry/react-native';
import FastImage from 'react-native-fast-image';
import { Feather, AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../theme';
import { PassportInterface } from '../../../../graphql/types';
import formatMessageTime from '../../../../utils/timesince';
import {
  ACCEPT_CONNECTION,
  REJECT_CONNECTION
} from '../../../../graphql/server/mutations';

import { NameContainer } from './styles';

interface ConnectionRequestProp {
  item: PassportInterface;
  refetch: VoidFunction;
}

const ConnectionRequest = (props: ConnectionRequestProp) => {
  const { refetch, item } = props;
  const { phoneNumber, firstName, lastName, avatar, connection } = item;

  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const [acceptLoading, SetAcceptLoading] = useState(false);
  const [rejectLoading, SetRejectLoading] = useState(false);

  const [acceptConnection] = useMutation(ACCEPT_CONNECTION, {
    variables: { payload: { phoneNumber: phoneNumber } }
  });

  const [declineConnection] = useMutation(REJECT_CONNECTION, {
    variables: { payload: { phoneNumber: phoneNumber } }
  });

  const handleAcceptConnection = async () => {
    SetAcceptLoading(true);
    try {
      const { data } = await acceptConnection();
      if (data?.acceptConnection) {
        SetAcceptLoading(false);
        refetch();
      }
    } catch (error) {
      Sentry.captureException(error);
      SetAcceptLoading(false);
    }
  };

  const handleDeclineConnection = async () => {
    SetRejectLoading(true);
    try {
      const { data } = await declineConnection();
      if (data?.declineConnection) {
        SetRejectLoading(false);
        refetch();
      }
    } catch (error) {
      SetRejectLoading(false);
      Sentry.captureException(error);
    }
  };

  // const createdAt = connection?.createdAt;

  // const connectionDateTime = `${createdAt?.year}/${createdAt?.month}/${createdAt?.day}/${createdAt?.hour}/${createdAt?.minute}/${createdAt?.second}`;

  /* {formatMessageTime(
              `${presence.lastSeen.year}/${presence.lastSeen.month}/${presence.lastSeen.day}`
            )} */
  return (
    <TouchableRipple
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: RFValue(10),
        paddingRight: RFValue(10)
      }}
      onPress={() =>
        navigation.navigate('DrawerMemberDetailScreen', {
          title: `${firstName} ${lastName}`,
          details: item
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
            width: RFValue(35),
            height: RFValue(35),
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
            {`${firstName} ${lastName}`}
          </Title>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE)
            }}
          >
            3 min ago
          </Text>
        </NameContainer>
        {acceptLoading ? (
          <ActivityIndicator
            size="small"
            color={colors.RED}
            style={{
              marginLeft: 'auto',
              marginRight: RFValue(5)
            }}
          />
        ) : (
          <TouchableRipple
            style={{
              marginLeft: 'auto',
              marginRight: RFValue(5),
              width: RFValue(40),
              height: RFValue(25),
              backgroundColor: colors.RED,
              borderWidth: 1,
              borderColor: colors.RED,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={handleDeclineConnection}
          >
            <Feather name="x" size={17} color={colors.WHITE} />
          </TouchableRipple>
        )}
        {rejectLoading ? (
          <ActivityIndicator size="small" color={colors.PRIMARY} />
        ) : (
          <TouchableRipple
            style={{
              width: RFValue(40),
              height: RFValue(25),
              backgroundColor: colors.PRIMARY,
              borderWidth: 1,
              borderColor: colors.PRIMARY,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={handleAcceptConnection}
          >
            <AntDesign name="check" size={17} color={colors.WHITE} />
          </TouchableRipple>
        )}
      </Fragment>
    </TouchableRipple>
  );
};

export default ConnectionRequest;
