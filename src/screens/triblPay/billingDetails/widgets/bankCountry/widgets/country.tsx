import React, { Fragment } from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../../../theme';
import { CountryInterface } from '../../../../../../libs/countries';

// IMPORT FOR ALL CUSTOM STYLES
import { CountryCardCover } from '../styles';
import { NavigationInterface } from '../../../../../types';

interface CountryCardProps extends CountryInterface, NavigationInterface {
  modalizeRef: any;
  billingDetails: any;
  setBillingDetails: any;
  setIsLocal: any;
}

const CountryCard = (props: CountryCardProps) => {
  const { colors, fonts } = useThemeContext();
  const {
    name,
    iso2,
    emoji,
    billingDetails,
    setBillingDetails,
    setIsLocal
  } = props;

  const closeModal = () => props.modalizeRef.current?.close();

  const handleSelect = () => {
    setBillingDetails({ ...billingDetails, addressCountryCode: iso2 });
    iso2 === 'US' ? setIsLocal(true) : setIsLocal(false);
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
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
              marginVertical: 0,
              paddingVertical: 0
            }}
          >
            {emoji}
          </Title>

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
