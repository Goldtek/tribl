import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(15)}px 0;
`;

export const TitleCover = styled.View`
  flex-direction: row;
  margin-top: ${RFValue(15)}px;
`;
