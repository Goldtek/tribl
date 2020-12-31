import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { DEVICE_OS } from '../../../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, BlurContentsContainer, BlurContents } from './styles';
import FastImage from 'react-native-fast-image';

// DEFINE SCREEN PROP TYPES
interface ViewPassortAvatarProp {
  onPress(): void;
  avatar: string | undefined;
}

function ViewPasssportAvatar(props: ViewPassortAvatarProp) {
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
              <FastImage
                resizeMode={FastImage.resizeMode.stretch}
                source={{
                  uri: props.avatar,
                  priority: FastImage.priority.high
                }}
                style={{
                  width: RFValue(300),
                  height: RFValue(220),
                  borderRadius: 4
                }}
              />
            </BlurContentsContainer>
          </BlurContents>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Container>
  );
}

export default React.memo(ViewPasssportAvatar);
