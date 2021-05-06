import styled from 'styled-components/native';
import ShadowView from 'react-native-simple-shadow-view';
import { RFValue } from 'react-native-responsive-fontsize';
import { DEVICE_FULL_WIDTH } from '../../utils/device';
import hexToRGB from '../../utils/hexToRGB';

export const TextContainer = styled.View`
  align-items: center;
`;

export const AvatarContainer = styled.View`
  position: relative;
`;

export const OnlineNotifier = styled.View`
  width: ${RFValue(17)}px;
  height: ${RFValue(17)}px;
  border-radius: ${RFValue(17)}px;
  background-color: ${({ theme }) => theme.colors.ONLINE};
  position: absolute;
  border: 3px ${({ theme }) => theme.colors.WHITE} solid;
  right: 0px;
`;

export const Container = styled(ShadowView)`
  margin-right: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
  shadow-opacity: 0.2;
  align-items: center;
  shadow-radius: 10px;
  shadow-offset: 5px 5px;
  padding: 20px 0px;
  height: ${RFValue(180)}px;
  justify-content: space-between;
  width: ${RFValue(DEVICE_FULL_WIDTH / 3)}px;
  background-color: ${({ theme }) => theme.colors.WHITE};
  shadow-color: ${({ theme }) => hexToRGB(theme.colors.BLACK, 0.3)};
`;
