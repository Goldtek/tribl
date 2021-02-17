import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  margin-left: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
  border-left-width: 5px;
  flex-direction: column;
  border-left-color: #e4e4e4;
`;

export const Text = styled.Text`
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  margin-top: 5px;
`;
