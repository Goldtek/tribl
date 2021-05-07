import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Share } from 'react-native';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { RFValue } from 'react-native-responsive-fontsize';
import { crashlytics } from '../../../firebase/config';
import { Title, Text, Button } from 'react-native-paper';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';

import { GradientContainer } from './styles';

interface ScreenProp extends NavigationInterface {}

export default function WaitlistScreen(props: ScreenProp) {
  const { route } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const detail = route?.params;

  useEffect(() => {
    tagScreenName('WaitlistScreen');
  }, []);

  const onShare = async () => {
    try {
      const { action } = await Share.share(
        {
          title: t(`signup.passportScreen.title`),
          message: detail?.inviteURL
        },
        {
          dialogTitle: t(`signup.passportScreen.title`)
        }
      );

      if (action === Share.dismissedAction) return;

      // PROFILE SHARED HERE
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  return (
    <GradientContainer colors={[colors.PRIMARY, colors.SECONDARY]}>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 5),
          color: colors.WHITE,
          textAlign: 'center',
          marginHorizontal: RFValue(25),
          marginBottom: RFValue(40)
        }}
      >
        {t('signup.waitListScreen.title')}
      </Title>
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE + 5),
          color: colors.WHITE,
          textAlign: 'center',
          marginHorizontal: RFValue(25),
          marginBottom: RFValue(40)
        }}
      >
        {t('signup.waitListScreen.waitlistNumber')} {detail?.placeInLine}
      </Title>
      <Text
        style={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.WHITE,
          textAlign: 'center',
          marginHorizontal: RFValue(25)
        }}
      >
        {t('signup.waitListScreen.earlyAccess')}
      </Text>
      <Button
        mode="text"
        onPress={onShare}
        uppercase={false}
        labelStyle={{
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          color: colors.PRIMARY,
          textTransform: 'capitalize'
        }}
        contentStyle={{
          backgroundColor: colors.WHITE,
          width: '100%',
          height: RFValue(45)
        }}
        style={{
          marginHorizontal: RFValue(15),
          marginBottom: RFValue(70),
          marginTop: RFValue(150)
        }}
      >
        {t('signup.waitListScreen.invite')}
      </Button>
    </GradientContainer>
  );
}
