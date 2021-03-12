import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import GradientButton from '../../../../components/gradientButton';
import { useThemeContext } from '../../../../theme';
import CountryCard from './widgets/country';
import { useNavigation } from '@react-navigation/native';
import countriesDB, { CountryInterface } from '../../../../libs/countries';
import { tagScreenName, logEvent } from '../../../../utils/uxcamHelper';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { getCountryLayout } from '../../../../utils/LayoutUtil';
import { AntDesign } from '@expo/vector-icons';
import Input from '../../../../components/input';
import { Toast } from '../../../../components/rootToaster';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

function CitizenshipScreen(props: any) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [country, setCountry] = useState({
    selectedCountry: new Map()
  });

  const handleInputError = (error: string) => {
    Toast.show(t(`community.passport.${error}`));
  };

  const selectedCountries = [...Array.from(country.selectedCountry.values())];

  const handleSelect = (selected: { name: string; flag: string }) => {
    if (!country.selectedCountry.has(selected.name)) {
      return setCountry({
        ...country,
        selectedCountry: new Map(
          country.selectedCountry.set(selected.name, selected)
        )
      });
    }

    country.selectedCountry.delete(selected.name);
    setCountry({
      ...country,
      selectedCountry: new Map(country.selectedCountry)
    });
  };

  const [state, setState] = useState({
    dataProvider: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
      countriesDB.getAllCountries()
    ),
    layoutProvider: getCountryLayout()
  });

  useEffect(() => {
    tagScreenName('SelectCountry');
    logEvent('select country', { from: 'passport' });
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

    return (
      <CountryCard
        {...data}
        {...props}
        selected={country.selectedCountry.get(props.name)}
        handleSelect={handleSelect}
      />
    );
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

  const handleNavigation = () => {
    if (selectedCountries?.length > 3) {
      return handleInputError('countryError');
    }
    if (selectedCountries?.length < 1) {
      return handleInputError('selectError');
    }
    navigation.navigate('PassportScreen', {
      selectedCountries: selectedCountries
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
            lineHeight: RFValue(27)
          }}
        >
          {t(`community.passport.addCitizen`)}
        </Title>
        <Paragraph
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(Math.ceil(fonts.LARGE_SIZE)),
            color: colors.SECONDARY_TEXT,
            marginLeft: 15,
            marginBottom: 15
          }}
        >
          {t(`community.passport.add`)}
        </Paragraph>

        <Input
          placeholder={t(`signup.selectCountry.placeholder`)}
          defaultValue=""
          onChangeText={handleSearch}
          textInputStyle={{ fontFamily: fonts.WORK_SANS_SEMI_BOLD }}
          contanierStyle={{
            height: RFValue(50),
            width: '92%',
            alignSelf: 'center'
          }}
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
          paddingBottom: 0
        }}
      >
        <RecyclerListView
          style={{ flex: 1 }}
          dataProvider={state.dataProvider}
          layoutProvider={state.layoutProvider}
          rowRenderer={rowRenderer}
        />
      </Container>
      <GradientButton
        onPress={handleNavigation}
        style={{ marginHorizontal: RFValue(15) }}
        gradientContainerstyle={{
          marginHorizontal: RFValue(15),
          marginBottom: RFValue(15),
          height: RFValue(45)
        }}
      >
        {t(`community.passport.addCitizen`)}
      </GradientButton>
    </SafeAreaView>
  );
}

export default React.memo(CitizenshipScreen);
