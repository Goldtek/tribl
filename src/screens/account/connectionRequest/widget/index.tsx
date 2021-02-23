import React, { Fragment, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import { ActivityIndicator } from 'react-native';
import { Mixpanel } from '../../../../config';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../theme';
import { PassportInterface } from '../../../../graphql/types';
import { logEvent, hideSensitiveView } from '../../../../utils/uxcamHelper';
import {
  ACCEPT_CONNECTION,
  REJECT_CONNECTION
} from '../../../../graphql/server/mutations';
import { GET_SINGLE_PASSPORT } from '../../../../graphql/server/query';
import { crashlytics } from '../../../../firebase/config';

import { NameContainer } from './styles';

interface ConnectionRequestProp {
  item: PassportInterface;
  refetch: VoidFunction;
}

const ConnectionRequest = (props: ConnectionRequestProp) => {
  const { refetch, item } = props;
  const { phoneNumber, firstName, lastName, avatar, id } = item;

  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [acceptConnection] = useMutation(ACCEPT_CONNECTION, {
    variables: { payload: { phoneNumber: phoneNumber } }
  });

  const [declineConnection] = useMutation(REJECT_CONNECTION, {
    variables: { payload: { phoneNumber: phoneNumber } }
  });

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT, {
    variables: { id }
  });

  useEffect(() => {
    getUserPassport();
  }, []);

  const handleAcceptConnection = async () => {
    setAcceptLoading(true);
    logEvent('accept connection request', { from: 'passport' });
    try {
      Mixpanel.track('User Accepts Connection Request', {
        info: `User accepts connection request from ${firstName} ${lastName}`,
        'Activity Screen': 'Connection Request Screen'
      });
      await acceptConnection();
      refetch();
      setAcceptLoading(false);
    } catch (error) {
      crashlytics.recordError(new Error(error));
      setAcceptLoading(false);
    }
  };

  const handleDeclineConnection = async () => {
    setRejectLoading(true);
    logEvent('rejects connection request', { from: 'passport' });
    try {
      await declineConnection();
      refetch();
      setRejectLoading(false);
    } catch (error) {
      crashlytics.recordError(new Error(error));
      setRejectLoading(false);
    }
  };
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
        navigation.navigate('MemberDetailScreen', {
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
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE)
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
            {/* 3 min ago */}
          </Text>
        </NameContainer>
        {rejectLoading ? (
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
        {acceptLoading ? (
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
            <Feather name="check" size={17} color={colors.WHITE} />
          </TouchableRipple>
        )}
      </Fragment>
    </TouchableRipple>
  );
};

export default ConnectionRequest;
