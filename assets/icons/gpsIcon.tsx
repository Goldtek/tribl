import * as React from 'react';
import { SvgCss } from 'react-native-svg';
import { IconProps } from './types';

export default function GPSIcon(props: IconProps) {
  const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="477.881" height="477.883" viewBox="0 0 477.881 477.883">
  <g id="gps" transform="translate(-0.001 0)">
    <g id="Group_5" data-name="Group 5">
      <path id="Path_11" data-name="Path 11" d="M468.456,1.808a17.063,17.063,0,0,0-15.289,0h0L9.433,223.675a17.066,17.066,0,0,0,4.573,32.051L190.117,287.76l32.034,176.111A17.066,17.066,0,0,0,236.5,477.712a16.66,16.66,0,0,0,2.423.171,17.067,17.067,0,0,0,15.275-9.438L476.07,24.711A17.066,17.066,0,0,0,468.456,1.808ZM246.557,407.38,221.571,270.027a17.066,17.066,0,0,0-13.653-13.653L70.5,231.32,422.634,55.244Z" fill="#718cfb"/>
    </g>
  </g>
  </svg>
      `;

  return <SvgCss xml={xml} width="100%" height="100%" {...props} />;
}
