import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';

export const GradientContainer = styled(LinearGradient)`
  flex: 1;
  padding: ${RFValue(30)}px ${RFValue(15)}px;
`;
