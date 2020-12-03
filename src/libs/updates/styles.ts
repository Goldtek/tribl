import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { Surface } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../utils/hexToRGB';

export const Container = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

export const BlurContents = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0px 30px 0px 30px;
  border: transparent;
`;

export const BlurContentsContainer = styled(Surface)`
  background-color: ${({ theme }) => theme.colors.GREY};
  border-radius: 10px;
`;

export const TextContainer = styled.View`
  padding: ${RFValue(20)}px ${RFValue(15)}px ${RFValue(10)}px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${RFValue(20)}px ${RFValue(15)}px ${RFValue(30)}px;
  background-color: ${({ theme }) => hexToRGB(theme.colors.PRIMARY_LIGHT, 0.3)};
`;

export const LeftContainer = styled.View`
  margin-right: ${RFValue(30)}px;
`;

export const RightContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  width: ${RFValue(45)}px;
  height: ${RFValue(45)}px;
  border-radius: ${RFValue(45 / 2)}px;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
`;

export const Alert = styled.View`
  background-color: ${({ theme }) => theme.colors.RED};
  width: ${RFValue(30)}px;
  padding: ${RFValue(2)}px 0;
  border-radius: ${RFValue(20)}px;
  margin-bottom: ${RFValue(5)}px;
`;
