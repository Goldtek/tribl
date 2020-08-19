import React, { Fragment } from 'react';
import { Keyboard } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Feather, AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { NavigationInterface } from '../../../types';
import { useThemeContext } from '../../../../theme';
import {
  ACCEPT_CONNECTION,
  REJECT_CONNECTION
} from '../../../../graphql/server/mutations';

import { NameContainer } from './styles';

interface ConnectionRequestProp extends NavigationInterface {
  avatar: string;
  lastSeen: string;
  firstName: string;
  connected: boolean;
  lastName: string;
  phoneNumber: string;
  refetch: VoidFunction;
}

const ConnectionRequest = (props: ConnectionRequestProp) => {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const {
    avatar = 'https://picsum.photos/700',
    lastSeen = '3 mins ago',
    firstName,
    lastName,
    phoneNumber,
    refetch
  } = props;

  const [acceptConnection] = useMutation(ACCEPT_CONNECTION, {
    variables: {
      payload: {
        phoneNumber: phoneNumber
      }
    }
  });

  const [declineConnection] = useMutation(REJECT_CONNECTION, {
    variables: {
      payload: {
        phoneNumber: phoneNumber
      }
    }
  });

  const handleAcceptConnection = async () => {
    Keyboard.dismiss();
    try {
      const { data } = await acceptConnection();
      if (data?.acceptConnection) {
        refetch();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeclineConnection = async () => {
    Keyboard.dismiss();
    try {
      const { data } = await declineConnection();
      if (data?.declineConnection) {
        refetch();
      }
    } catch (error) {
      console.error(error);
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
            {lastSeen}
          </Text>
        </NameContainer>
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
      </Fragment>
    </TouchableRipple>
  );
};

export default ConnectionRequest;
