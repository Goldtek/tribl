import React, { useState } from 'react';
import { Title, Button, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../theme';
import Input from '../input';
import GradientButton from '../gradientButton';
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { DEVICE_OS } from '../../utils/device';
import { JOIN_COMMUNITY } from '../../graphql/server/mutations';
import { crashlytics } from '../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  BlurContentsContainer,
  ButtonContainer,
  BlurContents
} from './styles';

// DEFINE SCREEN PROP TYPES
interface JoinCommunityProp {
  onPress(): void;
}

function JoinCommunity(props: JoinCommunityProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({ code: '', loading: false });

  const [joinCommunity] = useMutation(JOIN_COMMUNITY, {
    variables: { payload: { code: state.code } }
  });

  const handleRequest = () => {};

  const handleJoin = async () => {
    Keyboard.dismiss();
    setState({ ...state, loading: true });

    try {
      await joinCommunity();
      setState({ ...state, loading: false });
    } catch (error) {
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
      setState({ ...state, loading: false });
    }
  };

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
              <Paragraph
                style={{
                  color: colors.SECONDARY_TEXT,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  lineHeight: RFValue(20),
                  marginBottom: RFValue(20)
                }}
              >
                Black Lives Matter is a global organization of Black people in
                {'\n'}
                pursuit of social justice and racial {'\n'}equity
              </Paragraph>
              <Title
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE + 12),
                  lineHeight: RFValue(34),
                  marginBottom: RFValue(15),
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.joinModal.title`)}
              </Title>
              <Paragraph
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.MEDIUM_SIZE),
                  textTransform: 'uppercase',
                  lineHeight: RFValue(14)
                }}
              >
                {t(`community.joinModal.label`)}
              </Paragraph>
              <Input
                defaultValue={state.code}
                onChangeText={(code) => setState({ ...state, code })}
                returnKeyType="next"
                placeholder={t(`community.joinModal.placeholder`)}
                placeholderTextColor={colors.INACTIVE}
                textInputStyle={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: 'transparent'
                }}
              />

              <ButtonContainer>
                <Button
                  mode="outlined"
                  onPress={handleRequest}
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
                  {t(`community.joinModal.request`)}
                </Button>
                <GradientButton
                  onPress={handleJoin}
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
                  {t(`community.joinModal.join`)}
                </GradientButton>
              </ButtonContainer>
            </BlurContentsContainer>
          </BlurContents>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Container>
  );
}

export default React.memo(JoinCommunity);
