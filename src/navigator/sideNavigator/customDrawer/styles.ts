import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.WHITE};
`;

export const ProfileContainer = styled.View`
  align-items: center;
  margin-top: ${RFValue(20)}px;
  margin-bottom: ${RFValue(30)}px;
`;

export const MenuContainer = styled.View`
  flex: 1;
  margin: 0px 10px;
  align-items: center;
`;

export const DrawerFooter = styled.View`
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

export const ConnectionBadgeWrapper = styled.View`
  width: 14px;
  height: 14px;
  border-radius: ${14 / 2}px;
  background-color: ${({ theme }) => theme.colors.RED};
  position: absolute;
  left: 22px;
  top: 20px;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.WHITE};
`;
