import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const ButtonCover = styled.View`
  flex: 1;
  justify-content: flex-end;
  padding-bottom: 10px;
  margin: 0 15px;
`;

export const AutoTagCover = styled.View`
  flex: 1;
  left: 0;
  position: relative;
  right: 0;
  top: 0;
  z-index: 1;
`;
