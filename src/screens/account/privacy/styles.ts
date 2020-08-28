import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding-bottom: ${RFValue(15)}px;
  margin-top: ${RFValue(10)}px;
`;

export const ToggleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${RFValue(50)}px;
  padding: 0 ${RFValue(25)}px;
`;

export const ToggleCover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PrivacyOption = styled.View`
  padding: 0 20px;
`;
