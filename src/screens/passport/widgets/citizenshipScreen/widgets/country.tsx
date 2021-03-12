import React, { Fragment } from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import CheckBox from '@react-native-community/checkbox';
import { TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../../../../theme';
import { CountryInterface } from '../../../../../libs/countries';
import { NavigationInterface } from '../../../../types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from '../styles';

interface CountryCardProps extends CountryInterface, NavigationInterface {
  handleSelect(T: object): void;
  selected: boolean;
}

const CountryCard = (props: CountryCardProps) => {
  const { colors, fonts } = useThemeContext();

  const { name, iso2, id, emoji, navigation, handleSelect, selected } = props;

  const onPress = () => handleSelect({ name, flag: emoji });
  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        height: RFValue(60),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15
      }}
    >
      <Fragment>
        <Container style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Title
            style={{
              fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE + 5))
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
        <CheckBox
          disabled={false}
          value={selected}
          onValueChange={onPress}
          boxType="square"
          tintColors={{
            true: colors.PRIMARY,
            false: colors.INACTIVE
          }}
          tintColor={colors.INACTIVE}
          onCheckColor={colors.WHITE}
          onFillColor={colors.PRIMARY}
          onTintColor={colors.PRIMARY}
          animationDuration={0.3}
          style={{
            width: RFValue(20),
            height: RFValue(20),
            marginRight: RFValue(15)
          }}
        />
      </Fragment>
    </TouchableOpacity>
  );
};

export default React.memo(CountryCard, () => false);
