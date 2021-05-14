import React, { Fragment, useState, useEffect } from 'react';
import { Title, Paragraph, TouchableRipple, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import {
  REQUEST_CONNECTION,
  REMOVE_USER_FROM_CHANNEL
} from '../../../../graphql/server/mutations';
import { crashlytics } from '../../../../firebase/config';
import { PassportInterface } from '../../../../graphql/types';
import { logEvent } from '../../../../utils/uxcamHelper';
import { rootNavigator } from '../../../../constants';
import { useThemeContext } from '../../../../theme';
import hexToRGB from '../../../../utils/hexToRGB';
import { chatClient } from '../../../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';
import { Alert } from 'react-native';

// DEFINE SCREEN PROP TYPES
interface ChannelUserProp extends PassportInterface {
  role: string;
  channelId: string;
  refetch: VoidFunction;
}

function ChannelMember(props: ChannelUserProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [user, setUser] = useState(false);

  const {
    id,
    avatar,
    lastName,
    firstName,
    currentLocation,
    connectionDetails,
    citizenship,
    role,
    channelId,
    refetch
  } = props;

  const userId = chatClient.user?.id;
  useEffect(() => {
    if (userId === id) {
      setUser(true);
    }
  }, [userId]);

  const [pending, setPending] = useState(false);

  const [requestConnection, { loading }] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { id } }
  });

  const [removeMember, { loading: removeLoading }] = useMutation(
    REMOVE_USER_FROM_CHANNEL,
    {
      variables: { payload: { channelId: channelId, participants: [id] } }
    }
  );

  const handleRequest = async () => {
    logEvent('request connection', { from: 'passport' });
    try {
      await requestConnection();
      setPending(true);
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleNavigation = () => {
    rootNavigator.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: { ...props }
    });
  };

  const handleMessageNavigation = () => {
    rootNavigator.navigate('DrawerScreen', {
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

  const handleRemoveUser = () => {
    if (role == 'owner' && !user) {
      Alert.alert(
        'Remove user from channel',
        `Are you sure you want to remove ${firstName} ${lastName} from this channel`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                await removeMember();
                refetch();
              } catch (error) {
                crashlytics.recordError(new Error(error));
                crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
              }
            }
          }
        ]
      );
    }
  };

  const state = currentLocation?.state;
  const country = currentLocation?.country;
  const city = currentLocation?.city;

  return (
    <TouchableRipple
      onPress={user ? () => {} : handleNavigation}
      rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12
      }}
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
            borderRadius: RFValue(5)
          }}
        />
        <TextContainer>
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
          {city && state ? (
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(14),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${city}, ${state}`}
            </Paragraph>
          ) : country !== undefined ? (
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(14),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${state}, ${country}`}
            </Paragraph>
          ) : null}
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
        </TextContainer>
        {role == 'owner' && !user ? (
          <Button
            mode="text"
            uppercase={false}
            loading={removeLoading}
            onPress={handleRemoveUser}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.SMALL_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE,
              marginHorizontal: removeLoading ? 10 : 0
            }}
            contentStyle={{
              backgroundColor: colors.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            style={{ width: RFValue(60), borderRadius: 5 }}
          >
            {t(`community.chat.removeUser`)}
          </Button>
        ) : (
          <Fragment>
            {user ? null : (
              <Fragment>
                {connectionDetails?.status == 'PENDING' || pending ? (
                  <Button
                    mode="text"
                    disabled={true}
                    uppercase={false}
                    labelStyle={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.SMALL_SIZE),
                      textTransform: 'capitalize',
                      color: colors.PRIMARY_TEXT,
                      marginHorizontal: 0
                    }}
                    contentStyle={{
                      backgroundColor: colors.DISABLED,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    style={{ borderRadius: 5, width: RFValue(60) }}
                  >
                    {t(`community.recommended.pending`)}
                  </Button>
                ) : connectionDetails?.status == 'ACCEPTED' ? (
                  <Button
                    mode="text"
                    uppercase={false}
                    labelStyle={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.SMALL_SIZE),
                      textTransform: 'capitalize',
                      color: colors.WHITE,
                      marginHorizontal: 0
                    }}
                    contentStyle={{
                      backgroundColor: colors.PRIMARY,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    style={{ borderRadius: 5, width: RFValue(60) }}
                    onPress={handleMessageNavigation}
                  >
                    {t(`community.recommended.message`)}
                  </Button>
                ) : (
                  <Button
                    loading={loading}
                    mode="contained"
                    uppercase={false}
                    labelStyle={{
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.SMALL_SIZE),
                      textTransform: 'capitalize',
                      color: colors.WHITE
                    }}
                    contentStyle={{
                      backgroundColor: colors.PRIMARY,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    style={{ borderRadius: 5, width: RFValue(60) }}
                    onPress={handleRequest}
                  >
                    {t(`community.recommended.add`)}+
                  </Button>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(ChannelMember, () => false);
