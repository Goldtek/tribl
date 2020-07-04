import * as React from 'react';
import { SvgCss } from 'react-native-svg';
import { IconProps } from './types';

export default function ProfileIcon(props: IconProps) {
  const xml = `
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11" cy="11.5" r="10" stroke="${props.fillColor}" stroke-width="2"/>
<path d="M17.1111 18.4259C17.1111 17.5615 16.7892 16.7325 16.2162 16.1212C15.6432 15.51 14.866 15.1666 14.0556 15.1666H7.94447C7.13409 15.1666 6.3569 15.51 5.78387 16.1212C5.21084 16.7325 4.88892 17.5615 4.88892 18.4259" stroke="${props.fillColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.9999 11.5C12.6874 11.5 14.0554 10.132 14.0554 8.44447C14.0554 6.75693 12.6874 5.38892 10.9999 5.38892C9.31235 5.38892 7.94434 6.75693 7.94434 8.44447C7.94434 10.132 9.31235 11.5 10.9999 11.5Z" stroke="${props.fillColor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;

  return <SvgCss xml={xml} width="100%" height="100%" {...props} />;
}
