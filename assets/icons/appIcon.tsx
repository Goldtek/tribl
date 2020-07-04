import * as React from 'react';
import { SvgCss } from 'react-native-svg';
import { IconProps } from './types';

export default function AppIcon(props: IconProps) {
  const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="250" height="250" viewBox="0 0 250 250">
  <defs>
    <rect id="rect-1" width="250" height="250" x="0" y="0"/>
    <mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse">
      <rect width="250" height="250" x="0" y="0" fill="black"/>
      <use fill="white" xlink:href="#rect-1"/>
    </mask>
    <linearGradient id="linearGradient-4" x1="212.508" x2="31.44" y1="32.44" y2="217.107" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="rgb(57,161,247)"/>
      <stop offset="1" stop-color="rgb(168,117,255)"/>
    </linearGradient>
    <linearGradient id="linearGradient-6" x1="12.408" x2="257.774" y1="223.831" y2="37.095" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="rgb(168,117,255)"/>
      <stop offset="1" stop-color="rgb(57,161,247)"/>
    </linearGradient>
    <image id="02e59769-876c-4c7c-a096-0cbeca63a71b" width="99" height="39" x="0" y="0" xlink:href="data:image/png;base64,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"/>
    <pattern id="pattern-8" width="1.008" height="1" x="-.008" y="0" patternUnits="objectBoundingBox">
      <use transform="scale(.98149484)" xlink:href="#02e59769-876c-4c7c-a096-0cbeca63a71b"/>
    </pattern>
  </defs>
  <g>
    <use fill="none" xlink:href="#rect-1"/>
    <g mask="url(#mask-2)">
      <ellipse cx="128.661" cy="125.032" fill="url(#linearGradient-4)" rx="89.505" ry="90.006"/>
      <ellipse cx="128.661" cy="125.032" fill="none" stroke="url(#linearGradient-6)" stroke-dasharray="0 0 0 0" stroke-linecap="butt" stroke-linejoin="miter" stroke-width="4" rx="109.566" ry="110.179"/>
      <rect width="95.678" height="38.278" x="80.822" y="105.893" fill="url(#pattern-8)"/>
    </g>
  </g>
</svg>
`;

  return <SvgCss xml={xml} width="50%" height="50%" {...props} />;
}
