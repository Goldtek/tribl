import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
`;

export const LeftCover = styled.View`
  position: relative;
  top: ${RFValue(5)}px;
  margin-right: ${RFValue(15)}px;
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
