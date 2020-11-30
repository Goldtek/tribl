import * as React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

function SvgComponent(props: IconProps) {
  return (
    <Svg
      width={RFValue(20)}
      height={RFValue(13)}
      viewBox="0 0 139 132"
      fill="none"
      {...props}
    >
      <Path
        d="M69.5 0l16.277 50.096h52.675L95.837 81.058l16.277 50.096L69.5 100.193l-42.614 30.961 16.277-50.096L.548 50.096h52.675L69.5 0z"
        fill="#A3AAC2"
      />
    </Svg>
  );
}

export default SvgComponent;
