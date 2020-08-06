import React, { useEffect, useRef } from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import EllipseIcon from '../../../assets/icons/ellipseIcon';
import { useThemeContext } from '../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  title: string;
  isVisible: boolean;
}

export default function LoadingModal(props: ModalProp) {
  const { title, isVisible } = props;
  const { colors, fonts } = useThemeContext();

  const modalRef = useRef<Modalize>(null);

  const openModal = () => modalRef.current?.open();

  useEffect(() => {
    if (isVisible) openModal();
  }, [isVisible]);

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        modalHeight={DEVICE_FULL_HEIGHT}
        overlayStyle={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.PRIMARY }
        ]}
        handleStyle={{ display: 'none' }}
        modalStyle={{
          paddingTop: RFValue(60 * 2),
          backgroundColor: colors.PRIMARY,
          elevation: 0
        }}
      >
        <StatusBar translucent animated style="light" />
        <Container
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.7)),
              color: colors.WHITE,
              lineHeight: RFValue(35),
              textAlign: 'center',
              marginTop: 20
            }}
          >
            {title}
          </Title>

          <LottieView
            source={require('../../../assets/animations/ellipse.json')}
            autoPlay
            loop
            style={{ width: RFValue(300), height: RFValue(300) }}
          />
          <EllipseIcon />
        </Container>
      </Modalize>
    </Portal>
  );
}
