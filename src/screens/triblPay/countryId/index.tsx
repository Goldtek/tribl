import React, { useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform, View } from 'react-native';
import { Title, Text, ProgressBar, TouchableRipple } from 'react-native-paper';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  VouchedIdCamera,
  VouchedSession
} from '@vouched.id/vouched-react-native';

import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import GradientButton from '../../../components/gradientButton';

import { Container, HeaderCover, IconCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

const session = new VouchedSession('M!k9d!xD#pW#a.21mnFPIAkRww~Plh');
export default function CountryIdScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [message, setMessage] = useState('loading...');
  const [document, setDocument] = useState(null);
  const [job, setJob] = useState(null);
  const cameraRef = useRef<typeof VouchedIdCamera>(null);
  const [hasCameraPermissions, setPermissions] = useState<unknown>(undefined);
  const details = props.route?.params?.details;
  const { name, iso2, emoji, number } = details;

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

      <View
        style={{
          marginHorizontal: RFValue(15)
        }}
      >
        <View
          style={{
            height: RFValue(200),
            borderWidth: 2,
            borderColor: colors.PRIMARY
          }}
        >
          <VouchedIdCamera
            ref={cameraRef}
            enableDistanceCheck={false}
            onIdStream={async (cardDetectionResult: any) => {
              const { instruction, step } = cardDetectionResult;

              if (step === 'POSTABLE') {
                cameraRef.current.stop();
                setMessage('Processing');
                try {
                  setMessage('Please continue to next step');
                  const job = await session.postFrontId(cardDetectionResult);
                  setDocument(cardDetectionResult);
                  setJob(job);
                } catch (e) {
                  console.error(e);
                }
              } else {
                setMessage(instruction);
              }
            }}
          />
        </View>
        <Text>{message}</Text>
        {document && (
          <View
            style={{
              position: 'absolute',
              height: RFValue(200),
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: colors.ONLINE,
              width: '100%'
            }}
          >
            <TouchableRipple
              onPress={() => {
                setDocument(null);
                cameraRef.current.restart();
              }}
            >
              <MaterialCommunityIcons
                name="camera-retake"
                size={RFValue(30)}
                color={colors.ONLINE}
              />
            </TouchableRipple>
          </View>
        )}
      </View>

      {document ? (
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
          Scan back
        </GradientButton>
      ) : (
        <View style={{ height: 100 }}></View>
      )}
    </Container>
  );
}
