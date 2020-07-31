import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Title, Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import MemberCard from './widget/member';
import MembersData from '../../../../../libs/members/index.json';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberSlideProp extends NavigationInterface {}

export default function MemberSlide(props: MemberSlideProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const onChangeSearch = (query: string) => setSearch(query);

  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
  );

  return (
    <Container>
      <Searchbar
        placeholder={t(`community.tabPanel.search`)}
        onChangeText={onChangeSearch}
        value={search}
        style={{
          marginLeft: RFValue(15),
          marginRight: RFValue(15),
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
      <Title
        style={{
          color: colors.PRIMARY_TEXT,
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          marginTop: RFValue(20),
          marginBottom: RFValue(10),
          marginLeft: RFValue(10),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.tabPanel.memberTitle`)}
      </Title>

      <FlatList
        data={MembersData}
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: RFValue(20),
          paddingBottom: RFValue(120)
        }}
        showsVerticalScrollIndicator={false}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
