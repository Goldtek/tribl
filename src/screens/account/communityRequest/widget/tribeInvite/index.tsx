import React, { useEffect } from 'react';
import { Text, Paragraph, Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../../../../theme';
import { GET_SINGLE_PASSPORT } from '../../../../../graphql/server/query';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { logEvent } from '../../../../../utils/uxcamHelper';
import GradientButton from '../../../../../components/gradientButton';
import { TRIBE_INVITE_ACTION } from '../../../../../graphql/server/mutations';
import { Mixpanel } from '../../../../../config';
import { crashlytics } from '../../../../../firebase/config';
import formatMessageTime from '../../../../../utils/timesince';

import { Container, RightCover, ButtonCover } from './styles';

interface NotificationProp {
  id: string;
  name: string;
  avatar: string;
  userId: string;
  tribeId: string;
  lastName: string;
  firstName: string;
  createdAt: string;
  refetch: VoidFunction;
}

export default function Notification(props: NotificationProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    id,
    avatar,
    firstName,
    lastName,
    name,
    refetch,
    userId,
    tribeId,
    createdAt
  } = props;

  enum InvitationStatus {
    ACCEPTED,
    PENDING,
    DECLINED
  }

  const timeStamp = formatMessageTime(Number(createdAt));

  const handleMemberNavigation = () => {
    navigation.navigate('MemberDetailScreen', {
      details: { id: userId, firstName, lastName },
      title: `${firstName} ${lastName}`
    });
  };

  const handleTribeNavigation = () => {
    navigation.navigate('CommunityDetailScreen', {
      title: name,
      details: { id: tribeId }
    });
  };

  const [acceptInvite, { loading }] = useMutation(TRIBE_INVITE_ACTION);

  const [declineInvite, { loading: declineLoading }] = useMutation(
    TRIBE_INVITE_ACTION
  );

  const handleAcceptInvitation = async () => {
    logEvent('accept tribe invite', { from: 'passport' });
    try {
      Mixpanel.track('User Accepts Connection Request', {
        info: `User accepts tribe invite`,
        'Activity Screen': 'Tribe Request Screen'
      });
      await acceptInvite({
        variables: {
          payload: { id: id, action: InvitationStatus[0] }
        }
      });
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const handleDeclineInvitation = async () => {
    logEvent('decline tribe invite', { from: 'passport' });
    try {
      Mixpanel.track('User Declines Connection Request', {
        info: `User declines tribe invite`,
        'Activity Screen': 'Tribe Request Screen'
      });
      await declineInvite({
        variables: {
          payload: { id: id, action: InvitationStatus[2] }
        }
      });
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT);

  useEffect(() => {
    if (id) {
      getUserPassport({ variables: { id: userId } });
    }
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
          width: RFValue(60),
          height: RFValue(60),
          borderRadius: RFValue(4)
        }}
      />
      <RightCover>
        <Paragraph
          style={{
            fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
            fontFamily: fonts.WORK_SANS_REGULAR,
            color: colors.PRIMARY_TEXT
          }}
        >
          <Text
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
            onPress={handleMemberNavigation}
          >{`${firstName} ${lastName}`}</Text>{' '}
          invited you to join the tribe -{' '}
          <Text
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize'
            }}
            onPress={handleTribeNavigation}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: RFValue(fonts.SMALL_SIZE + 1),
              fontFamily: fonts.WORK_SANS_REGULAR,
              color: colors.PRIMARY_TEXT,
              flexWrap: 'wrap'
            }}
          >
            {'  '}
            {timeStamp}
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
            {t(`community.invitation.decline`)}
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
            {t(`community.invitation.accept`)}
          </GradientButton>
        </ButtonCover>
      </RightCover>
    </Container>
  );
}
