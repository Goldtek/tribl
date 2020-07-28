import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const CardContainer = styled.View`
  flex-direction: row;
`;

export const TextContainer = styled.View`
  width: ${RFValue(200)}px;
`;
