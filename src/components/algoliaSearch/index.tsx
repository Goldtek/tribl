import React, { useState, useCallback, ReactNode } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { View, ViewStyle } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import SearchModal from '../searchModal';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../theme';

import { Container, SearchInput } from './style';

interface SearchInterface {
  style?: ViewStyle;
  indexName: string;
  filters?: any;
  children: React.ReactElement<ReactNode>;
}

function AlgoliaSearch(props: SearchInterface) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState(false);

  const showSearchModal = useCallback(
    (isVisible: boolean) => () => {
      setIsVisible(isVisible);
      return true;
    },
    []
  );

  return (
    <Container style={props.style}>
      <SearchInput onStartShouldSetResponder={showSearchModal(true)}>
        <Octicons name="search" color={colors.PRIMARY_TEXT} size={20} />
        <Text
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE),
            color: colors.PRIMARY_TEXT,
            paddingHorizontal: RFValue(18)
          }}
        >
          {t(`community.chat.search`)}
        </Text>
      </SearchInput>
      <SearchModal
        isVisible={isVisible}
        indexName={props.indexName}
        closeSearchModal={showSearchModal(false)}
        filters={props.filters}
      >
        {props.children}
      </SearchModal>
    </Container>
  );
}

export default React.memo(AlgoliaSearch);
