import React, { Fragment, useState } from 'react';
import { Title, Paragraph, TouchableRipple, Button } from 'react-native-paper';
import { useMutation } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { REQUEST_CONNECTION } from '../../../graphql/server/mutations';
import { PassportInterface } from '../../../graphql/types';
import { rootNavigator } from '../../../constants';
import hexToRGB from '../../../utils/hexToRGB';
import { crashlytics } from '../../../firebase/config';
import { logEvent } from '../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface NearbyUserProp extends PassportInterface {
  NearbyUserModal(): void;
}

function NearbyModal(props: NearbyUserProp) {
  const { colors, fonts } = useThemeContext();

  const { t } = useTranslation();

  const { NearbyUserModal, ...member } = props;

  const {
    id,
    avatar,
    pending,
    lastName,
    firstName,
    currentLocation,
    connectionDetails,
    citizenship
  } = member;

  const [request, setRequest] = useState(false);

  const [requestConnection, { loading }] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { id } }
  });

  const handleRequest = async () => {
    logEvent('request connection', { from: 'passport' });
    try {
      await requestConnection();
      setRequest(true);
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const handleNavigation = () => {
    NearbyUserModal();
    rootNavigator.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: member
    });
  };

  const handleMessageNavigation = async () => {
    NearbyUserModal();
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

  const state = currentLocation?.state;
  const country = currentLocation?.country;
  const city = currentLocation?.city;

  return (
    <TouchableRipple
      onPress={handleNavigation}
      rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
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
              lineHeight: RFValue(16)
            }}
          >
            {`${firstName} ${lastName}`}
          </Title>
          {city && state ? (
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(15),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${city}, ${state}`}
            </Paragraph>
          ) : (
            <Paragraph
              style={{
                fontSize: RFValue(fonts.LARGE_SIZE - 2),
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(15),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${state}, ${country}`}
            </Paragraph>
          )}
          {citizenship?.length ? (
            <Title
              style={{
                fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.1)),
                lineHeight: RFValue(16)
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
        ) : connectionDetails?.status === 'ACCEPTED' ? (
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
    </TouchableRipple>
  );
}

export default React.memo(NearbyModal, () => false);
