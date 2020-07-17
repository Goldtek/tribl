import React, { useState } from 'react';
import {
  ProgressBar,
  Title,
  Paragraph,
  Subheading,
  Avatar
} from 'react-native-paper';
import { TouchableHighlight } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../components/gradientButton';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, GradientContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function AvatarUploadScreen(props: ScreenProp) {
  const { navigation } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  const [state, setState] = useState({ avatarSource: '', loading: false });

  const handleSubmit = () => {
    setState({ ...state, loading: true });

    setTimeout(() => {
      navigation.navigate('IdentifyUserScreen');
      setState({ ...state, loading: false });
    }, 1000);
  };

  const handleAvatar = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: { skipBackup: true, path: 'images' }
    };

    ImagePicker.showImagePicker(options, (response) => {
      const { didCancel, error, uri } = response;
      if (didCancel || error) return;
      setState({ ...state, avatarSource: uri });
    });
  };

  return (
    <Container
      style={{
        height: '100%',
        paddingLeft: RFValue(20),
        paddingRight: RFValue(20)
      }}
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
        {t(`signup.screenFive.subTitle`)}
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
        {t(`signup.screenFive.title`)}
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
        {t(`signup.screenFive.paragraph`)}
      </Paragraph>

      <Container
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: RFValue(safeAreaBottom + 20),
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
              {state.avatarSource ? (
                <Avatar.Image
                  size={RFValue(96)}
                  source={{ uri: state.avatarSource }}
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
              `signup.screenFive.${
                state.avatarSource ? 'photoAdded' : 'addAvatar'
              }`
            )}
          </Subheading>
        </Container>

        <Container style={{ width: '100%' }}>
          <GradientButton loading={state.loading} onPress={handleSubmit}>
            {t(`signup.screenFive.${state.loading ? 'uploading' : 'submit'}`)}
          </GradientButton>
        </Container>
      </Container>
    </Container>
  );
}
