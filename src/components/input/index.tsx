import React from 'react';

import { Container, TextInput } from './styles';
import { ViewStyle, TextStyle, StyleProp, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  textInputStyle?: StyleProp<TextStyle>;
  contanierStyle?: StyleProp<ViewStyle>;
  testID?: string;
  children?: React.ReactNode;
}

export default function Input(props: InputProps) {
  const { children, contanierStyle, textInputStyle, ...restProps } = props;
  return (
    <Container style={contanierStyle}>
      {children}
      <TextInput {...restProps} style={textInputStyle} />
    </Container>
  );
}
