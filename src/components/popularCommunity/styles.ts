import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const TextContainer = styled.View`
  flex: 1;
  height: 100%;
  margin-left: ${RFValue(10)}px;
  justify-content: flex-end;
  padding-bottom: ${RFValue(5)}px;
`;
