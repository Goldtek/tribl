import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Entypo, Feather } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../../../theme';
import { REQUEST_CONNECTION } from '../../../../../../../graphql/server/mutations';
import {
  PassportInterface,
  SinglePassportRequestInterface
} from '../../../../../../../graphql/types';
import { GET_SINGLE_PASSPORT } from '../../../../../../../graphql/server/query';
import { hideSensitiveView } from '../../../../../../../utils/uxcamHelper';
import { crashlytics } from '../../../../../../../firebase/config';
import { chatClient } from '../../../../../../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import { NameContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberProp extends PassportInterface {}

function Member(props: MemberProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();

  const { avatar, firstName, lastName, id } = props;

  if (id === chatClient.user?.id) return null;

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { id } }
  });

  const { data: singlePassportData } = useQuery<SinglePassportRequestInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id } }
  );

  const singlePassport = singlePassportData?.singlePassport;
  const location = singlePassport?.currentLocation;
  const citizenship = singlePassport?.citizenship;

  const connectedUsers =
    singlePassport?.connected === 'CONNECTED' ||
    singlePassport?.connected === 'ACCEPTED'
      ? true
      : false;

  const handleMessageNavigation = async () => {
    navigation.navigate('DrawerScreen', {
      screen: 'DirectChatScreen',
      params: {
        id,
        avatar,
        lastName,
        firstName,
        title: `${firstName} ${lastName}`
      }
    });
  };

  const handleRequest = async () => {
    try {
      await requestConnection();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  return (
    <TouchableRipple
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
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
              textTransform: 'capitalize',
              lineHeight: RFValue(15)
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>

          {location && (
            <Text
              style={{
                color: colors.SECONDARY_TEXT,
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
            >
              {location?.city
                ? `${location?.city}, ${location?.state}`
                : `${location?.state}, ${location?.country}`}
            </Text>
          )}
          {citizenship?.length ? (
            <Title
              style={{
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                lineHeight: RFValue(17)
              }}
            >
              {citizenship?.map((country) => country.flag)}
            </Title>
          ) : null}
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
              ? handleMessageNavigation
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
