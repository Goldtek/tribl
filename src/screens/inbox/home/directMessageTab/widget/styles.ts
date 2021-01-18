import styled from 'styled-components/native';

export const NameContainer = styled.View`
  margin-left: 10px;
`;

export const TimeStamp = styled.View`
  margin-left: auto;
`;

export const BadgeWrapper = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.RED};
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;
