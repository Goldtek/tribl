import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../../../utils/device';
import RadioButton from './radioButton ';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  closePrivacyModal(): void;
}

function PrivacyModal(props: any) {
  const { isVisible, closePrivacyModal, parentCallback } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const modalizeRef = useRef<Modalize>(null);

  const openModal = () => modalizeRef.current?.open();

  const closeModal = () => modalizeRef.current?.close();

  useEffect(() => {
    if (isVisible) {
      openModal();
    } else {
      closeModal();
    }
  }, [isVisible]);

  const Data = [
    {
      key: 'everybody',
      text: 'everybody'
    },
    {
      key: 'my connections',
      text: 'my connections'
    },
    {
      key: 'nobody',
      text: 'nobody'
    }
  ];

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        onClose={closePrivacyModal}
        modalStyle={{ paddingTop: RFValue(30) }}
        modalHeight={DEVICE_FULL_HEIGHT / 3}
      >
        <StatusBar translucent animated style="light" />
        <Container
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent'
          }}
        >
          <RadioButton Data={Data} parentCallBack={parentCallback} />
        </Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(PrivacyModal);
