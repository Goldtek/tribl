import React, { Fragment } from 'react';
import { Title, Text, TouchableRipple, Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Entypo, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Alert } from 'react-native';
import { useThemeContext } from '../../../../../../../theme';
import {
  REQUEST_CONNECTION,
  REMOVE_USER_FROM_TRIBE
} from '../../../../../../../graphql/server/mutations';
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
interface MemberProp extends PassportInterface {
  isModerotor: boolean;
  refresh: VoidFunction;
  tribeId: string;
}

function Member(props: MemberProp) {
  const { colors, fonts } = useThemeContext();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    id,
    avatar,
    tribeId,
    refresh,
    lastName,
    firstName,
    isModerotor
  } = props;

  const [requestConnection] = useMutation(REQUEST_CONNECTION);

  let singlePassportData: SinglePassportRequestInterface | undefined;

  if (id) {
    const result = useQuery<SinglePassportRequestInterface>(GET_SINGLE_PASSPORT, {
      variables: { id }
    });

    singlePassportData = result?.data;
  }


  const [removeMember, { loading: removeLoading }] = useMutation(
    REMOVE_USER_FROM_TRIBE,
    {
      variables: { payload: { communityId: tribeId, receipientIds: [id] } }
    }
  );

  const userId = chatClient.user?.id;
  const singlePassport = singlePassportData?.singlePassport;
  const location = singlePassport?.currentLocation;
  const citizenship = singlePassport?.citizenship;

  const connectedUsers =
    singlePassport?.connected === 'CONNECTED' ||
      singlePassport?.connected === 'ACCEPTED'
      ? true
      : false;

  const handleRemoveUser = () => {
    if (isModerotor && userId !== id) {
      Alert.alert(
        'Remove user from tribe',
        `Are you sure you want to remove ${firstName} ${lastName} from this tribe`,
        [
          {
            text: 'Cancel',
            onPress: () => { },
            style: 'cancel'
          },
          {
            text: 'Delete',
            onPress: async () => {
              try {
                await removeMember();
                refresh();
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

  const handleRequest = async () => {
    try {
      await requestConnection({
        variables: { payload: { id } }
      });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleNavigation = () => {
    if (userId === id) return;
    navigation.navigate('DrawerScreen', {
      screen: 'MemberDetailScreen',
      params: {
        title: `${firstName} ${lastName}`,
        details: { ...props, ...singlePassport }
      }
    });
  };

  return (
    <TouchableRipple
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
      }}
      disabled={userId === id}
      onPress={handleNavigation}
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
                : location?.country !== undefined
                  ? `${location?.state}, ${location?.country}`
                  : null}
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

        {isModerotor && userId !== id && (
          <Button
            mode="text"
            uppercase={false}
            loading={removeLoading}
            onPress={handleRemoveUser}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.SMALL_SIZE + 2),
              textTransform: 'capitalize',
              color: colors.WHITE,
              marginHorizontal: removeLoading ? 10 : 0
            }}
            contentStyle={{
              backgroundColor: colors.PRIMARY,
              height: RFValue(35),
              justifyContent: 'center',
              alignItems: 'center'
            }}
            style={{ width: RFValue(60), borderRadius: 5, marginLeft: 'auto' }}
          >
            {t(`community.chat.removeUser`)}
          </Button>
        )}

        {!isModerotor && userId !== id && (
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
        )}
      </Fragment>
    </TouchableRipple>
  );
}

export default React.memo(Member, () => false);
