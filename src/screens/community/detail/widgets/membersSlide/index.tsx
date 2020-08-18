import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Title, Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import MemberCard from './widget/member';
import MembersData from '../../../../../libs/members/index.json';
import AlgoliaSearch from '../../../../../components/algoliaSearch';
import AlgoliaList from '../../../../../components/algoliaInboxList';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberSlideProp extends NavigationInterface {}

export default function MemberSlide(props: MemberSlideProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const detail = props.route;
  const { communityDetails } = detail;
  const { participants } = communityDetails;

  const _renderItem = ({ item }: any) => (
    <MemberCard key={item.id} {...item} {...props} />
  );

  return (
    <Container>
      <AlgoliaSearch indexName="tribl_community_develop">
        <AlgoliaList />
      </AlgoliaSearch>
      <Title
        style={{
          color: colors.PRIMARY_TEXT,
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          marginTop: RFValue(20),
          marginLeft: RFValue(10),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.tabPanel.memberTitle`)}
      </Title>

      <FlatList
        data={participants}
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: RFValue(10),
          paddingBottom: RFValue(120)
        }}
        showsVerticalScrollIndicator={false}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
