import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.SYSTEM_COLOR};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-bottom: 10px;
`;

export const Cover = styled.View``;
