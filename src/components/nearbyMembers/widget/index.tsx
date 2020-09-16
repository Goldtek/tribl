import React, { Fragment, useState, useCallback } from 'react';
import { Title, Paragraph, TouchableRipple, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { REQUEST_CONNECTION } from '../../../graphql/server/mutations';
import { PassportInterface } from '../../../graphql/types';
import { rootNavigator } from '../../../constants';
import hexToRGB from '../../../utils/hexToRGB';

// IMPORT FOR ALL CUSTOM STYLES
import { TextContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface PopularUserProp extends PassportInterface {
  closeNearbyModal(): void;
}

function NearbyModal(props: PopularUserProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { closeNearbyModal, ...member } = props;

  const {
    avatar,
    firstName,
    lastName,
    connected,
    currentLocation,
    phoneNumber
  } = member;

  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);

  const [requestConnection] = useMutation(REQUEST_CONNECTION, {
    variables: { payload: { phoneNumber } }
  });

  const handleRequest = async () => {
    setLoading(true);
    try {
      const { data } = await requestConnection();
      if (data?.requestConnection) {
        setLoading(false);
        setPending(true);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleMessageNavigation = useCallback(
    () =>
      rootNavigator.navigate('ChatScreen', {
        title: `${firstName} ${lastName}`
      }),
    []
  );

  const handleNavigation = () => {
    closeNearbyModal();
    rootNavigator.navigate('MemberDetailScreen', {
      title: `${firstName} ${lastName}`,
      details: { ...props }
    });
  };

  const { state, country } = currentLocation[0];

  return (
    <Fragment>
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
              borderRadius: RFValue(10)
            }}
          />
          <TextContainer>
            <Title
              style={{
                color: colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: fonts.LARGE_SIZE + 1,
                lineHeight: RFValue(18),
                textTransform: 'capitalize'
              }}
            >
              {`${firstName} ${lastName}`}
            </Title>
            <Paragraph
              style={{
                fontSize: fonts.LARGE_SIZE,
                fontFamily: fonts.WORK_SANS_REGULAR,
                lineHeight: RFValue(15),
                color: colors.SECONDARY_TEXT,
                textTransform: 'capitalize'
              }}
            >
              {`${state}, ${country}`}
            </Paragraph>
          </TextContainer>
          {connected == 'PENDING' || pending ? (
            <Button
              mode="text"
              disabled={true}
              uppercase={false}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize',
                color: colors.PRIMARY_TEXT
              }}
              contentStyle={{
                backgroundColor: colors.DISABLED,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              style={{
                borderRadius: 5,
                width: RFValue(80),
                height: RFValue(30),
                marginRight: RFValue(15)
              }}
            >
              {t(`community.recommended.pending`)}
            </Button>
          ) : connected == 'CONNECTED' ? (
            <Button
              mode="contained"
              uppercase={false}
              labelStyle={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize',
                color: colors.PRIMARY_TEXT
              }}
              contentStyle={{
                backgroundColor: colors.DISABLED,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              style={{
                borderRadius: 5,
                width: RFValue(80),
                height: RFValue(30),
                marginRight: RFValue(15)
              }}
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
                color: colors.WHITE,
                marginHorizontal: 12
              }}
              contentStyle={{
                backgroundColor: colors.PRIMARY,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              style={{ borderRadius: 5, width: RFValue(70) }}
              onPress={handleRequest}
            >
              {t(`community.recommended.add`)}+
            </Button>
          )}
        </Fragment>
      </TouchableRipple>
    </Fragment>
  );
}

export default React.memo(NearbyModal, () => false);
