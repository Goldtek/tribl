import React, { useState, useMemo, useEffect, useRef, ReactNode } from 'react';
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
import AlgoliaCommunityList from '../../../../../components/algoliaCommunityList ';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  route: { params: { indexName: string; filters: any } };
}

function SearchModal(props: ModalProp) {
  const details = props.route.params;

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
        marginLeft: RFValue(10),
        marginRight: RFValue(10),
        marginTop: RFValue(15),
        fontFamily: fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE),
        color: colors.SECONDARY_TEXT,
        marginHorizontal: 15,
        elevation: 0,
        borderColor: colors.INACTIVE,
        borderRadius: 4,
        borderWidth: 1
      }}
      iconColor={colors.PRIMARY_TEXT}
    />
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), []);

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
        indexName={details?.indexName}
        searchState={state.search}
        onSearchStateChange={onSearchStateChange}
      >
        <Configure filters={details?.filters} hitsPerPage={8} distinct />
        <AlgoliaSearchBox />
        <AlgoliaCommunityList />
      </InstantSearch>
    </Container>
  );
}

export default React.memo(SearchModal);
