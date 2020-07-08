import React from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { TFunction } from 'i18next';
import EllipseIcon from '../../../../../assets/icons/ellipseIcon';
import { useThemeContext } from '../../../../theme';
import { NavigationInterface } from '../../../types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from '../styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp extends NavigationInterface {
  isVisible: boolean;
  t: TFunction;
}

export default function CreateAccountModal(props: ModalProp) {
  const { t, isVisible } = props;
  const { colors, fonts } = useThemeContext();

  return (
    <Modal
      isVisible={isVisible}
      hasBackdrop={false}
      //@ts-ignore
      statusBarTranslucent={true}
      style={{
        flex: 1,
        margin: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: RFValue(60 * 2),
        backgroundColor: colors.PRIMARY
      }}
    >
      <StatusBar translucent animated style="light" />

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
        {`Tiffany, ${t('signup.preparePassport')}`}
      </Title>

      <Container
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <LottieView
          source={require('../../../../../assets/animations/ellipse.json')}
          autoPlay
          loop
          style={{ width: RFValue(300), height: RFValue(300) }}
        />

        <EllipseIcon />
      </Container>
    </Modal>
  );
}
