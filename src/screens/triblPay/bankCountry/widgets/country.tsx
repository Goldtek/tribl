import React, { Fragment } from 'react';
import { Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useThemeContext } from '../../../../theme';
import { NavigationInterface } from '../../../types';
import { CountryInterface } from '../../../../libs/countries';
import { MyPassportInterface } from '../../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { CountryCardCover } from '../styles';

interface CountryCardProps extends CountryInterface, NavigationInterface {
  userDetails: MyPassportInterface;
}

const CountryCard = (props: CountryCardProps) => {
  const { colors, fonts } = useThemeContext();
  const { name, iso2, emoji, navigation, userDetails } = props;

  const handleSelect = () => {
    if (name === 'United States of America' || iso2 === 'US') {
      return navigation.navigate('VerifyIdentityScreen', {
        details: { name, iso2, emoji },
        userDetails
      });
    }

    navigation.navigate('SelfieScreen', {
      details: { name, iso2, emoji },
      userDetails
    });
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
