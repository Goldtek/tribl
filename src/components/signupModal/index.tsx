import React, { useEffect, useRef } from 'react';
import { Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { RFValue } from 'react-native-responsive-fontsize';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../theme';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';

import { GradientContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closeSignupModal(): void;
}

function SignupModal(props: ModalProp) {
  const { isVisible, closeSignupModal } = props;
  const navigation = useNavigation();
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    isVisible ? openModal() : closeModal();
  }, [isVisible]);

  const handleNavigation = () => {
    navigation.navigate('SignupScreen');
    closeModal();
  };

  return (
    <Portal>
      <StatusBar translucent animated style="light" />

      <Modalize
        ref={modalizeRef}
        onClose={closeSignupModal}
        modalStyle={{
          height: DEVICE_FULL_HEIGHT / 2,
          justifyContent: 'center',
          marginTop: RFValue(600)
        }}
      >
        <GradientContainer
          colors={[colors.PRIMARY, colors.SECONDARY]}
          style={{
            height: DEVICE_FULL_HEIGHT
          }}
        >
          <Button
            mode="text"
            contentStyle={{
              backgroundColor: colors.WHITE,
              width: '100%',
              height: RFValue(45)
            }}
            labelStyle={{
              color: colors.PRIMARY,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE),
              textTransform: 'capitalize'
            }}
            onPress={handleNavigation}
          >
            {t('signup.getStartedScreen.signup')}
          </Button>
        </GradientContainer>
      </Modalize>
    </Portal>
  );
}

export default React.memo(SignupModal);
