import React, { useState } from 'react';
import { Title, Button, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation } from '@apollo/react-hooks';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import Input from '../../../components/input';
import GradientButton from '../../../components/gradientButton';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { DEVICE_OS } from '../../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  BlurContentsContainer,
  ButtonContainer,
  BlurContents,
  ImageContainer,
  TextContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface UpdateProp {
  onPress(): void;
}

function UpdateModal(props: UpdateProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({
    loading: false
  });

  return (
    <Container
      blurType="light"
      blurAmount={5}
      reducedTransparencyFallbackColor="white"
    >
      <TouchableWithoutFeedback onPress={props.onPress}>
        <KeyboardAvoidingView
          behavior={DEVICE_OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <BlurContents>
            <BlurContentsContainer style={{ elevation: 6 }}>
              <ImageContainer>
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri:
                      'https://www.linkpicture.com/q/mPngtreemflying-rocket_3718748.png',
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: RFValue(50),
                    height: RFValue(70),
                    borderRadius: RFValue(70)
                  }}
                />
              </ImageContainer>

              <Title
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE + 4),
                  lineHeight: RFValue(34),
                  marginBottom: RFValue(10),
                  marginTop: RFValue(20),
                  paddingHorizontal: RFValue(10),
                  textTransform: 'capitalize',
                  textAlign: 'center'
                }}
              >
                {t(`community.update.title`)}
              </Title>
              <TextContainer>
                <Paragraph
                  style={{
                    color: colors.SECONDARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    textTransform: 'uppercase',
                    lineHeight: RFValue(14)
                  }}
                >
                  {t(`community.update.version`)}
                </Paragraph>
                <Paragraph
                  style={{
                    color: colors.SECONDARY_TEXT,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    marginVertical: RFValue(10),
                    textTransform: 'capitalize',
                    lineHeight: RFValue(14)
                  }}
                >
                  {t(`community.update.update`)}:
                </Paragraph>
                <Paragraph
                  style={{
                    color: colors.SECONDARY_TEXT,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    textTransform: 'capitalize',
                    lineHeight: RFValue(18)
                  }}
                >
                  - {t(`community.update.change1`)}
                </Paragraph>
                <Paragraph
                  style={{
                    color: colors.SECONDARY_TEXT,
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    textTransform: 'capitalize',
                    lineHeight: RFValue(18)
                  }}
                >
                  - {t(`community.update.change2`)}
                </Paragraph>
              </TextContainer>

              <ButtonContainer>
                <GradientButton
                  onPress={() => {}}
                  loading={state.loading}
                  labelStyle={{
                    color: colors.WHITE,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    textTransform: 'capitalize'
                  }}
                  contentStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                  }}
                  gradientContainerstyle={{
                    maxHeight: RFValue(45),
                    width: '45%'
                  }}
                >
                  {t(`community.update.yes`)}
                </GradientButton>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  labelStyle={{
                    color: colors.SECONDARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE),
                    width: '80%',
                    textTransform: 'capitalize'
                  }}
                  contentStyle={{
                    borderColor: colors.INACTIVE,
                    borderRadius: 4,
                    height: RFValue(45)
                  }}
                  style={{
                    width: '45%',
                    height: RFValue(45),
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {t(`community.update.no`)}
                </Button>
              </ButtonContainer>
            </BlurContentsContainer>
          </BlurContents>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Container>
  );
}

export default React.memo(UpdateModal);
