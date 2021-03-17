import styled from 'styled-components/native';

export const MoreEmoji = styled.Text`
  position: absolute;
  top: 0;
  right: 0;
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE * 1.25}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_MEDIUM};
  z-index: 1;
`