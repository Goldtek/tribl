import styled from 'styled-components/native';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';

export const Container = styled.View<{ bottomInset: number; topInset: number }>`
  height: ${({ bottomInset, topInset }) =>
    `${DEVICE_FULL_HEIGHT - bottomInset - topInset}px`};
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;
