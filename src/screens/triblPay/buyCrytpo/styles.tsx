import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  padding: ${RFValue(50)}px ${RFValue(15)}px 0 ${RFValue(15)}px;
`;

export const textCover = styled.View`
  margin-top:30px;
  line-height: 1.8;
`;

export const ButtonCover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${RFValue(10)}px;
`;

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;

export const LeftCover = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const RightCover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

export const GradientContainer = styled(LinearGradient)`
  flex: 1;
  padding: ${RFValue(30)}px ${RFValue(15)}px;
  border-radius: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const BorderLine = styled.View`
  border-bottom-color: #718CFB;
  border-bottom-width: ${RFValue(3)};
  margin-top:${RFValue(70)}px;
  width: ${width};
  margin-left: ${RFValue(-15)}
`;

export const Icon = styled.Image`
    width: 35px;
    height: 35px;
    margin: 15px;
`;


export const ActionSheetButtonContainer = styled.View`
  align-items: center;
  height: 50px;
  width: 100%;
  flex-direction: row;
  padding-left: 20px;
  padding-right: 20px;
  background-color: ${({ theme }) => theme.colors.WHITE};
  ${({ theme }) => theme.message.actionSheet.buttonContainer.css};
`;

export const ActionSheetButtonText = styled.Text`
  margin-left: 10px;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE}px;
  color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.PRIMARY};
  ${({ theme }) => theme.message.actionSheet.buttonText.css};
`;




