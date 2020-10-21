import styled from 'styled-components/native';
import { Surface } from 'react-native-paper';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const CountBadge = styled(Surface)`
  height: 30px;
  padding-left: 7px;
  padding-right: 7px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  border-radius: 4px;
  position: absolute;
  right: -10px;
  z-index: 99999;
`;
