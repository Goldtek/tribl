import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { RecyclerListView, DataProvider } from 'recyclerlistview';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { getCountryLayout } from '../../../utils/LayoutUtil';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import Input from '../../../components/input';
import CountryCard from './widgets/country';
import countriesDB, { CountryInterface } from '../../../libs/countries';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SelectCountryScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [state, setState] = useState({
    dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
      countriesDB.getAllCountries()
    ),
    layoutProvider: getCountryLayout()
  });

  useEffect(() => {
    tagScreenName('SelectCountry');
    logEvent('select country', { from: 'signup' });
  }, []);

  const rowRenderer = (_type: React.ReactText, data: CountryInterface) => {
    if (data?.isEmpty) {
      return (
        <Container style={{ marginLeft: 15, marginRight: 15 }}>
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
        </Container>
      );
    }

    return <CountryCard {...data} {...props} />;
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
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: colors.WHITE
      }}
    >
      <StatusBar translucent animated style="light" />
      <Container>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE * 1.6)),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            marginLeft: 15,
            marginTop: 10,
            marginBottom: 10,
            lineHeight: RFValue(30)
          }}
        >
          {t(`signup.selectCountry.title`)}
        </Title>

        <Input
          placeholder={t(`signup.selectCountry.placeholder`)}
          defaultValue=""
          onChangeText={handleSearch}
          textInputStyle={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}
          contanierStyle={{ height: RFValue(50) }}
        >
          <Container style={{ paddingLeft: 15, paddingRight: 15 }}>
            <AntDesign
              name="search1"
              color={colors.PRIMARY_TEXT}
              size={RFValue(20)}
            />
          </Container>
        </Input>
      </Container>

      <Container
        style={{
          flex: 1,
          marginTop: 20,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopWidth: 1,
          borderTopColor: colors.INACTIVE
        }}
      >
        <RecyclerListView
          style={{ flex: 1 }}
          dataProvider={state.dataProvider}
          layoutProvider={state.layoutProvider}
          rowRenderer={rowRenderer}
        />
      </Container>
    </SafeAreaView>
  );
}
