import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.SYSTEM_COLOR};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-bottom: 10px;
`;

export const ChatContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;
