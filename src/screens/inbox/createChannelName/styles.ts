import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const HeaderContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fonts.MEDIUM_SIZE * 1.6}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  text-transform: capitalize;
  margin-left: 15px;
  margin-right: 15px;
`;

export const TribeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 15px 0 10px;
`;

export const Cover = styled.View`
  flex: 1;
  justify-content: space-between;
  padding: 0 15px;
`;

export const TopCover = styled.View`
  margin-top: 15px;
`;

export const PrivateCover = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
