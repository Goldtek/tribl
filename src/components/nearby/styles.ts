import styled from 'styled-components/native';
import { Surface } from 'react-native-paper';

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const BlurContents = styled.View`
  flex: 1;
  align-items: center;
  padding: 30px 30px 0px 30px;
  border: transparent;
`;

export const BlurContentsContainer = styled(Surface)`
  height: 85%;
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
