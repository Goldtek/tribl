import React, { Fragment } from 'react';
import { Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native';
import { ADD_USER_DETAILS } from '../../../../graphql/cache/mutations';
import { useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../theme';
import { CountryInterface } from '../../../../libs/countries';
import { NavigationInterface } from '../../../types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from '../styles';

interface CountryCardProps extends CountryInterface, NavigationInterface {}

const CountryCard = (props: CountryCardProps) => {
  const { colors, fonts } = useThemeContext();

  const { name, iso2, phoneCode, emoji, navigation } = props;

  const [toggleTodo] = useMutation(ADD_USER_DETAILS, {
    variables: { details: { countryCode: iso2 } }
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
          <Title
            style={{
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE))
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
              marginLeft: 20,
              lineHeight: RFValue(30)
            }}
          >
            {name.length <= 20 ? name : `${name.substring(0, 20)}...`}
          </Title>
        </Container>
        <Paragraph>{phoneCode}</Paragraph>
      </Fragment>
    </TouchableOpacity>
  );
};

export default React.memo(CountryCard, () => false);
