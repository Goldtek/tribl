import React from 'react';
import { Title, Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../../../theme';
import LottieView from 'lottie-react-native';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  BlurContentsContainer,
  InstructionButton,
  Identity,
  GradientContainer,
  BlurContents,
  CloseButtonContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface scrollInstructionProp {
  onPress(): void;
}

export default function ScrollInstruction(props: scrollInstructionProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  return (
    <Container
      blurType="light"
      blurAmount={5}
      reducedTransparencyFallbackColor="white"
    >
      <BlurContents
        style={{
          paddingBottom: RFValue(safeAreaBottom ? safeAreaBottom + 30 : 60)
        }}
      >
        <BlurContentsContainer>
          <InstructionButton>
            <GradientContainer
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={[colors.PRIMARY, colors.SECONDARY]}
              style={{ borderRadius: 4 }}
            >
              <Identity style={{ color: colors.WHITE }}>black</Identity>
            </GradientContainer>
          </InstructionButton>
          <InstructionButton>
            <Identity>afro-latin</Identity>
          </InstructionButton>
        </BlurContentsContainer>

        <LottieView
          source={require('../../../../../../assets/animations/scrollup.json')}
          autoPlay
          loop
          style={{
            width: RFValue(100),
            height: RFValue(100),
            transform: [{ rotate: '90deg' }]
          }}
        />

        <Title
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE + 5)),
            color: colors.PRIMARY_TEXT,
            textAlign: 'center',
            marginTop: RFValue(50),
            lineHeight: RFValue(30)
          }}
        >
          {t(`signup.identifyUserScreen.scrollUp`)}
        </Title>

        <CloseButtonContainer>
          <Button
            mode="text"
            color={colors.PRIMARY}
            labelStyle={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
            contentStyle={{
              height: RFValue(55),
              borderColor: colors.PRIMARY,
              borderWidth: 1,
              borderRadius: 4
            }}
            style={{ width: '100%', height: RFValue(55) }}
            onPress={props.onPress}
          >
            {t(`signup.identifyUserScreen.closeScrollUp`)}
          </Button>
        </CloseButtonContainer>
      </BlurContents>
    </Container>
  );
}
