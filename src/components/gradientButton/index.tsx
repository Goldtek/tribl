import React, { FunctionComponent } from 'react';
import { useThemeContext } from '../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

import { Container } from './styles';

type GradientButtonProps = {
  loading?: boolean;
  uppercase?: boolean;
  color?: string;
  bgColor?: string;
  mode?: 'text' | 'outlined' | 'contained' | undefined;
  onPress?: ((T?: any) => void) | undefined;
  labelStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  gradientContainerstyle?: StyleProp<ViewStyle>;
};

const GradientButton: FunctionComponent<GradientButtonProps> = (props) => {
  const {
    children,
    loading,
    color,
    bgColor,
    mode,
    uppercase,
    labelStyle,
    style,
    contentStyle,
    onPress,
    
    gradientContainerstyle
  } = props;

  const { colors, fonts } = useThemeContext();

  return (
    <Container
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 3 }}
      colors={[bgColor ? bgColor : colors.PRIMARY, bgColor ? bgColor : colors.SECONDARY]}
      style={[
        { borderRadius: 4, marginTop: RFValue(20)},
        gradientContainerstyle
      ]}
    >
      <Button
        mode={mode ? mode : 'text'}
        color={color ? color : colors.WHITE}
        uppercase={uppercase ? uppercase : false}
        loading={loading ? loading : false}
        labelStyle={[
          {
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE),
            textTransform: 'capitalize'
          },
          labelStyle
        ]}
        contentStyle={[{ height: RFValue(55) }, contentStyle ]}
        style={[{ width: '100%', height: RFValue(55) }, style]}
        onPress={onPress}
      >
        {children}
      </Button>
    </Container>
  );
};

export default GradientButton;
