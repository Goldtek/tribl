import styled from 'styled-components/native';
import { Surface } from 'react-native-paper';

export const Container = styled.View`
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
  height: 100%;
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

export const ButtonWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;
