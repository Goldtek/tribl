import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const TribeCover = styled.View`
  width: ${RFValue(65)}px;
  height: ${RFValue(65)}px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border-radius: 4px;
  padding: 5px;
  border: 1.3px ${({ theme }) => theme.colors.PRIMARY} solid;
`;
