import React, { Fragment, useCallback, useState } from 'react';
import { Button, Card } from 'react-native-paper';
import * as Sentry from '@sentry/react-native';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import {
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY
} from '../../graphql/server/mutations';
import { GET_COMMUNITY_MEMBERS } from '../../graphql/server/query';
import { CLOUDINARY_BANNER, CLOUDINARY_THUMBNAIL } from '../../constants';
import { CommunityInterface } from '../../graphql/types';

function RecommendedCommunity(props: CommunityInterface) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [member, setMember] = useState(false);

  const { ...restProps } = props;

  const { avatar, name, membersCount, isMember, id } = restProps;

  const resizeAvatar = avatar?.split('upload/');

  const banner = resizeAvatar?.length
    ? `${resizeAvatar[0]}${CLOUDINARY_BANNER}${resizeAvatar[1]}`
    : avatar;

  const thumbnail = resizeAvatar?.length
    ? `${resizeAvatar[0]}${CLOUDINARY_THUMBNAIL}${resizeAvatar[1]}`
    : avatar;

  useQuery(GET_COMMUNITY_MEMBERS, { variables: { id } });

  const [joinCommunity, { loading }] = useMutation(JOIN_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const [leaveCommunity, { loading: leaveLoading }] = useMutation(
    LEAVE_COMMUNITY,
    {
      variables: { payload: { communityId: id } }
    }
  );

  const handleJoin = async () => {
    try {
      await joinCommunity();
      setMember(true);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveCommunity();
      setMember(false);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleNavigation = useCallback(() => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: restProps
    });
  }, []);

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: '100%',
        height: RFValue(300),
        alignItems: 'center',
        backgroundColor: colors.GREY,
        marginTop: 3,
        elevation: 0
      }}
    >
      <Card.Content
        style={{
          width: DEVICE_FULL_WIDTH - 30,
          height: RFValue(230),
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{ uri: banner, priority: FastImage.priority.high }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 4
          }}
        />
      </Card.Content>
      <Card.Title
        title={name}
        subtitle={
          membersCount <= 1
            ? `${membersCount} ${t(`community.tabPanel.member`)}`
            : `${membersCount} ${t(`community.tabPanel.member`)}s`
        }
        titleStyle={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
          color: colors.PRIMARY_TEXT,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0
        }}
        subtitleStyle={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE),
          textTransform: 'capitalize',
          color: colors.SECONDARY_TEXT,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0
        }}
        left={({ size }) => (
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: avatar, priority: FastImage.priority.high }}
            style={{
              width: RFValue(size + 2),
              height: RFValue(size + 2),
              borderRadius: 5
            }}
          />
        )}
        right={() => (
          <Fragment>
            {isMember || member ? (
              <Button
                mode="text"
                loading={leaveLoading}
                onPress={handleLeave}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  left: 15
                }}
              >
                {t(`community.recommended.leave`)}
              </Button>
            ) : (
              <Button
                mode="text"
                loading={loading}
                onPress={handleJoin}
                labelStyle={{
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  left: 15
                }}
              >
                {t(`community.recommended.join`)}
              </Button>
            )}
          </Fragment>
        )}
        style={{ flex: 1, paddingLeft: 0 }}
      />
    </Card>
  );
}

export default React.memo(RecommendedCommunity);
