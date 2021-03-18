import React, { Fragment, useEffect, useState } from 'react';
import CheckBox from '@react-native-community/checkbox';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../../../theme';
import { GET_SINGLE_PASSPORT } from '../../../../../../graphql/server/query';
import { useLazyQuery } from '@apollo/react-hooks';
import database from '@react-native-firebase/database';
import { OnlinePresence } from '../../../../../inbox/types';
import { PassportInterface } from '../../../../../../graphql/types';

import { NameContainer, CheckboxCover } from './styles';
import { hideSensitiveView } from '../../../../../../utils/uxcamHelper';

interface AddAdminProp extends PassportInterface {
  handleSelect(T: string): void;
  selected: boolean;
  admin: string;
}

export default function AddAdmin(props: AddAdminProp) {
  const { colors, fonts } = useThemeContext();
  const {
    id,
    avatar,
    firstName,
    lastName,
    currentLocation,
    handleSelect,
    selected
  } = props;

  const onPress = () => handleSelect(id);

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
      onPress={() => {}}
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
        <CheckboxCover>
          <CheckBox
            disabled={false}
            value={selected}
            onValueChange={onPress}
            boxType="square"
            tintColors={{
              true: colors.PRIMARY,
              false: colors.INACTIVE
            }}
            tintColor={colors.INACTIVE}
            onCheckColor={colors.WHITE}
            onFillColor={colors.PRIMARY}
            onTintColor={colors.PRIMARY}
            animationDuration={0.3}
            style={{ width: RFValue(20), height: RFValue(20) }}
          />
        </CheckboxCover>
      </Fragment>
    </TouchableRipple>
  );
}
