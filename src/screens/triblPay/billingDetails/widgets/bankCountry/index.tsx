import React, { useState, useEffect } from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { AntDesign } from '@expo/vector-icons';
import { useThemeContext } from '../../../../../theme';
import { tagScreenName, logEvent } from '../../../../../utils/uxcamHelper';
import CountryCard from './widgets/country';
import countriesDB, { CountryInterface } from '../../../../../libs/countries';
import { getCountryLayout } from '../../../../../utils/LayoutUtil';
import Input from '../../../../../components/input';

import { Container, SearchCover, HeaderCover } from './styles';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../../../../utils/device';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// DEFINE SCREEN PROP TYPES

export default function Countries(props: any) {
  const insets = useSafeAreaInsets();
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
    <Portal>
      <Modalize
        ref={props.modalizeRef}
        modalHeight={DEVICE_FULL_HEIGHT}
        modalStyle={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 20,
          paddingTop: insets.top,
          backgroundColor: colors.WHITE
        }}
        childrenStyle={{ paddingBottom: insets.bottom }}
        handlePosition="inside"
        panGestureEnabled={false}
      >
        <Container>
          <HeaderCover>
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
              Select Country
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
            style={{ height: 600, width: 600, marginTop: RFValue(15) }}
            dataProvider={state.dataProvider}
            layoutProvider={state.layoutProvider}
            rowRenderer={rowRenderer}
          />
        </Container>
      </Modalize>
    </Portal>
  );
}
