import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import {
  InstantSearch,
  connectSearchBox,
  Configure
} from 'react-instantsearch-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import { searchClient } from '../../../../../config';
import AlgoliaList from '../../../../../components/algoliaList';
import { PAGINATION_DEFAULT } from '../../../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  route: { params: { indexName: string } };
}

function SearchScreen(props: ModalProp) {
  const { indexName } = props.route.params;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const inputRef = useRef<TextInput>(null);

  const [state, setState] = useState({ search: {} });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const _searchBox = ({ currentRefinement, refine }: any) => (
    <Searchbar
      autoFocus
      ref={inputRef}
      value={currentRefinement}
      onChangeText={(value) => refine(value)}
      placeholder={t(`community.chat.search`)}
      style={{
        height: RFValue(40),
        fontFamily: fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE),
        color: colors.SECONDARY_TEXT,
        marginHorizontal: 15,
        marginVertical: 15,
        elevation: 0,
        borderColor: colors.INACTIVE,
        borderRadius: 4,
        borderWidth: 1
      }}
      iconColor={colors.PRIMARY_TEXT}
    />
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), [
    indexName
  ]);

  return (
    <Container
      style={{
        width: '100%',
        backgroundColor: 'transparent',
        justifyContent: 'center'
      }}
    >
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        searchState={state.search}
        onSearchStateChange={onSearchStateChange}
      >
        <Configure hitsPerPage={PAGINATION_DEFAULT} distinct />
        <AlgoliaSearchBox />
        <AlgoliaList />
      </InstantSearch>
    </Container>
  );
}

export default React.memo(SearchScreen);
