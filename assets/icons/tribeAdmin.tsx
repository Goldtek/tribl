import * as React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

function SvgComponent(props: IconProps) {
  return (
    <Svg
      width={RFValue(34)}
      height={RFValue(24)}
      viewBox="0 0 179 269"
      fill="none"
      {...props}
    >
      <Path d="M0 0h179v157.771L89.5 269 0 157.771V0z" fill="#535D7E" />
    </Svg>
  );
}

export default SvgComponent;
