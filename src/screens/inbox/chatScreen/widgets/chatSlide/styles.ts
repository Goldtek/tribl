import styled from 'styled-components/native';
import hexToRGB from '../../../../../utils/hexToRGB';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const GroupWrapper = styled.View`
  background-color: ${({ theme }) => theme.colors.GREY};
  width: 70px;
  height: 50px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 4px 4px ${({ theme }) => theme.colors.INACTIVE};
`;
