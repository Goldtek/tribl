import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { StyleSheet } from 'react-native';

export const QRCodeContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

export const QRCodeHolder = styled.View`
  width: ${RFValue(190)}px;
  height: ${RFValue(180)}px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.ACTION};
  border-radius: 4px;
`;

export const QRCodeHolderEdge = styled.View`
  width: ${RFValue(25)}px;
  height: ${RFValue(25)}px;
  border-color: ${({ theme }) => theme.colors.PRIMARY};
  border-left-width: ${RFValue(4)}px;
  border-top-width: ${RFValue(4)}px;
  position: absolute;
`;

export const styles = StyleSheet.create({
  bottomRight: {
    transform: [{ rotate: '180deg' }],
    right: RFValue(30),
    bottom: RFValue(25)
  },
  bottomLeft: {
    transform: [{ rotateX: '180deg' }],
    bottom: RFValue(25),
    left: RFValue(30)
  },
  topLeft: { left: RFValue(30), top: RFValue(25) },
  topRight: {
    transform: [{ rotateY: '180deg' }],
    top: RFValue(25),
    right: RFValue(30)
  }
});
