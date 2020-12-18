import React, { useCallback } from 'react';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ViewStyle } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import { Container, SearchInput } from './style';
import { useNavigation } from '@react-navigation/native';

interface SearchInterface {
  style?: ViewStyle;
  indexName: string;
  filters?: any;
}

function AlgoliaSearch(props: SearchInterface) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const showSearchScreen = useCallback(() => {
    navigation.navigate('CommunityAlgoliaScreen', {
      indexName: props.indexName,
      filters: props.filters
    });
    return true;
  }, [props.indexName]);

  return (
    <Container style={props.style}>
      <SearchInput onStartShouldSetResponder={showSearchScreen}>
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
    </Container>
  );
}

export default React.memo(AlgoliaSearch);
