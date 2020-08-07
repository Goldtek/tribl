import React, { useState } from 'react';
import ImageResizer from 'react-native-image-resizer';
import { ProgressBar, Title, Paragraph, Subheading } from 'react-native-paper';
import { TouchableHighlight, SafeAreaView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Toast } from '../../../components/rootToaster';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../components/gradientButton';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import { ADD_USER_DETAILS } from '../../../graphql/cache/mutations';
import { useMutation } from '@apollo/react-hooks';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, GradientContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function AvatarUploadScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [avatar, setAvatar] = useState('');

  const [addUserImage] = useMutation(ADD_USER_DETAILS, {
    variables: { details: { avatar } }
  });

  const handleInputError = () => {
    Toast.show(t(`signup.avatarUploadScreen.inputError`));
  };

  const handleSubmit = () => {
    if (!avatar) return handleInputError();

    navigation.navigate('IdentifyUserScreen');
    addUserImage();
  };

  const handleAvatar = async () => {
    try {
      let divider = 1;

      const { size, height, width, path } = (await ImagePicker.openPicker({
        cropping: false,
        mediaType: 'photo'
      })) as Image;

      if (size > 300000) divider = size / 300000;

      const { uri: resizedImage } = await ImageResizer.createResizedImage(
        path,
        width / divider,
        height / divider,
        'JPEG',
        100,
        0,
        undefined
      );

      const { mime, data } = await ImagePicker.openCropper({
        path: resizedImage,
        width: RFValue(90),
        height: RFValue(90),
        includeBase64: true
      });

      setAvatar(`data:${mime};base64,${data}`);
      ImagePicker.clean();
    } catch (error) {
      console.error(error);
    }
  };

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
                {avatar ? (
                  <FastImage
                    source={{
                      uri: avatar,
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
              {t(
                `signup.avatarUploadScreen.${
                  avatar ? 'photoAdded' : 'addAvatar'
                }`
              )}
            </Subheading>
          </Container>

          <Container style={{ width: '100%' }}>
            <GradientButton onPress={handleSubmit}>
              {t(`signup.avatarUploadScreen.submit`)}
            </GradientButton>
          </Container>
        </Container>
      </Container>
    </SafeAreaView>
  );
}
