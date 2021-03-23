import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ContactContainer = styled.View`
  padding: 20px;
`;

export const IdentityContainer = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const Identities = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const IdentityText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE)}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  margin-top: 10px;
  margin-right: 10px;
  padding: ${RFValue(10)}px;
  border-width: ${RFValue(1.2)}px;
  border-color: ${({ theme }) => theme.colors.INACTIVE};
  text-transform: uppercase;
  border-radius: 4px;
`;

export const InterestContainer = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const LocationContainer = styled.View``;

export const Location = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

export const CitizenshipContainer = styled.View`
  margin: 20px 0px;
`;

export const Header = styled.View`
  flex-direction: row;
  margin-bottom: ${RFValue(10)}px;
`;

export const ConnectionCover = styled.View`
  flex: 1;
  padding-left: ${RFValue(10)}px;
`;

export const Connection = styled.View`
  align-items: center;
`;

export const ButtonCover = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Cover = styled.View``;

export const HeaderCover = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const HeaderBottomWrapper = styled.View`
  flex-direction: row;
`;
