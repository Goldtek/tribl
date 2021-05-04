import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 15px 0;
`;

export const FilterContainer = styled.View`
  margin: 25px 0px 10px 0px;
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
