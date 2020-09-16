import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  height: ${RFValue(70)}px;
  width: ${RFValue(70)}px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-width: ${RFValue(1.2)}px;
  border-radius: ${RFValue(4)}px;
  margin-right: 10px;
  border-color: ${({ theme }) => theme.colors.PRIMARY};
`;
