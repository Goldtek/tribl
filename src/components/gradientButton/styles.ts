import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(LinearGradient)`
  min-height: ${RFValue(50)}px;
  justify-content: center;
  align-items: center;
`;
