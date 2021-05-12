import React, { Fragment } from 'react';
import { Title, Paragraph, TouchableRipple, Button } from 'react-native-paper';
import { useMutation } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../theme';
import { BLOCK_REPORT_USER } from '../../../../graphql/server/mutations';
import { PassportInterface } from '../../../../graphql/types';
import { rootNavigator } from '../../../../constants';
import hexToRGB from '../../../../utils/hexToRGB';
import { crashlytics } from '../../../../firebase/config';
import { Mixpanel } from '../../../../config';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface BlockedAccountProp extends PassportInterface {
  refetch: VoidFunction;
}

export default function BlockedAccount(props: BlockedAccountProp) {
  const { colors, fonts } = useThemeContext();

  const { t } = useTranslation();

  const { refetch, ...member } = props;

  const {
    id,
    avatar,
    lastName,
    firstName,
    currentLocation,
    citizenship
  } = member;

  const note = `${firstName} ${t(
    `community.memberPassport.unblock`
  )} ${firstName}`;

  enum status {
    UNBLOCK
  }

  const [unBlockUser, { loading }] = useMutation(BLOCK_REPORT_USER, {
    variables: {
      payload: {
        passportId: id,
        status: status[0],
        notes: note
      }
    }
  });

  const handleUnBlock = async () => {
    try {
      Mixpanel.track('UnBlock User', {
        info: `UnBlock ${firstName}`,
        'Activity Screen': 'Community Screen'
      });
      await unBlockUser();
      refetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const handleNavigation = () => {
    rootNavigator.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: member
    });
  };

  const city = currentLocation?.city;
  const state = currentLocation?.state;
  const country = currentLocation?.country;

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
          ) : country !== undefined ? (
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
          ) : null}
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

        <Button
          loading={loading}
          mode="text"
          uppercase={false}
          labelStyle={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            textTransform: 'capitalize',
            color: colors.WHITE,
            marginHorizontal: 0
          }}
          contentStyle={{
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: RFValue(10)
          }}
          style={{ borderRadius: 5 }}
          onPress={handleUnBlock}
        >
          {t(`community.memberPassport.unblock`)}
        </Button>
      </Fragment>
    </TouchableRipple>
  );
}
