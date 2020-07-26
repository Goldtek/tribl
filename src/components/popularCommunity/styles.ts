import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const CommunityContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

export const TextConatiner = styled.View`
  padding-left: ${RFValue(10)}px;
  align-self: center;
`;

export const CardContainer = styled.View`
  height: ${RFValue(100)}px;
  background-color: ${({ theme }) => theme.colors.OFFWHITE};
`;

export const CardContent = styled.View``;
