import React, { Fragment, useState } from 'react';
import { Button, Text, TouchableRipple, Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { Alert } from 'react-native';
import { GET_SINGLE_PASSPORT } from '../../../../graphql/server/query';
import { rootNavigator } from '../../../../constants';
import { useThemeContext } from '../../../../theme';
import hexToRGB from '../../../../utils/hexToRGB';
import { chatClient, LocalUserType } from '../../../../stream/types';
import { SinglePassportRequestInterface } from '../../../../graphql/types';
import { useTranslation } from 'react-i18next';
import { useStreamContext } from '../../../../stream';
import { crashlytics } from '../../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ChannelUserProp extends LocalUserType { }

export default function GroupMember(props: ChannelUserProp) {
  const user = props;
  const { t } = useTranslation();
  const { channel } = useStreamContext();
  const { colors, fonts } = useThemeContext();
  const [loading, setLoading] = useState(false);

  const groupAdmin = channel.data?.created_by;
  const memberRole = groupAdmin?.id === user?.id ? 'admin' : 'member';
  const isAdmin = groupAdmin?.id === chatClient.user?.id ? true : false;
  const displayDelete = user?.id !== chatClient.user?.id ? true : false;
  const citizenship = JSON.parse(
    ((user?.citizenship as unknown) as string) || '[]'
  );

  let data: SinglePassportRequestInterface | undefined;

  if (user?.id) {
    const result = useQuery<SinglePassportRequestInterface>(GET_SINGLE_PASSPORT, {
      variables: { id: user?.id }
    });

    data = result?.data;
  }


  const handleNavigation = () => {
    if (chatClient.user?.id === user?.id) {
      return;
    }

    rootNavigator.navigate('MemberDetailScreen', {
      title: user?.name,
      details: { ...user, ...data?.singlePassport }
    });
  };

  const removeUserFromGroup = () => {
    if (isAdmin && displayDelete) {
      Alert.alert(
        'Remove user',
        `Are you sure you want to remove ${user?.name} from this group`,
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
                setLoading(true);
                await channel.removeMembers([`${user?.id}`]);
                await channel.sendMessage({
                  text: `${`${user?.name}`?.split(' ')[0]} was removed by ${chatClient.user?.name?.split(' ')[0]
                    }`,
                  group_system: true,
                  receiver: {
                    id: `${user?.id}`,
                    name: `${user?.name}`,
                    image: `${user?.image}`
                  }
                });

                setLoading(false);
              } catch (error) {
                setLoading(false);
                crashlytics.recordError(new Error(error));
                crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
              }
            }
          }
        ]
      );
    }
  };

  return (
    <TouchableRipple
      onPress={handleNavigation}
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
            uri: user?.image,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(50),
            height: RFValue(50),
            borderRadius: RFValue(5)
          }}
        />
        <TextContainer>
          <Text
            numberOfLines={1}
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE - 1),
              textTransform: 'capitalize'
            }}
          >
            {`${user?.name}`}
          </Text>
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.SMALL_SIZE + 2),
              textTransform: 'capitalize'
            }}
          >
            {memberRole}
          </Text>
          {citizenship?.length ? (
            <Title
              style={{
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                lineHeight: RFValue(18)
              }}
            >
              {citizenship?.map((country: any) => country?.flag)}
            </Title>
          ) : null}
        </TextContainer>

        {isAdmin && displayDelete && (
          <Button
            mode="text"
            uppercase={false}
            loading={loading}
            onPress={removeUserFromGroup}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.SMALL_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE,
              marginHorizontal: loading ? 10 : 0
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
        )}
      </Fragment>
    </TouchableRipple>
  );
}
