import * as React from 'react';
import { SvgCss } from 'react-native-svg';
import { IconProps } from './types';

export default function InboxIcon(props: IconProps) {
  const xml = `
  <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="14" height="14" transform="translate(1 7)" fill="white"/>
<path d="M15 16.3333C15 16.7459 14.8361 17.1416 14.5444 17.4333C14.2527 17.725 13.857 17.8889 13.4444 17.8889H4.11111L1 21V8.55556C1 8.143 1.16389 7.74733 1.45561 7.45561C1.74733 7.16389 2.143 7 2.55556 7H13.4444C13.857 7 14.2527 7.16389 14.5444 7.45561C14.8361 7.74733 15 8.143 15 8.55556V16.3333Z" stroke=${props.fillColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect width="14" height="14" transform="translate(10 1)" fill="white"/>
<path d="M24 10.3333C24 10.7459 23.8361 11.1416 23.5444 11.4333C23.2527 11.725 22.857 11.8889 22.4444 11.8889H13.1111L10 15V2.55556C10 2.143 10.1639 1.74733 10.4556 1.45561C10.7473 1.16389 11.143 1 11.5556 1H22.4444C22.857 1 23.2527 1.16389 23.5444 1.45561C23.8361 1.74733 24 2.143 24 2.55556V10.3333Z" stroke=${props.fillColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  
`;

  return <SvgCss xml={xml} width="100%" height="100%" {...props} />;
}
