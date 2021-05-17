import React, { Fragment } from 'react';
import { TouchableRipple, Text, Paragraph } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';
import { PassportInterface, UserPassportInterface } from '../../graphql/types';
import { PAGINATION_DEFAULT, USER_DEFAULT_AVATAR } from '../../constants';
import { hideSensitiveView } from '../../utils/uxcamHelper';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { useQuery } from '@apollo/react-hooks';

// DEFINE SCREEN PROP TYPES
interface MyConnectionProp extends PassportInterface {
  lastIndex?: boolean;
  singlePassport?: PassportInterface;
}

export default function MyConnectionCard(props: MyConnectionProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { singlePassport, lastIndex, ...user } = props;
  const { avatar, firstName, lastName, id } = user;


  let data: UserPassportInterface | undefined;
  if (id) {
    const result = useQuery<UserPassportInterface>(
      GET_SINGLE_PASSPORT,
      { variables: { id } }
    );
    data = result?.data;
  }

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'MemberDetailScreen',
      params: {
        title: `${firstName} ${lastName}`,
        details: { ...user, ...data?.singlePassport }
      }
    });
  };

  if (!lastIndex) {
    return (
      <TouchableRipple
        ref={hideSensitiveView}
        onPress={handleNavigation}
        rippleColor={hexToRGB(colors.PRIMARY, 0.5)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10
        }}
      >
        <Fragment>
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{
              uri: avatar ? avatar : USER_DEFAULT_AVATAR,
              priority: FastImage.priority.high
            }}
            style={{
              width: 65,
              height: 65,
              borderRadius: 65 / 2,
              borderWidth: 2,
              borderColor: colors.PRIMARY
            }}
          />
          <Paragraph
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT
            }}
          >
            {firstName.length >= 6 ? `${firstName.slice(0, 5)}...` : firstName}
          </Paragraph>
        </Fragment>
      </TouchableRipple>
    );
  }

  return lastIndex &&
    Number(singlePassport?.myConnections?.length) > PAGINATION_DEFAULT / 2 ? (
    <TouchableRipple
      onPress={() => {
        navigation.navigate('DrawerScreen', {
          screen: 'UserConnectionListScreen',
          params: {
            details: singlePassport?.myConnections,
            title: `${singlePassport?.firstName} ${singlePassport?.lastName} Connections`
          }
        });
      }}
      style={{
        marginHorizontal: 5,
        borderWidth: 1.3,
        borderRadius: 5,
        borderColor: hexToRGB(colors.PRIMARY, 0.5)
      }}
    >
      <Text
        style={{
          padding: 10,
          color: colors.PRIMARY,
          fontSize: fonts.LARGE_SIZE - 2,
          fontFamily: fonts.WORK_SANS_BOLD
        }}
      >
        View all
      </Text>
    </TouchableRipple>
  ) : null;
}
