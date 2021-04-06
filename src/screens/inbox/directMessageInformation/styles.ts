import Constants from 'expo-constants';
import styled from 'styled-components/native';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const OptionWrapper = styled(TouchableRipple)`
  height: 60px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const LeftCover = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: ${RFValue(20)}px;
`;

export const RightCover = styled.View`
  flex-direction: row;
  align-items: center;
  padding-right: ${RFValue(20)}px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
