import styled from 'styled-components/native';
import { BlurView } from '@react-native-community/blur';
import { Surface } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';

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
  background-color: ${({ theme }) => theme.colors.GREY};
  border-radius: 4px;
  margin-top: ${RFPercentage(20)}px;
`;
