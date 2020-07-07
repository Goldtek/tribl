import * as React from 'react';
import { SvgCss } from 'react-native-svg';
import { IconProps } from './types';

export default function CommunityIcon(props: IconProps) {
  const xml = `
      <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0)">
      <circle cx="6.875" cy="15.625" r="5.875" stroke="${props.fillColor}" stroke-width="2"/>
      <circle cx="14.6667" cy="7.83329" r="9.16667" fill="white"/>
      <path d="M20.9036 7.83328C20.9036 11.2778 18.1113 14.0701 14.6668 14.0701C11.2223 14.0701 8.42993 11.2778 8.42993 7.83328C8.42993 4.38877 11.2223 1.59644 14.6668 1.59644C18.1113 1.59644 20.9036 4.38877 20.9036 7.83328Z" stroke="${props.fillColor}" stroke-width="2"/>
      </g>
      <defs>
      <clipPath id="clip0">
      <rect width="22" height="22" fill="white" transform="translate(0 0.5)"/>
      </clipPath>
      </defs>
      </svg>
      `;

  return <SvgCss uri xml={xml} width="100%" height="100%" {...props} />;
}
