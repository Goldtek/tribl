import * as React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import QRCode from 'react-native-qrcode-svg';
import { useThemeContext } from '../../../../../theme';

import {
  QRCodeContainer,
  QRCodeHolder,
  QRCodeHolderEdge,
  styles
} from './styles';

export default function QRcodeSlide() {
  const { colors } = useThemeContext();

  return (
    <QRCodeContainer>
      <QRCodeHolder>
        <QRCodeHolderEdge style={styles.topLeft} />
        <QRCodeHolderEdge style={styles.topRight} />
        <QRCode
          value="Just some string value"
          size={RFValue(100)}
          color={colors.PRIMARY}
          backgroundColor="transparent"
        />
        <QRCodeHolderEdge style={styles.bottomRight} />
        <QRCodeHolderEdge style={styles.bottomLeft} />
      </QRCodeHolder>
    </QRCodeContainer>
  );
}
