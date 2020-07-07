import { RFValue } from 'react-native-responsive-fontsize';
import { LayoutProvider } from 'recyclerlistview';
import { DEVICE_FULL_WIDTH } from './device';

/*
 *****************************************************************************
 ****************** RECYCLER_LIST_VIEW LAYOUT PROVIDER ***********************
 *****************************************************************************
 */

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
