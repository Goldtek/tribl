import * as React from 'react';
import { SvgCss } from 'react-native-svg';
import { IconProps } from './types';

export default function TriblIcon(props: IconProps) {
  const xml = `
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="11" cy="11.5" r="10" stroke="${props.fillColor}" stroke-width="2"/>
  </svg>
`;

  return <SvgCss xml={xml} width="100%" height="100%" {...props} />;
}
