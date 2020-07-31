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

export const JoinContainer = styled.View`
  width: 60px;
  height: 40px;
  align-self: flex-start;
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  margin-left: auto;
  margin-right: ${RFValue(10)}px;
  margin-top: ${RFValue(20)}px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
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
