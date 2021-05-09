import React, { useState, useEffect, useRef } from 'react';
import { Title, Text, ProgressBar, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import GradientButton from '../../../components/gradientButton';

import { Container, HeaderCover, IconCover } from './styles';
import { PermissionsAndroid, Platform, View } from 'react-native';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CountryIdScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [hasCameraPermissions, setPermissions] = useState<unknown>(undefined);
  const details = props.route?.params?.details;
  const { name, iso2, emoji, number } = details;

  const [document, setDocument] = useState('');

  useEffect(() => {
    // assume all iOS users except permissions
    if (Platform.OS === 'ios') {
      setPermissions(true);
      return;
    }

    const checkAndroidPermissions = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      setPermissions(granted === PermissionsAndroid.RESULTS.GRANTED);
    };

    checkAndroidPermissions();
    tagScreenName('CountryIdScreen');
    logEvent('Verify user identity', { from: 'passport' });
  }, []);

  if (hasCameraPermissions === undefined) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text> Waiting on Camera Permissions... </Text>
      </View>
    );
  }

  const handleNavigation = () => {
    navigation.navigate('WalletScreen');
  };

  return (
    <Container>
      <HeaderCover>
        <ProgressBar
          progress={3 / 3}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: 10
          }}
        />
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE - 1),
            color: colors.PRIMARY,
            textTransform: 'capitalize',
            marginBottom: RFValue(10),
            marginTop: RFValue(15),
            lineHeight: RFValue(19)
          }}
        >
          {' '}
          {t(`community.passport.step`)} 3
        </Text>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE + 5),
            color: colors.PRIMARY_TEXT,
            lineHeight: RFValue(30)
          }}
        >
          {t(`community.passport.countryId`)}
        </Title>
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
            color: colors.SECONDARY_TEXT,
            textTransform: 'capitalize',
            marginBottom: RFValue(10),
            lineHeight: RFValue(19)
          }}
        >
          {t(`community.passport.capture`)}
        </Text>
      </HeaderCover>
      <TouchableRipple
        style={{
          height: RFValue(200),
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: colors.PRIMARY,
          marginHorizontal: RFValue(15)
        }}
      >
        <Feather name="camera" size={RFValue(25)} color={colors.PRIMARY} />
      </TouchableRipple>
      {!document?.length ? (
        <GradientButton
          onPress={handleNavigation}
          style={{ height: 50 }}
          gradientContainerstyle={{
            height: 50,
            marginBottom: RFValue(30),
            marginHorizontal: RFValue(15)
          }}
          contentStyle={{ height: 50 }}
        >
          {t(`community.passport.submit`)}
        </GradientButton>
      ) : (
        <IconCover>
          <Feather name="camera" size={RFValue(25)} color={colors.WHITE} />
        </IconCover>
      )}
    </Container>
  );
}
