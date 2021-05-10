import React, { useState, useEffect } from 'react';
import { ProgressBar, Title, Paragraph, Subheading } from 'react-native-paper';
import {
  TouchableHighlight,
  Platform,
  SafeAreaView,
  Alert
} from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import * as ImagePicker from 'expo-image-picker';
import { Mixpanel } from '../../../config';
import * as Permissions from 'expo-permissions';
import { Toast } from '../../../components/rootToaster';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../components/gradientButton';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import cloudinaryUpload, {
  CloudinaryUploadType,
  CloudinaryResponseType
} from '../../../utils/cloudinaryUpload';
import Storage from '../../../libs/storage';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, GradientContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

type StateType = {
  uri: string;
  loading: boolean;
  secure_url: string;
  formData: FormData | null;
  imageData: CloudinaryUploadType;
};

export default function AvatarUploadScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<StateType>({
    uri: '',
    secure_url: '',
    loading: false,
    formData: null,
    imageData: { uri: '', mime: undefined, cropRect: null }
  });

  const [addUserImage] = useMutation(ADD_USER_DETAILS, {
    variables: { details: { avatar: avatar.secure_url } }
  });

  const handleInputError = (error: string) => {
    Toast.show(t(`signup.avatarUploadScreen.${error}`));
  };

  const handleSubmit = async () => {
    if (!avatar.uri) return handleInputError('inputError');

    setAvatar({ ...avatar, loading: true });

    try {
      const formData = await cloudinaryUpload(avatar.imageData);
      const { secure_url } = (await formData.json()) as CloudinaryResponseType;
      setAvatar({ ...avatar, secure_url });

      Mixpanel.people_set_once({
        avatar: secure_url,
        updatedAt: new Date().toISOString()
      });

      await Storage.setUserRegistration({
        route: 'IdentifyUserScreen',
        user: { avatar: secure_url }
      });

      setImmediate(() => {
        navigation.navigate('IdentifyUserScreen');
        addUserImage();
      });
    } catch (error) {
      setAvatar({ ...avatar, loading: false });
      handleInputError('uploadError');
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleAvatar = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Sorry, we need camera roll permissions to make this work!'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      });

      if (result.cancelled) return;
      const { type, uri, width, height } = result;
      const imageData = { uri, mime: type, cropRect: { width, height } };
      setAvatar({ ...avatar, uri, imageData });
    } catch (error) {
      console.log(error);

      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  useEffect(() => {
    tagScreenName('AvatarUploadScreen');
    logEvent('avatar upload', { from: 'signup' });
    Mixpanel.track('Avatar Upload', {
      info: 'User on upload avatar screen',
      'Activity Screen': 'Avatar Upload Screen'
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container
        style={{ flex: 1, paddingLeft: RFValue(20), paddingRight: RFValue(20) }}
      >
        <ProgressBar
          progress={3 / 5}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: RFValue(30)
          }}
        />

        <Title
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
            color: colors.PRIMARY,
            textTransform: 'capitalize',
            lineHeight: RFValue(30)
          }}
        >
          {t(`signup.avatarUploadScreen.subTitle`)}
        </Title>

        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
            color: colors.PRIMARY_TEXT,
            lineHeight: RFValue(30),
            textTransform: 'capitalize',
            marginTop: 20
          }}
        >
          {t(`signup.avatarUploadScreen.title`)}
        </Title>

        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE),
            color: colors.SECONDARY_TEXT,
            lineHeight: RFValue(22),
            marginTop: 20
          }}
        >
          {t(`signup.avatarUploadScreen.paragraph`)}
        </Paragraph>

        <Container
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: RFValue(40),
            marginTop: RFValue(40)
          }}
        >
          <Container style={{ alignItems: 'center' }}>
            <TouchableHighlight
              onPress={handleAvatar}
              underlayColor={colors.PRIMARY}
              style={{
                width: RFValue(100),
                height: RFValue(100),
                borderRadius: RFValue(50),
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <GradientContainer
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[colors.PRIMARY, colors.SECONDARY]}
                style={{
                  width: RFValue(100),
                  height: RFValue(100),
                  borderRadius: RFValue(50),
                  overflow: 'hidden'
                }}
              >
                {avatar.uri ? (
                  <FastImage
                    source={{
                      uri: avatar.uri,
                      priority: FastImage.priority.high
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={{
                      width: '97%',
                      height: '97%',
                      borderRadius: RFValue(50)
                    }}
                  />
                ) : (
                  <Container
                    style={{
                      width: '97%',
                      height: '97%',
                      borderRadius: RFValue(50),
                      backgroundColor: colors.DISABLED,
                      borderWidth: RFValue(20),
                      borderColor: colors.WHITE,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Feather
                      name="camera"
                      size={RFValue(20)}
                      color={colors.PRIMARY}
                    />
                  </Container>
                )}
              </GradientContainer>
            </TouchableHighlight>

            <Subheading
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                marginTop: 20
              }}
            >
              {avatar.uri
                ? t(`signup.avatarUploadScreen.photoAdded`)
                : t(`signup.avatarUploadScreen.addAvatar`)}
            </Subheading>
          </Container>

          <Container style={{ width: '100%' }}>
            <GradientButton onPress={handleSubmit} loading={avatar.loading}>
              {t(
                `signup.avatarUploadScreen.${
                  avatar.loading ? 'upload' : 'submit'
                }`
              )}
            </GradientButton>
          </Container>
        </Container>
      </Container>
    </SafeAreaView>
  );
}
