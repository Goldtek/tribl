import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const CardContainer = styled.View`
  position: relative;
  flex-direction: row;
  padding: 20px 10px;
`;

export const TextContainer = styled.View`
  flex: 1;
  padding: 0px 10px;
`;

export const TagContainer = styled.View`
  margin: ${RFValue(10)}px 0px;
  width: 100%;
  padding: 0 20px;
`;

export const Tags = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const TagText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE)}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  margin-top: 10px;
  margin-right: 10px;
  padding: ${RFValue(10)}px;
  border-width: ${RFValue(1.2)}px;
  border-color: ${({ theme }) => theme.colors.INACTIVE};
  text-transform: uppercase;
  border-radius: 4px;
`;
