import React, { useState, useEffect } from 'react';
import ImageResizer from 'react-native-image-resizer';
import { ProgressBar, Title, Paragraph, Subheading } from 'react-native-paper';
import { TouchableHighlight, SafeAreaView } from 'react-native';
import { useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { Mixpanel } from '../../../config';
import { Toast } from '../../../components/rootToaster';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
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
  secure_url: string;
  formData: FormData | null;
  loading: boolean;
  imageData: CloudinaryUploadType;
};

export default function AvatarUploadScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [avatar, setAvatar] = useState<StateType>({
    uri: '',
    secure_url: '',
    formData: null,
    imageData: { uri: '', mime: '', filename: '', cropRect: null },
    loading: false
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
    }
  };

  const handleAvatar = async () => {
    try {
      let divider = 0;

      const { size, height, width, path } = (await ImagePicker.openPicker({
        cropping: false,
        mediaType: 'photo'
      })) as Image;

      if (size > 900000) divider = size / 900000;

      const { uri: resizedImage } = await ImageResizer.createResizedImage(
        path,
        width / divider,
        height / divider,
        'PNG',
        100,
        0,
        undefined
      );

      const { mime, data, filename, cropRect } = await ImagePicker.openCropper({
        path: resizedImage,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
        width: RFValue(200),
        height: RFValue(200),
        compressImageMaxWidth: RFValue(200),
        compressImageMaxHeight: RFValue(200),
        cropperStatusBarColor: colors.STATUS_BAR_COLOR,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: true
      });
      const uri = `data:${mime};base64,${data}`;
      const imageData = { mime, filename, cropRect, uri };
      setAvatar({ ...avatar, uri, imageData });
      ImagePicker.clean();
    } catch (error) {
      crashlytics.recordError(new Error(error));
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
