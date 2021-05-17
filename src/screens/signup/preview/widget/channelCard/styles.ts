import styled from 'styled-components/native';
import hexToRGB from '../../../../../utils/hexToRGB';

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
`;

export const LeftCover = styled.View`
  padding: 3px;
  border-radius: 4px;
  background-color: ${({ theme }) => hexToRGB(theme.colors.BLACK, 0.2)};
`;

export const Text = styled.Text`
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  font-size: ${({ theme }) => theme.fonts.LARGE_SIZE}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_MEDIUM};
  margin-horizontal: 5px;
`;
