import React, { Fragment } from 'react';
import { Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeContext } from '../../../../../../../theme';
import { NavigationInterface } from '../../../../../../types';
import { USStatesInterface } from '../../../../../../../libs/states';

// IMPORT FOR ALL CUSTOM STYLES
import { CountryCardCover } from '../styles';

interface CountryCardProps extends USStatesInterface, NavigationInterface {
  modalizeStateRef: any;
  billingDetails: any;
  setBillingDetails: any;
}

const CountryCard = (props: CountryCardProps) => {
  const { colors, fonts } = useThemeContext();
  const { name, alphaCode, billingDetails, setBillingDetails } = props;

  const closeModal = () => props.modalizeStateRef.current?.close();

  const handleSelect = () => {
    setBillingDetails({
      ...billingDetails,
      addressState: name,
      addressStateCode: alphaCode
    });
    closeModal();
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: RFValue(20),
        paddingRight: RFValue(20),
        borderBottomWidth: 1,
        borderBottomColor: colors.INACTIVE
      }}
    >
      <Fragment>
        <CountryCardCover>
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              marginLeft: 10,
              marginVertical: 0,
              paddingVertical: 0
            }}
          >
            {name.length <= 25 ? name : `${name.substring(0, 25)}...`}
          </Title>
        </CountryCardCover>
      </Fragment>
    </TouchableOpacity>
  );
};

export default React.memo(CountryCard, () => false);
