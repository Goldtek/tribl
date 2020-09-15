import React from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import MemberCard from './widget/member';
import AlgoliaSearch from '../../../../../components/algoliaSearch';
import AlgoliaList from '../../../../../components/algoliaCommunityMembersList';
import { GET_COMMUNITY_MEMBERS } from '../../../../../graphql/server/query';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberSlideProp extends NavigationInterface {
  route: { communityDetails: { id: string } };
}

export default function MemberSlide(props: MemberSlideProp) {
  const { communityDetails } = props.route;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { data } = useQuery(GET_COMMUNITY_MEMBERS, {
    variables: { id: communityDetails.id }
  });

  const participants = data?.communityMembers || [];

  const _renderItem = ({ item }: any) => <MemberCard key={item.id} {...item} />;

  return (
    <Container>
      <AlgoliaSearch
        indexName="tribl_community_members_staging"
        filters={`"communityId": ${communityDetails.id}`}
      >
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
