import React, { useState, useEffect } from 'react';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { Mixpanel } from '../../config';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import { useNavigation } from '@react-navigation/native';
import hexToRGB from '../../utils/hexToRGB';
import { REQUEST_CONNECTION } from '../../graphql/server/mutations';
import { PassportInterface, UserPassportInterface } from '../../graphql/types';
import { GET_SINGLE_PASSPORT } from '../../graphql/server/query';
import AdminBadge from '../adminBadge';
import { logEvent, hideSensitiveView } from '../../utils/uxcamHelper';
import { crashlytics } from '../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer, AvatarContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface RecommendedUserProp extends PassportInterface {}

export default function RecommendedUser(props: RecommendedUserProp) {
  const { colors, fonts } = useThemeContext();

  const navigation = useNavigation();
  const { t } = useTranslation();
  const [request, setRequest] = useState(false);
  const [member, setMember] = useState(props);

  const {
    id,
    avatar,
    pending,
    lastName,
    firstName,
    citizenship,
    moderatorOf,
    currentLocation,
    connectionDetails
  } = member;

  const [getUserPassport, { data }] = useLazyQuery<UserPassportInterface>(
    GET_SINGLE_PASSPORT,
    { variables: { id } }
  );

  const [requestConnection, { loading }] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { id } }
  });

  useEffect(() => {
    if (
      connectionDetails?.status == 'PENDING' ||
      pending == 'PENDING' ||
      pending == 'REQUESTED'
    ) {
      getUserPassport();
    }

    if (data?.singlePassport) {
      setMember({ ...member, ...data?.singlePassport });
    }
  }, []);

  const handleRequest = async () => {
    logEvent('request connection', { from: 'passport' });
    try {
      Mixpanel.track('User Adds Connection', {
        info: `User adds ${firstName} ${lastName} as a connection`,
        'Activity Screen': 'Recommended member passport card'
      });
      await requestConnection();
      setRequest(true);
    } catch (error) {
      crashlytics.recordError(new Error(error));
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

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'MemberDetailScreen',
      params: {
        title: `${firstName} ${lastName}`,
        details: { ...member }
      }
    });
  };

  return (
    <Card
      onPress={handleNavigation}
      style={{
        width: RFValue(DEVICE_FULL_WIDTH / 3),
        height: RFValue(215),
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 20,
        marginRight: 15,
        borderWidth: 0.5,
        borderColor: hexToRGB(colors.DISABLED, 0.3)
      }}
    >
      <Card.Content
        style={{
          width: RFValue(DEVICE_FULL_WIDTH / 3),
          height: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 0,
          paddingRight: 0
        }}
      >
        <AvatarContainer>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: avatar,
              priority: FastImage.priority.high
            }}
            style={{
              width: RFValue(70),
              height: RFValue(70),
              borderRadius: RFValue(70)
            }}
          />
          {moderatorOf?.length ? (
            <AdminBadge
              style={{
                position: 'absolute',
                bottom: RFValue(-5),
                right: RFValue(-25)
              }}
            />
          ) : null}
        </AvatarContainer>
        <TextContainer ref={hideSensitiveView}>
          <Title
            numberOfLines={1}
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              color: colors.PRIMARY_TEXT,
              marginTop: 0,
              marginBottom: 0,
              paddingHorizontal: RFValue(10),
              textTransform: 'capitalize'
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          {currentLocation?.city ? (
            <Paragraph
              numberOfLines={1}
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginTop: 0,
                marginBottom: 0,
                paddingHorizontal: RFValue(10)
              }}
            >
              {`${currentLocation?.city}, ${currentLocation?.state}`}
            </Paragraph>
          ) : (
            <Paragraph
              numberOfLines={1}
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginTop: 0,
                marginBottom: 0,
                paddingHorizontal: RFValue(10)
              }}
            >
              {`${currentLocation?.state}, ${currentLocation?.country}`}
            </Paragraph>
          )}
          {citizenship?.length ? (
            <Title
              style={{
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                marginTop: RFValue(1)
              }}
            >
              {citizenship?.map((country) => country.flag)}
            </Title>
          ) : null}
        </TextContainer>
        {connectionDetails?.status == 'PENDING' ||
        pending == 'PENDING' ||
        pending == 'REQUESTED' ||
        request ? (
          <Button
            disabled={true}
            mode="contained"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.PRIMARY_TEXT
            }}
            contentStyle={{ width: '100%', backgroundColor: colors.DISABLED }}
            style={{ borderRadius: 5 }}
          >
            {t(`community.recommended.pending`)}
          </Button>
        ) : connectionDetails?.status === 'ACCEPTED' ? (
          <Button
            mode="outlined"
            uppercase={false}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.PRIMARY
            }}
            contentStyle={{
              width: '100%',
              backgroundColor: colors.WHITE,
              borderColor: colors.PRIMARY_TEXT
            }}
            style={{ borderRadius: 5, borderColor: colors.PRIMARY_TEXT }}
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
              fontSize: RFValue(fonts.MEDIUM_SIZE),
              textTransform: 'capitalize',
              color: colors.WHITE
            }}
            contentStyle={{
              width: '100%',
              backgroundColor: colors.PRIMARY
            }}
            style={{ borderRadius: 5 }}
            onPress={handleRequest}
          >
            {t(`community.recommended.add`)}+
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}
