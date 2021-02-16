import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
`;

export const CardContainer = styled.View`
  flex-direction: row;
  padding: 20px 10px;
`;

export const TextContainer = styled.View`
  flex: 1;
  padding: 0px 15px;
`;

export const TagContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin: ${RFValue(5)}px ${RFValue(25)}px ${RFValue(10)}px;
`;

export const Tags = styled.View`
  background-color: ${({ theme }) => theme.colors.GREY_LIGHT};
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.SECONDARY_TEXT};
  border-radius: 4px;
  padding: ${RFValue(10)}px;
`;

export const TagText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE)}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  margin-top: 10px;
  margin-right: 10px;
  padding: ${RFValue(5)}px;
  border-width: ${RFValue(1.2)}px;
  border-color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  text-transform: capitalize;
  border-radius: 4px;
`;

export const DescrptionCover = styled.View`
  height: ${RFValue(60)}px;
  border: 1px solid ${({ theme }) => theme.colors.INACTIVE};
  border-radius: 4px;
`;

export const AddTag = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE)}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  width: 50px;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: ${RFValue(6)}px;
  border-width: ${RFValue(1.2)}px;
  border-color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  text-transform: uppercase;
  border-radius: 4px;
  margin-top: ${RFValue(10)}px;
`;

export const TagButton = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
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

export const TagButtonCover = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
`;
