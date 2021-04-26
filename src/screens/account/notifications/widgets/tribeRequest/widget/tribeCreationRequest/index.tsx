import React, { useEffect } from 'react';
import { Text, Paragraph, Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../../../theme';
import { GET_SINGLE_PASSPORT } from '../../../../../../../graphql/server/query';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { logEvent } from '../../../../../../../utils/uxcamHelper';
import GradientButton from '../../../../../../../components/gradientButton';
import { APPROVE_REJECT_NEW_TRIBE } from '../../../../../../../graphql/server/mutations';
import { Mixpanel } from '../../../../../../../config';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { crashlytics } from '../../../../../../../firebase/config';

import { Container, RightCover, ButtonCover } from './styles';

interface TribeRequestProp {
  name: string;
  id: string;
  avatar: string;
  moderators: [{ firstName: string; lastName: string; id: string }];
  refetch: VoidFunction;
}

export default function TribeRequest(props: TribeRequestProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { id, avatar, name, moderators, refetch } = props;

  const handleMemberNavigation = () => {
    navigation.navigate('MemberDetailScreen', {
      details: {
        id: moderators[0]?.id,
        firstName: moderators[0]?.firstName,
        lastName: moderators[0]?.lastName
      },
      title: `${moderators[0]?.firstName} ${moderators[0]?.lastName}`
    });
  };

  const handleTribeNavigation = () => {
    navigation.navigate('CommunityDetailScreen', {
      details: { id }
    });
  };

  enum StatusOptions {
    APPROVED,
    DECLINED
  }

  const [acceptRequest, { loading }] = useMutation(APPROVE_REJECT_NEW_TRIBE, {
    variables: {
      payload: { id: id, action: StatusOptions[0] }
    }
  });

  const [declineRequest, { loading: declineLoading }] = useMutation(
    APPROVE_REJECT_NEW_TRIBE,
    {
      variables: {
        payload: { id: id, action: StatusOptions[1] }
      }
    }
  );

  const handleAcceptInvitation = async () => {
    logEvent('accept tribe creation', { from: 'passport' });
    try {
      Mixpanel.track('Super Admin Accepts Tribe Creation', {
        info: `Admin accepts tribe creation`,
        'Activity Screen': 'Tribe Request Screen'
      });
      await acceptRequest();
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const handleDeclineInvitation = async () => {
    logEvent('decline new tribe creation', { from: 'passport' });
    try {
      Mixpanel.track('Super Admin Declines Tribe Creation', {
        info: `Admin declines tribe invicreationte`,
        'Activity Screen': 'Tribe Request Screen'
      });
      await declineRequest();
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const [getUserPassport] = useLazyQuery(GET_SINGLE_PASSPORT, {
    variables: { id: moderators[0]?.id }
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
          >
            {`${moderators[0]?.firstName} ${moderators[0]?.lastName}`}
            {'  '}
          </Text>
          {t(`community.invitation.newTribeRequest`)} -{' '}
          <Text
            style={{
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              flexWrap: 'wrap'
            }}
            onPress={handleTribeNavigation}
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
              fontFamily: fonts.WORK_SANS_REGULAR
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
