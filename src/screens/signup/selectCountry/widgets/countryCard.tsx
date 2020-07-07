import React, { Fragment } from 'react';
import { Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity, Image } from 'react-native';
import { CHANGE_USER_COUNTRY } from '../../../../graphql/cache/query';
import { useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../theme';
import COUNTRIES, { CountryInterface } from '../../../../libs/countries';
import { NavigationInterface } from '../../../types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from '../styles';

interface CountryCardProps extends CountryInterface, NavigationInterface {}

const CountryCard = (props: CountryCardProps) => {
  const { colors, fonts } = useThemeContext();

  const { name, iso2, dialCode, navigation } = props;

  const [toggleTodo] = useMutation(CHANGE_USER_COUNTRY, {
    variables: { countryCode: iso2 }
  });

  const handleSelect = () => {
    toggleTodo();
    navigation.goBack();
  };
  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.INACTIVE
      }}
    >
      <Fragment>
        <Container style={{ flexDirection: 'row' }}>
          <Image
            //@ts-ignore
            source={COUNTRIES.getFlag(iso2)}
            style={{
              width: RFValue(50),
              height: RFValue(35),
              resizeMode: 'contain',
              borderRadius: 4
            }}
          />
          <Title
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
              color: colors.PRIMARY_TEXT,
              textTransform: 'capitalize',
              marginLeft: 20,
              lineHeight: RFValue(30)
            }}
          >
            {name.length <= 20 ? name : `${name.substring(0, 20)}...`}
          </Title>
        </Container>
        <Paragraph>+{dialCode}</Paragraph>
      </Fragment>
    </TouchableOpacity>
  );
};

export default React.memo(CountryCard);
