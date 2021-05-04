import { EdgeInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import ShadowView from 'react-native-simple-shadow-view';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(ShadowView)`
  shadow-opacity: 0.2;
  shadow-radius: 18px;
  shadow-offset: 0px 2px;
  shadow-color: ${({ theme }) => theme.colors.BLACK};
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const SafeArea = styled.View<{ insets: EdgeInsets }>`
  flex-direction: row;
  margin-bottom: ${(p) => (p.insets.bottom > 0 ? p.insets.bottom : 0)}px;
`;

export const TabBarButton = styled.TouchableOpacity`
  flex: 1;
`;

export const IconContainer = styled.View`
  padding: 7px;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE - 2)}px;
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_SEMI_BOLD};
  padding-top: 3px;
  text-align: center;
  text-transform: capitalize;
`;

export const BadgeWrapper = styled.View`
  position: absolute;
  top: ${RFValue(15)}px;
  width: ${RFValue(5)}px;
  right: ${RFValue(45)}px;
  height: ${RFValue(5)}px;
  border-radius: ${RFValue(7)}px;
  background-color: ${({ theme }) => theme.colors.RED};
`;

export const MenuBadgeWrapper = styled.View`
  width: ${RFValue(13)}px;
  height: ${RFValue(13)}px;
  border-radius: ${RFValue(13)}px;
  background-color: ${({ theme }) => theme.colors.RED};
  position: absolute;
  top: ${RFValue(10)}px;
  right: ${RFValue(5)}px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.WHITE};
`;
