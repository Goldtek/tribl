import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding-top: 30px;
  /* flex-direction: row; */
  background-color: ${({ theme }) => theme.colors.GREY};
`;
