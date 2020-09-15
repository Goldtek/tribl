import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
  Fragment
} from 'react';
import { Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'expo-status-bar';
import { TextInput } from 'react-native';
import algolia from 'algoliasearch';
import {
  InstantSearch,
  connectSearchBox,
  Configure
} from 'react-instantsearch-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DEVICE_FULL_HEIGHT } from '../../utils/device';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ModalProp {
  isVisible: boolean;
  indexName: string;
  children: React.ReactElement<ReactNode | any>;
  closeSearchModal(): void;
  filters?: any;
}

const searchClient = algolia('RX45YY5JC5', 'b637454d460aa7a6288a6066c8341ac4');

function SearchModal(props: ModalProp) {
  const { isVisible, closeSearchModal, indexName, children, filters } = props;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const inputRef = useRef<TextInput>(null);
  const modalRef = useRef<Modalize>(null);

  const [state, setState] = useState({ search: {} });

  const openModal = () => modalRef.current?.open();

  const closeModal = () => modalRef.current?.close();

  useEffect(() => {
    if (isVisible) {
      openModal();
      inputRef.current?.focus();
    }
  }, [isVisible]);

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const _searchBox = ({ currentRefinement, refine }: any) => (
    <Fragment>
      <Searchbar
        autoFocus
        ref={inputRef}
        value={currentRefinement}
        onChangeText={(value) => refine(value)}
        placeholder={t(`community.chat.search`)}
        style={{
          marginLeft: RFValue(10),
          marginRight: RFValue(10),
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
    </Fragment>
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), []);

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        onClose={closeSearchModal}
        modalStyle={{ height: DEVICE_FULL_HEIGHT / 2, paddingTop: RFValue(30) }}
        HeaderComponent={
          <InstantSearch
            searchClient={searchClient}
            indexName={indexName}
            searchState={state.search}
            onSearchStateChange={onSearchStateChange}
          >
            <Configure filters={filters} hitsPerPage={8} distinct />
            <AlgoliaSearchBox />

            {React.cloneElement(children, { closeModal })}
          </InstantSearch>
        }
      >
        <StatusBar translucent animated style="light" />
        <Container
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        ></Container>
      </Modalize>
    </Portal>
  );
}

export default React.memo(SearchModal);
