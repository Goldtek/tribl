import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

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
