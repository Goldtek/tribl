import React, { useEffect } from 'react';
import { Text, Paragraph, Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import { GET_SINGLE_PASSPORT } from '../../../../graphql/server/query';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { logEvent } from '../../../../utils/uxcamHelper';
import GradientButton from '../../../../components/gradientButton';
import { APPROVE_REJECT_NEW_CHANNEL } from '../../../../graphql/server/mutations';
import { Mixpanel } from '../../../../config';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { crashlytics } from '../../../../firebase/config';

import { Container, RightCover, ButtonCover } from './styles';

interface TribeRequestProp {
  name: string;
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  refetch: VoidFunction;
  userId: string;
}

export default function NewChannelRequest(props: TribeRequestProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { id, avatar, firstName, lastName, name, userId, refetch } = props;

  const handleMemberNavigation = () => {
    navigation.navigate('MemberDetailScreen', {
      details: { id: userId, firstName, lastName },
      title: `${firstName} ${lastName}`
    });
  };

  enum StatusOptions {
    APPROVED,
    DECLINED
  }

  const [acceptRequest, { loading }] = useMutation(APPROVE_REJECT_NEW_CHANNEL, {
    variables: {
      payload: { id: id, action: StatusOptions[0] }
    }
  });

  const [declineRequest, { loading: declineLoading }] = useMutation(
    APPROVE_REJECT_NEW_CHANNEL,
    {
      variables: {
        payload: { id: id, action: StatusOptions[1] }
      }
    }
  );

  const handleAcceptInvitation = async () => {
    logEvent('accept tribe request', { from: 'passport' });
    try {
      Mixpanel.track('Moderator Approves New Channel Creation', {
        info: `Moderator approves New Channel creation`,
        'Activity Screen': 'Community Details Screen'
      });
      await acceptRequest();
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const handleDeclineInvitation = async () => {
    logEvent('decline new channel creation', { from: 'community' });
    try {
      Mixpanel.track('Moderator Declines New Channel Creation', {
        info: `Moderator declines New Channel creation`,
        'Activity Screen': 'Community Details Screen'
      });
      await declineRequest();
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT, {
    variables: { id: userId }
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
            onPress={handleMemberNavigation}
          >{`${firstName} ${lastName}`}</Text>{' '}
          {t(`community.invitation.newChannelRequest`)} -{' '}
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
              lineHeight: RFValue(12),
              textTransform: 'capitalize'
            }}
            loading={declineLoading}
            onPress={handleDeclineInvitation}
          >
            {t(`community.invitation.reject`)}
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
              fontFamily: fonts.WORK_SANS_REGULAR,
              lineHeight: RFValue(13)
            }}
            loading={loading}
            onPress={handleAcceptInvitation}
          >
            {t(`community.invitation.approve`)}
          </GradientButton>
        </ButtonCover>
      </RightCover>
    </Container>
  );
}
