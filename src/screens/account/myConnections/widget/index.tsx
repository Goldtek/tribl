import React, { Fragment } from 'react';
import { NavigationInterface } from '../../../types';
import { Text, TouchableRipple, Title } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../theme';
import { Feather } from '@expo/vector-icons';
import { PassportInterface } from '../../../../graphql/types';

import { NameContainer } from './styles';

interface ConnectionProp extends PassportInterface {}

const Connection = (props: ConnectionProp) => {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { id, avatar, firstName, lastName, conversation } = props;

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
            3 mins ago
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
          onPress={() =>
            navigation.navigate('DirectChatScreen', {
              title: `${firstName} ${lastName}`,
              avatar: avatar,
              receiverId: id,
              chatId: conversation?.id
            })
          }
        >
          <Feather
            name="message-square"
            size={17}
            color={colors.PRIMARY_TEXT}
          />
        </TouchableRipple>
      </Fragment>
    </TouchableRipple>
  );
};

export default Connection;
