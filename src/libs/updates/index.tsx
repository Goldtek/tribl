import React, { useState } from 'react';
import { Title, Paragraph, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Updates from 'expo-updates';
import { Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import GradientButton from '../../components/gradientButton';
import { TouchableWithoutFeedback } from 'react-native';
import { APP_VERSION } from '../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  BlurContentsContainer,
  BlurContents,
  TextContainer,
  HeaderContainer,
  LeftContainer,
  RightContainer,
  Alert
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
            <HeaderContainer>
              <LeftContainer>
                <Alert>
                  <Text
                    style={{
                      color: colors.WHITE,
                      fontSize: RFValue(fonts.SMALL_SIZE),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      textTransform: 'capitalize',
                      textAlign: 'center'
                    }}
                  >
                    {t(`community.update.new`)}
                  </Text>
                </Alert>
                <Title
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    textTransform: 'capitalize',
                    lineHeight: RFValue(16)
                  }}
                >
                  {t(`community.update.version`)}
                </Title>
                <Text
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontSize: RFValue(fonts.MEDIUM_SIZE),
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    textTransform: 'capitalize',
                    lineHeight: RFValue(16)
                  }}
                >
                  Tribl {APP_VERSION} version upgrade
                </Text>
              </LeftContainer>
              <RightContainer>
                <Entypo
                  name="arrow-bold-up"
                  size={RFValue(30)}
                  color={colors.WHITE}
                />
              </RightContainer>
            </HeaderContainer>
            <TextContainer>
              <Paragraph
                style={{
                  color: colors.SECONDARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  textTransform: 'capitalize',
                  lineHeight: RFValue(18)
                }}
              >
                1. {t(`community.update.change1`)}
              </Paragraph>
              <Paragraph
                style={{
                  color: colors.SECONDARY_TEXT,
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  textTransform: 'capitalize',
                  lineHeight: RFValue(18)
                }}
              >
                2. {t(`community.update.change2`)}
              </Paragraph>
            </TextContainer>
            <GradientButton
              onPress={handleUpdate}
              loading={loading}
              labelStyle={{
                color: colors.WHITE,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
              contentStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%'
              }}
              gradientContainerstyle={{
                maxHeight: RFValue(40),
                marginHorizontal: RFValue(15),
                marginTop: 40,
                marginBottom: 30
              }}
            >
              {t(`community.update.yes`)}
            </GradientButton>
            {/* <Button
              mode="text"
              onPress={() => props.cancelUpdate()}
              labelStyle={{
                color: colors.PRIMARY,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE),
                textTransform: 'capitalize'
              }}
              contentStyle={{
                borderColor: colors.INACTIVE,
                borderRadius: 4,
                height: RFValue(40)
              }}
              style={{
                height: RFValue(40),
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: RFValue(10),
                marginHorizontal: RFValue(15)
              }}
            >
              {t(`community.update.no`)}
            </Button> */}
          </BlurContentsContainer>
        </BlurContents>
      </TouchableWithoutFeedback>
    </Container>
  );
}
