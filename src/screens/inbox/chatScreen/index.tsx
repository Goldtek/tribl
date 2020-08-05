import React, { useState } from 'react';
import { NavigationInterface } from '../../types';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../theme';
import { Searchbar } from 'react-native-paper';
import TabSlide from './widgets/tabs';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, Cover } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const onChangeSearch = (query: string) => setSearch(query);

  return (
    <Container>
      <Cover>
        <Searchbar
          placeholder={t(`community.chat.search`)}
          onChangeText={onChangeSearch}
          value={search}
          style={{
            marginLeft: RFValue(10),
            marginRight: RFValue(10),
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.LARGE_SIZE),
            color: colors.SECONDARY_TEXT,
            elevation: 0,
            borderColor: colors.INACTIVE,
            borderRadius: 4,
            borderWidth: 1
          }}
          iconColor={colors.PRIMARY_TEXT}
        />
      </Cover>
      <TabSlide />
    </Container>
  );
}
