import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Feather } from '@expo/vector-icons';
import { useMutation } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { NavigationInterface } from '../../../../../../types';
import { useThemeContext } from '../../../../../../../theme';
import { REQUEST_CONNECTION } from '../../../../../../../graphql/server/mutations';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberProp extends NavigationInterface {
  avatar: string;
  lastSeen: string;
  firstName: string;
  connected: boolean;
  lastName: string;
  phoneNumber: string;
  id: string;
}

function Member(props: MemberProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const {
    avatar,
    lastSeen = '3 mins ago',
    firstName,
    lastName,
    connected,
    phoneNumber,
    id
  } = props;

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { phoneNumber: phoneNumber } }
  });

  const handleRequest = async () => {
    try {
      const { data } = await requestConnection();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigation = () => {
    navigation.navigate('ConnectionChatScreen', {
      title: `${firstName} ${lastName}`,
      avatar: avatar,
      receiverId: id
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
        {connected ? (
          <TouchableRipple
            style={{
              marginLeft: 'auto',
              width: RFValue(50),
              height: RFValue(35),
              backgroundColor: colors.WHITE,
              borderWidth: 1,
              borderColor: colors.INPUT,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={handleNavigation}
          >
            <Feather
              name="message-square"
              size={20}
              color={colors.PRIMARY_TEXT}
            />
          </TouchableRipple>
        ) : (
          <TouchableRipple
            style={{
              marginLeft: 'auto',
              width: RFValue(50),
              height: RFValue(35),
              backgroundColor: colors.PRIMARY,
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPress={handleRequest}
          >
            <Feather name="plus" size={20} color={colors.WHITE} />
          </TouchableRipple>
        )}
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(Member);
