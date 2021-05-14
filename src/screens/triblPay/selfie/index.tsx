import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PermissionsAndroid, Platform, View } from 'react-native';
//@ts-ignore
import { VouchedFaceCamera } from '@vouched.id/vouched-react-native';
import { Title, Text, ProgressBar, TouchableRipple } from 'react-native-paper';

import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { getSession } from '../../../vouched/vouched';
import { CountryInterface } from '../../../libs/countries';
import { MyPassportInterface } from '../../../graphql/types';
import GradientButton from '../../../components/gradientButton';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

import { Container, HeaderCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: {
    params: { userDetails: MyPassportInterface; details: CountryInterface };
  };
}

export default function SelfieScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const cameraRef = useRef<typeof VouchedFaceCamera>(null);

  const [session] = useState(getSession());
  const [message, setMessage] = useState('loading...');
  const [document, setDocument] = useState(null);
  const [job, setJob] = useState<any>(null);
  const [hasCameraPermissions, setPermissions] = useState<unknown>(undefined);

  const { details, userDetails } = props.route.params;

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
    navigation.navigate('DocumentTypeSelectionScreen', {
      details,
      userDetails,
      job
    });
  };

  const refinedInstructions = (instruction: string) => {
    switch (instruction) {
      case 'ONLY_ONE':
        return 'Only One';
      case 'HOLD_STEADY':
        return 'Hold Steady';
      case 'MOVE_CLOSER':
        return 'Move Closer';
      case 'MOVE_AWAY':
        return 'Move Away';
      case 'OPEN_MOUTH':
        return 'Open Mouth';
      case 'CLOSE_MOUTH':
        return 'Close Mouth';
      case 'LOOK_FORWARD':
        return 'Look Forward';
      case 'BLINK_EYES':
        return 'Blink Eyes';

      default:
        return 'No face detected';
    }
  };

  const rescan = () => {
    cameraRef.current.restart();
    setJob(null);
    setDocument(null);
  };

  return (
    <Container>
      <HeaderCover>
        <ProgressBar
          progress={3 / 6}
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
          {t(`community.passport.step`)} 2
        </Text>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE + 5),
            color: colors.PRIMARY_TEXT,
            lineHeight: RFValue(30)
          }}
        >
          Take a Selfie
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
        ></Text>
      </HeaderCover>

      <View
        style={{
          marginHorizontal: RFValue(15),
          flex: 3
        }}
      >
        <View
          style={{
            flex: 1,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: colors.PRIMARY
          }}
        >
          <VouchedFaceCamera
            ref={cameraRef}
            livenessMode="DISTANCE"
            onFaceStream={async (faceDetectionResult: any) => {
              const { instruction, step } = faceDetectionResult;
              if (step === 'POSTABLE') {
                cameraRef.current.stop();
                setMessage('Processing...');

                try {
                  const job = await session.postFace(faceDetectionResult);
                  setMessage('Please continue to next step');
                  setDocument(faceDetectionResult);
                  setJob(job);
                } catch (e) {
                  console.error(e);
                }
              } else {
                setMessage(refinedInstructions(instruction));
              }
            }}
          />
          {document && (
            <View
              style={{
                position: 'absolute',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: colors.ONLINE,
                width: '100%'
              }}
            >
              <TouchableRipple onPress={rescan}>
                <MaterialCommunityIcons
                  name="camera-retake"
                  size={RFValue(30)}
                  color={colors.ONLINE}
                />
              </TouchableRipple>
            </View>
          )}
        </View>

        <Text>{message}</Text>
      </View>

      {job ? (
        <GradientButton
          // onPress={
          //   job
          //     ? job.result.success || job.errors
          //       ? rescan
          //       : handleNavigation
          //     : undefined
          // }
          onPress={handleNavigation}
          style={{ height: 50 }}
          gradientContainerstyle={{
            height: 50,
            marginBottom: RFValue(30),
            marginHorizontal: RFValue(15)
          }}
          contentStyle={{ height: 50 }}
        >
          {/* {job
          ? job.result.success || job.errors
            ? 'Rescan document'
            : 'submit'
          : null} */}
          Proceed
        </GradientButton>
      ) : (
        <View style={{ height: 100 }}></View>
      )}
    </Container>
  );
}
