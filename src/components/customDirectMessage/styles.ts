import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: column;
  padding: 3px;
`;

export const Edited = styled.Text`
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE}px;
  margin-top: 3px;
`;
