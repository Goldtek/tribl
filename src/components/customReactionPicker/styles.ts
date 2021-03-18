import styled from 'styled-components/native';

export const Overlay = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const PickerContainer = styled.View`
  width: 100%;
  height: 250px;
  align-items: center;
  border-radius: 5px;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;
