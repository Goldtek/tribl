import React, { useState, useEffect } from 'react';
import { Title, ProgressBar, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { AntDesign } from '@expo/vector-icons';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import CountryCard from './widgets/country';
import countriesDB, { CountryInterface } from '../../../libs/countries';
import { getCountryLayout } from '../../../utils/LayoutUtil';
import Input from '../../../components/input';

import { Container, SearchCover, HeaderCover } from './styles';
import { MyPassportInterface } from '../../../graphql/types';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  route: { params: { userDetails: MyPassportInterface } };
}

export default function BankCountryScreen(props: ScreenProp) {
  const { userDetails } = props.route.params;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
      countriesDB.getAllCountries()
    ),
    layoutProvider: getCountryLayout()
  });

  useEffect(() => {
    tagScreenName('BankCountryScreen');
    logEvent('select bank country', { from: 'passport' });
  }, []);

  const rowRenderer = (_type: React.ReactText, data: CountryInterface) => {
    if (data?.isEmpty) {
      return (
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
            color: colors.PRIMARY_TEXT,
            lineHeight: RFValue(30)
          }}
        >
          {t(`signup.selectCountry.emptyList`)}
        </Title>
      );
    }

    return <CountryCard {...data} {...props} userDetails={userDetails} />;
  };

  const handleSearch = (value: string) => {
    const result = countriesDB.searchCountry(value);

    if (!result.length) {
      return setState({
        ...state,
        dataProvider: state.dataProvider.cloneWithRows([{ isEmpty: true }])
      });
    }

    setState({
      ...state,
      dataProvider: state.dataProvider.cloneWithRows(result)
    });
  };

  return (
    <Container>
      <HeaderCover>
        <ProgressBar
          progress={1 / 3}
          color={colors.PRIMARY}
          style={{
            height: RFValue(5),
            backgroundColor: '#F2F2F7',
            borderRadius: 4,
            marginBottom: 10
          }}
        />
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE - 1),
            color: colors.PRIMARY,
            textTransform: 'capitalize',
            marginBottom: RFValue(10),
            marginTop: RFValue(15),
            lineHeight: RFValue(19)
          }}
        >
          {t(`community.passport.step`)} 1
        </Text>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE + 5),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            lineHeight: RFValue(30),
            marginBottom: RFValue(5)
          }}
        >
          {t(`community.passport.bank`)}
        </Title>
        <Input
          placeholder={t(`signup.selectCountry.placeholder`)}
          defaultValue=""
          onChangeText={handleSearch}
          textInputStyle={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}
          contanierStyle={{
            height: RFValue(45),
            width: '100%',
            alignSelf: 'center'
          }}
        >
          <SearchCover>
            <AntDesign
              name="search1"
              color={colors.PRIMARY_TEXT}
              size={RFValue(20)}
            />
          </SearchCover>
        </Input>
      </HeaderCover>
      <RecyclerListView
        style={{ flex: 1, marginTop: RFValue(15) }}
        dataProvider={state.dataProvider}
        layoutProvider={state.layoutProvider}
        rowRenderer={rowRenderer}
      />
    </Container>
  );
}
