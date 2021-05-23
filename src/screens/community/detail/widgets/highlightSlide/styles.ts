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

export const Overlay = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-vertical: ${RFValue(10)}px;
`;

export const DonateButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 1px solid #718CFB;
  border-radius: 5px;
  margin: 3px 20px;
`;



export const RightCover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

