import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const ButtonWrapper = styled.View`
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.TRANSPARENT};
  bottom: 10px;
  left: 0;
  right: 0;
`;
