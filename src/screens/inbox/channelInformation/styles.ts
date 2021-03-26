import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding-bottom: 15px;
`;

export const LeftCover = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: ${RFValue(20)}px;
`;

export const RightCover = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: ${RFValue(20)}px;
`;
