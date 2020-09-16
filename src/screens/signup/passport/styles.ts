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
