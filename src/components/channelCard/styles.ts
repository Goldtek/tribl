import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../utils/hexToRGB';

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: ${RFValue(2)}px;
  left: ${RFValue(5)}px;
`;

export const LeftCover = styled.View`
  background-color: ${({ theme }) => hexToRGB(theme.colors.WHITE, 0.3)};
  padding: ${RFValue(1)}px ${RFValue(3)}px;
  border-radius: ${RFValue(4)}px;
`;

export const RightCover = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.OFFWHITE};
  left: ${RFValue(21)}px;
  padding: ${RFValue(3)}px;
  border-radius: ${RFValue(4)}px;
`;
