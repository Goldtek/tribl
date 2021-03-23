import styled from 'styled-components/native';
import { Surface } from 'react-native-paper';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const CountBadge = styled(Surface)`
  max-height: 30px;
  padding-horizontal: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.PRIMARY};
  border-radius: 4px;
  position: absolute;
  right: -10px;
  z-index: 99999;
  overflow: hidden;
`;
