import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import hexToRGB from '../../utils/hexToRGB';
import { DEVICE_OS } from '../../utils/device';

export const HeaderContainer = styled.View`
  width: 100%;
  padding: 0px 20px 20px 20px;
  background-color: ${({ theme }) => theme.colors.PRIMARY};
`;

export const ImageContainer = styled.View`
  flex-direction: row;
  margin-top: ${RFValue(20)}px;
`;

export const ImageTextContainer = styled.View`
  flex: 1;
  margin-left: 20px;
  padding-bottom: 10px;
`;

export const ImageIconContainer = styled.View`
  flex-direction: row;
  margin-top: ${RFValue(15)}px;
`;

export const SocialMediaButton = styled.TouchableHighlight`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.PRIMARY_LIGHT};
  margin-right: 15px;
`;

export const ConnectionCover = styled.View`
  flex: 1;
  flex-direction: row;
  margin-top: ${RFValue(2)}px;
  margin-right: ${RFValue(15)}px;
`;

export const Cover = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const TribeCover = styled.View`
  position: relative;
  width: ${RFValue(65)}px;
  height: ${RFValue(65)}px;
`;

export const TabCover = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.WHITE};
  position: relative;
  top: ${RFValue(-20)}px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

export const ScreenCover = styled.View`
  background-color: ${({ theme }) => theme.colors.WHITE};
  flex: 1;
`;

export const ButtonHeaderCover = styled.View`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${RFValue(10)}px;
  margin-bottom: ${RFValue(20)}px;
`;

export const ContactContainer = styled.View`
  /* flex: 1; */
  padding: 20px 10px;
`;

export const Container = styled.View`
  margin: 10px 0px;
`;

export const TextInput = styled.TextInput`
  padding: 0px 0px ${DEVICE_OS === 'ios' ? 6 : 0}px 0px;
  margin: 0px;
`;

export const EditTextInput = styled.TouchableHighlight`
  height: ${RFValue(30)}px;
  width: ${RFValue(30)}px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
`;

export const FirstNameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const LastNameContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BioContainer = styled.View`
  /* flex-direction: row; */
  /* justify-content: space-between; */
`;

export const DOBContainer = styled.View``;

export const IdentityContainer = styled.View`
  margin-top: ${RFValue(20)}px;
`;

export const Identities = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
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

export const AddIdentity = styled.Text`
  font-family: ${({ theme }) => theme.fonts.WORK_SANS_BOLD};
  font-size: ${({ theme }) => RFValue(theme.fonts.MEDIUM_SIZE)}px;
  color: ${({ theme }) => theme.colors.PRIMARY_TEXT};
  width: 60px;
  justify-content: center;
  align-items: center;
  text-align: center;
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
  margin-top: 20px;
`;

export const LinkAccountsContainer = styled.View`
  margin: 20px 0px;
`;

export const InstagramButton = styled.TouchableHighlight`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fb4e4e;
  border-radius: 30px;
  padding: 5px 15px;
  margin: 10px 0px 15px 0px;
`;

export const SpotifyButton = styled.TouchableHighlight`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #2ac769;
  border-radius: 30px;
  padding: 5px 15px;
  margin: 30px 0px 15px 0px;
`;

export const ButtonDot = styled.View`
  width: ${RFValue(20)}px;
  height: ${RFValue(20)}px;
  background-color: ${hexToRGB('#ffffff', 0.25)};
  border-radius: ${RFValue(20)}px;
  border: 3px ${({ theme }) => theme.colors.WHITE} solid;
`;

export const TitleCover = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${RFValue(10)}px;
  margin-top: ${RFValue(20)}px;
`;
