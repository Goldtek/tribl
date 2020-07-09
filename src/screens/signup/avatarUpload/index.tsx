import React, { useState } from 'react';
import { ProgressBar, Title, Paragraph } from 'react-native-paper';
import { TouchableHighlight, Image } from 'react-native';
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

  const [state, setState] = useState({
    avatarSource: 'try',
    loading: false
  });

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
          fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.8)),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          textTransform: 'capitalize',
          marginTop: 20
        }}
      >
        {t(`signup.screenFive.title`)}
      </Title>

      <Container
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: RFValue(20)
        }}
      >
        <TouchableHighlight
          onPress={handleAvatar}
          underlayColor={colors.PRIMARY}
          style={{
            width: RFValue(120),
            height: RFValue(120),
            borderRadius: RFValue(60),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15
          }}
        >
          <GradientContainer
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={[colors.PRIMARY, colors.SECONDARY]}
            style={{
              width: RFValue(120),
              height: RFValue(120),
              borderRadius: RFValue(60)
            }}
          >
            <Container
              style={{
                width: RFValue(115),
                height: RFValue(115),
                borderRadius: RFValue(60),
                backgroundColor: colors.DISABLED,
                borderWidth: RFValue(20),
                borderColor: colors.WHITE,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Feather
                name="camera"
                size={RFValue(30)}
                color={colors.PRIMARY}
              />
            </Container>
          </GradientContainer>
        </TouchableHighlight>

        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            lineHeight: RFValue(22)
          }}
        >
          {t(`signup.screenFive.paragraph`)}
        </Paragraph>
      </Container>

      <Container
        style={{
          width: '100%',
          height: RFValue(200),
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: RFValue(5),
          backgroundColor: colors.INACTIVE,
          marginTop: RFValue(30)
        }}
      >
        <Image
          source={{ uri: state.avatarSource }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain'
          }}
        />
      </Container>

      <Container
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: RFValue(safeAreaBottom + 20)
        }}
      >
        <GradientButton loading={state.loading} onPress={handleSubmit}>
          {t(`signup.screenFive.${state.loading ? 'uploading' : 'submit'}`)}
        </GradientButton>
      </Container>
    </Container>
  );
}
