import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import { useThemeContext } from '../../theme';
import hexToRGB from '../../utils/hexToRGB';
import { PassportInterface } from '../../graphql/types';
import { hideSensitiveView } from '../../utils/uxcamHelper';
import { chatClient } from '../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionCardProp extends PassportInterface {}

function ConnectionCard(props: ConnectionCardProp) {
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();

  const {
    id,
    avatar,
    firstName,
    lastName,
    verified,
    citizenship,
    currentLocation
  } = props;

  if (
    (id === chatClient.user?.id ||
      !verified ||
      lastName == null ||
      firstName == null ||
      currentLocation?.city == null,
    currentLocation?.state == null)
  ) {
    return null;
  }

  useQuery(GET_SINGLE_PASSPORT, { variables: { id } });

  const handleMessageNavigation = async () => {
    navigation.navigate('DrawerScreen', {
      screen: 'DeepLinkDirectChatScreen',
      params: {
        id,
        avatar,
        lastName,
        firstName,
        title: `${firstName} ${lastName}`
      }
    });
  };

  return (
    <TouchableRipple
      ref={hideSensitiveView}
      style={{
        height: RFValue(80),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: RFValue(20)
      }}
      rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
      onPress={handleMessageNavigation}
    >
      <Fragment>
        {avatar ? (
          <FastImage
            resizeMode={FastImage.resizeMode.stretch}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{ width: RFValue(50), height: RFValue(50), borderRadius: 4 }}
          />
        ) : (
          <Image
            source={require('../../../assets/images/profile.png')}
            resizeMode="cover"
            style={{
              width: RFValue(50),
              height: RFValue(50),
              borderRadius: RFValue(4)
            }}
          />
        )}
        <NameContainer ref={hideSensitiveView}>
          <Title
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              textTransform: 'capitalize',
              lineHeight: RFValue(18)
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          <Text
            style={{
              color: colors.SECONDARY_TEXT,
              fontFamily: fonts.WORK_SANS_REGULAR,
              fontSize: RFValue(fonts.MEDIUM_SIZE - 2),
              textTransform: 'capitalize'
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
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(ConnectionCard);
