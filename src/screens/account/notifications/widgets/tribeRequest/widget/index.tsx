import React, { useEffect } from 'react';
import { Text, Paragraph, Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../../theme';
import { GET_SINGLE_PASSPORT } from '../../../../../../graphql/server/query';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { logEvent } from '../../../../../../utils/uxcamHelper';
import GradientButton from '../../../../../../components/gradientButton';
import { TRIBE_INVITE_ACTION } from '../../../../../../graphql/server/mutations';
import { Mixpanel } from '../../../../../../config';
import { crashlytics } from '../../../../../../firebase/config';

import { Container, RightCover, ButtonCover } from './styles';

interface NotificationProp {
  name: string;
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  refetch: VoidFunction;
}

export default function Notification(props: NotificationProp) {
  const { colors, fonts } = useThemeContext();
  const { id, avatar, firstName, lastName, name, refetch } = props;

  enum InvitationStatus {
    ACCEPTED,
    PENDING,
    DECLINED
  }

  const [acceptInvite, { loading }] = useMutation(TRIBE_INVITE_ACTION, {
    variables: {
      payload: { id: id, action: InvitationStatus[0] }
    }
  });

  const [declineInvite, { loading: declineLoading }] = useMutation(
    TRIBE_INVITE_ACTION,
    {
      variables: {
        payload: { id: id, action: InvitationStatus[2] }
      }
    }
  );

  const handleAcceptInvitation = async () => {
    logEvent('accept tribe invite', { from: 'passport' });
    try {
      Mixpanel.track('User Accepts Connection Request', {
        info: `User accepts tribe invite`,
        'Activity Screen': 'Tribe Request Screen'
      });
      await acceptInvite();
      props.refetch();
      console.tron('accepted');
    } catch (error) {
      crashlytics.recordError(error);
      console.tron('accepted', error);
    }
  };

  const handleDeclineInvitation = async () => {
    logEvent('decline tribe invite', { from: 'passport' });
    try {
      Mixpanel.track('User Declines Connection Request', {
        info: `User declines tribe invite`,
        'Activity Screen': 'Tribe Request Screen'
      });
      await declineInvite();
      props.refetch();
      console.tron('declined');
    } catch (error) {
      crashlytics.recordError(error);
      console.tron('declined', error);
    }
  };

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT, {
    variables: { id }
  });

  useEffect(() => {
    getUserPassport();
  }, []);

  return (
    <Container>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: avatar,
          priority: FastImage.priority.high
        }}
        style={{
          width: RFValue(35),
          height: RFValue(35),
          borderRadius: RFValue(4)
        }}
      />
      <RightCover>
        <Paragraph
          style={{
            fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            color: colors.PRIMARY_TEXT,
            flexWrap: 'wrap',
            marginRight: RFValue(15),
            paddingRight: RFValue(15)
          }}
        >
          <Text
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              flexWrap: 'wrap'
            }}
          >{`${firstName} ${lastName}`}</Text>{' '}
          invited you to join the tribe -{' '}
          <Text
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              flexWrap: 'wrap'
            }}
          >
            {name}
            {'  '}
          </Text>
          <Text
            style={{
              fontSize: RFValue(fonts.SMALL_SIZE + 1),
              fontFamily: fonts.WORK_SANS_REGULAR,
              color: colors.PRIMARY_TEXT,
              flexWrap: 'wrap'
            }}
          >
            {'  '}2 mins ago
          </Text>
        </Paragraph>
        <ButtonCover>
          <Button
            mode="outlined"
            style={{
              height: RFValue(30),
              marginRight: RFValue(15),
              borderRadius: 4
            }}
            contentStyle={{
              height: RFValue(30),
              paddingHorizontal: RFValue(15)
            }}
            uppercase={false}
            labelStyle={{
              color: colors.SECONDARY_TEXT,
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              fontFamily: fonts.WORK_SANS_REGULAR,
              textTransform: 'capitalize'
            }}
            loading={declineLoading}
            onPress={handleDeclineInvitation}
          >
            decline
          </Button>
          <GradientButton
            style={{ height: RFValue(30) }}
            contentStyle={{
              height: RFValue(30),
              paddingHorizontal: RFValue(15)
            }}
            gradientContainerstyle={{ height: RFValue(30), marginTop: 0 }}
            labelStyle={{
              fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
              fontFamily: fonts.WORK_SANS_REGULAR
            }}
            loading={loading}
            onPress={handleAcceptInvitation}
          >
            accept
          </GradientButton>
        </ButtonCover>
      </RightCover>
    </Container>
  );
}
