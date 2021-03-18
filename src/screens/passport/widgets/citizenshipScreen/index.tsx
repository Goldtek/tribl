import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, FlatList } from 'react-native';
import { Title, Paragraph } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import SearchInput, { createFilter } from 'react-native-search-filter';
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
import { Container, SearchCover } from './styles';

function CitizenshipScreen(props: any) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [countries, setCountries] = useState(countriesDB.getAllCountries());

  const [country, setCountry] = useState({
    selectedCountry: new Map()
  });

  const [search, setSearch] = useState({ searchTerm: '' });
  const searchUpdated = (text: string) => setSearch({ searchTerm: text });
  const KeysToFilter = ['name'];

  const filteredWords =
    countries &&
    countries.filter(createFilter(search.searchTerm, KeysToFilter));

  const handleInputError = (error: string) => {
    Toast.show(t(`community.passport.${error}`));
  };

  const selectedCountries = [...Array.from(country.selectedCountry.values())];

  const handleSelect = (selected: { name: string; flag: string }) => {
    const selectedCountryIndex = countries.findIndex(
      (country) => country.name === selected.name
    );
    if (!country.selectedCountry.has(selected.name)) {
      if (selectedCountryIndex) {
        countries[selectedCountryIndex]['selected'] = true;
      }
      return setCountry({
        ...country,
        selectedCountry: new Map(
          country.selectedCountry.set(selected.name, selected)
        )
      });
    }

    if (selectedCountryIndex) {
      countries[selectedCountryIndex]['selected'] = false;
    }

    country.selectedCountry.delete(selected.name);
    setCountry({
      ...country,
      selectedCountry: new Map(country.selectedCountry)
    });
  };

  useEffect(() => {
    tagScreenName('SelectCountry');
    logEvent('select country', {
      from: 'passport'
    });
  }, []);

  const _renderItem = ({ item }: { item: CountryInterface }) => {
    return (
      <CountryCard
        {...item}
        {...props}
        selected={item.selected}
        handleSelect={handleSelect}
      />
    );
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
        <SearchCover>
          <AntDesign
            name="search1"
            color={colors.PRIMARY_TEXT}
            size={RFValue(20)}
            style={{
              position: 'relative',
              left: RFValue(30),
              top: RFValue(31)
            }}
          />
          <SearchInput
            onChangeText={searchUpdated}
            placeholder={t(`signup.selectCountry.placeholder`)}
            placeholderTextColor={colors.SECONDARY_TEXT}
            style={{
              width: '94%',
              height: RFValue(50),
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE - 2),
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              alignItems: 'center',
              position: 'relative',
              bottom: RFValue(20),
              elevation: 0,
              borderWidth: 1,
              borderColor: colors.INACTIVE,
              borderRadius: 4,
              paddingLeft: RFValue(50),
              marginVertical: RFValue(15),
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
        </SearchCover>
      </Container>

      <Container
        style={{
          flex: 1,
          paddingLeft: RFValue(10),
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0
        }}
      >
        <FlatList
          style={{ flex: 1 }}
          data={filteredWords}
          renderItem={_renderItem}
        />
      </Container>
      <GradientButton
        onPress={handleNavigation}
        style={{
          marginHorizontal: RFValue(15)
        }}
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
