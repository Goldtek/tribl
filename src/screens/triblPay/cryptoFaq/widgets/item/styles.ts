import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  
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

export const IconCover = styled(LinearGradient)`
  height: ${RFValue(30)}px;
  width: ${RFValue(30)}px;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  position: relative;
  bottom: ${RFValue(20)}px;
  left: ${RFValue(5)}px;
  border: 2px solid ${({ theme }) => theme.colors.WHITE};
  border-radius: ${RFValue(15)}px;
`;

export const Row = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;

export const Icon = styled.Image`
    width: 30px;
    height: 30px;
    margin: 10px;
`;


export const ButtonContainer = styled.TouchableOpacity`
  flex: 1;
`;
