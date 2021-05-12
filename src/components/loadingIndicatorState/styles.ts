import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Text = styled.Text`
  text-align: center;
  margin-vertical: 10px;
  line-height: ${RFValue(23)}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE)}px;
`;
