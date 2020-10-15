import React, { useState } from 'react';
import { Title, Button, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Updates from 'expo-updates';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import GradientButton from '../../components/gradientButton';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { APP_VERSION } from '../../utils/device';

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

type CheckUpdateProps = { cancelUpdate: () => void };

export default function CheckAppUpdates(props: CheckUpdateProps) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(!loading);
    await Updates.fetchUpdateAsync();
    setLoading(!loading);
    await Updates.reloadAsync();
  };

  return (
    <Container
      blurType="light"
      blurAmount={5}
      reducedTransparencyFallbackColor="white"
    >
      <TouchableWithoutFeedback>
        <BlurContents>
          <BlurContentsContainer style={{ elevation: 6 }}>
            <ImageContainer>
              <Image
                source={require('../../../assets/images/update.png')}
                style={{
                  width: RFValue(80),
                  height: RFValue(80),
                  resizeMode: 'contain'
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
                {APP_VERSION}
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
                onPress={handleUpdate}
                loading={loading}
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
                onPress={() => props.cancelUpdate()}
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
      </TouchableWithoutFeedback>
    </Container>
  );
}
