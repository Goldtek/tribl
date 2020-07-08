import * as React from 'react';
import { SvgCss } from 'react-native-svg';
import { IconProps } from './types';
import hexToRGB from '../../src/utils/hexToRGB';

export default function EllipseIcon(props: IconProps) {
  const xml = `
      <svg width="207" height="34" viewBox="0 0 207 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="103.5" cy="17" rx="103.5" ry="17" fill="${hexToRGB(
        '#E8E8E8',
        0.1
      )}"/>
      </svg>
      `;

  return <SvgCss xml={xml} width="55%" height="10%" {...props} />;
}
