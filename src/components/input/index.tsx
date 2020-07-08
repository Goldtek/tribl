import React from 'react';

import { Container, TextInput } from './styles';
import { ViewStyle, TextStyle, StyleProp } from 'react-native';

type InputProps = {
  textInputStyle?: StyleProp<TextStyle>;
  contanierStyle?: StyleProp<ViewStyle>;
  testID?: string;
  placeholder: string;
  defaultValue: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  returnKeyType?: any;
  onChangeText(T: any): void;
  children?: React.ReactNode;
};

export default function Input(props: InputProps) {
  const { children, contanierStyle, textInputStyle, ...restProps } = props;
  return (
    <Container style={contanierStyle}>
      {children}
      <TextInput {...restProps} style={textInputStyle} />
    </Container>
  );
}
