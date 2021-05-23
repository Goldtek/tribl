import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding-top: ${RFValue(50)}px;
`;

export const Overlay = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const LeftCover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const BalanceCover = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: ${RFValue(10)}px;
`;

export const RightCover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;
