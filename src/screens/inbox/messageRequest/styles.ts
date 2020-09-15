import styled from 'styled-components/native';

export const Cover = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  padding-top: 10px;
`;

export const TextContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.INPUT};
  align-items: center;
  text-align: center;
  padding: 30px 15px 30px 15px;
`;
