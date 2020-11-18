import React, { Fragment, useCallback, useState } from 'react';
import { Button, Card } from 'react-native-paper';
import * as Sentry from '@sentry/react-native';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Mixpanel } from '../../config';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import {
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY
} from '../../graphql/server/mutations';
import {
  GET_COMMUNITY_MEMBERS,
  GET_NEARBY_MEMBERS_OF_A_COMMUNITY
} from '../../graphql/server/query';
import { CommunityInterface } from '../../graphql/types';
import { logEvent } from '../../utils/uxcamHelper';

function RecommendedCommunity(props: CommunityInterface) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [member, setMember] = useState(false);

  const { ...restProps } = props;

  const { avatar, name, membersCount, isMember, id } = restProps;

  const resizeAvatar = avatar?.split('upload/');

  const banner = resizeAvatar?.length
    ? resizeAvatar[0] +
      `upload/c_fill,g_auto,h_${RFValue(230 * 2)},w_${RFValue(
        DEVICE_FULL_WIDTH * 2
      )}/b_rgb:000000,y_-0.60/c_scale,co_rgb:ffffff,fl_relative,w_0.9,y_1/${
        resizeAvatar[1]
      }`
    : avatar;

  useQuery(GET_COMMUNITY_MEMBERS, { variables: { id } });
  useQuery(GET_NEARBY_MEMBERS_OF_A_COMMUNITY, {
    variables: { filter: { participantOf: { id } } }
  });

  const [joinCommunity, { loading: joinLoading }] = useMutation(
    JOIN_COMMUNITY,
    {
      variables: { payload: { communityId: id } }
    }
  );

  const [leaveCommunity, { loading: leaveLoading }] = useMutation(
    LEAVE_COMMUNITY,
    {
      variables: { payload: { communityId: id } }
    }
  );

  const handleJoin = async () => {
    logEvent('join community', { from: 'community' });
    try {
      Mixpanel.track('User Joins Tribe', {
        info: `User Joins ${name} Tribe`,
        'Activity Screen': 'Recommended Community Card'
      });
      await joinCommunity();
      setMember(true);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleLeave = async () => {
    logEvent('leave community', { from: 'community' });
    try {
      Mixpanel.track('User Leaves Tribe', {
        info: `User Leaves ${name} Tribe`,
        'Activity Screen': 'Recommended Community Card'
      });
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
          <Button
            mode="text"
            loading={isMember || member ? leaveLoading : joinLoading}
            onPress={isMember || member ? handleLeave : handleJoin}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              left: 15,
              marginLeft: 0
            }}
          >
            {isMember || member
              ? t(`community.recommended.leave`)
              : t(`community.recommended.join`)}
          </Button>
        )}
        style={{ flex: 1, paddingLeft: 0 }}
      />
    </Card>
  );
}

export default React.memo(RecommendedCommunity);
