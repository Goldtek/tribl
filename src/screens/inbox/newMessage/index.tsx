import React from 'react';
import { SafeAreaView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import TabSlide from './widgets/tabs';
import AlgoliaSearch from '../../../components/algoliaSearch';
import Highlight from '../../../components/algoliaInboxCard';
import AlgoliaList from '../../../components/algoliaInboxList';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { colors } = useThemeContext();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: RFValue(5),
        backgroundColor: colors.WHITE
      }}
    >
      <Container>
        <AlgoliaSearch indexName="tribl_passport_staging">
          <AlgoliaList />
        </AlgoliaSearch>
        <TabSlide />
      </Container>
    </SafeAreaView>
  );
}
