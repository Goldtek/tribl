import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { Surface } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

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
  padding: 30px 30px 0px 30px;
  border: transparent;
`;

export const BlurContentsContainer = styled(Surface)`
  height: 76%;
  background-color: ${({ theme }) => theme.colors.GREY};
  padding: 20px 10px;
  border-radius: 4px;
`;

export const ButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

export const ImageContainer = styled.View`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  background-color: ${({ theme }) => theme.colors.INPUT};
  justify-content: center;
  align-items: center;
  align-self: center;
  border-radius: ${RFValue(60)}px;
`;

export const TextContainer = styled.View`
  padding: 0 ${RFValue(20)}px;
`;
