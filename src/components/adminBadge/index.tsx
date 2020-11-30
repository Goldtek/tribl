import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Badge from '../../../assets/icons/tribeAdmin';
import Star from '../../../assets/icons/star';

import { Container } from './styles';

interface AdminBadgeProps {
  style?: StyleProp<ViewStyle>;
}

export default function AdminBadge(props: AdminBadgeProps) {
  const { style } = props;
  return (
    <Container style={style}>
      <Badge style={{ position: 'relative' }} />
      <Star style={{ position: 'relative', right: RFValue(27) }} />
    </Container>
  );
}
