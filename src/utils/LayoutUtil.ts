import { RFValue } from 'react-native-responsive-fontsize';
import { LayoutProvider } from 'recyclerlistview';
import { DEVICE_FULL_WIDTH } from './device';

/*
 *****************************************************************************
 ****************** RECYCLER_LIST_VIEW LAYOUT PROVIDER ***********************
 *****************************************************************************
 */

export const ViewTypes = {
  COMMUNITY_HEADER: 'COMMUNITY_HEADER',
  RECOMMENDED_MEMBER: 'RECOMMENDED_MEMBER',
  RECOMMENDED_COMMUNITY: 'RECOMMENDED_COMMUNITY',
  COMMUNITY_ACTIVITY: 'COMMUNITY_ACTIVITY'
};

// COUNTRY LIST VIEW PROVIDER
export const getCountryLayout = () => {
  return new LayoutProvider(
    () => 'VSEL', //Since we have just one view type
    (_type, dim) => {
      dim.width = DEVICE_FULL_WIDTH;
      dim.height = RFValue(60);
    }
  );
};

// COMMUNITY SCREEN RECOMMENDED MEMBERS & COMMUNITIES LIST VIEW PROVIDER
export default function layoutProvider() {
  return new LayoutProvider(
    (index) => {
      switch (index) {
        case 0:
          return ViewTypes.COMMUNITY_HEADER;

        case 1:
          return ViewTypes.RECOMMENDED_MEMBER;

        case 2:
          return ViewTypes.RECOMMENDED_COMMUNITY;

        case 3:
          return ViewTypes.COMMUNITY_HEADER;

        default:
          return index;
      }
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.COMMUNITY_HEADER:
          dim.width = RFValue(Math.round(DEVICE_FULL_WIDTH));
          dim.height = RFValue(100);
          break;

        case ViewTypes.RECOMMENDED_MEMBER:
          dim.width = RFValue(Math.round(DEVICE_FULL_WIDTH));
          dim.height = RFValue(200);
          break;

        case ViewTypes.RECOMMENDED_COMMUNITY:
          dim.width = RFValue(Math.round(DEVICE_FULL_WIDTH));
          dim.height = RFValue(300);
          break;

        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );
}
