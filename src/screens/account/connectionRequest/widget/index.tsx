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
  const {
    firstName,
    lastName,
    avatar,
    id,
    currentLocation,
    citizenship
  } = item;

  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [acceptConnection] = useMutation(ACCEPT_CONNECTION, {
    variables: { payload: { id } }
  });

  const [declineConnection] = useMutation(REJECT_CONNECTION, {
    variables: { payload: { id } }
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
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
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
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
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
              textTransform: 'capitalize',
              lineHeight: RFValue(16)
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              lineHeight: RFValue(13)
            }}
          >
            {currentLocation?.city
              ? `${currentLocation?.city}, ${currentLocation?.state}`
              : `${currentLocation?.state}, ${currentLocation?.country}`}
          </Text>
          {citizenship?.length ? (
            <Title
              style={{
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                lineHeight: RFValue(18)
              }}
            >
              {citizenship?.map((country) => country.flag)}
            </Title>
          ) : null}
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
