import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import MemberCard from './widget/member';
import { NavigationInterface } from '../../../../types';
import AlgoliaSearch from '../../../../../components/algoliaSearch';
import AlgoliaList from '../../../../../components/algoliaCommunityMembersList';
import {
  GET_COMMUNITY_MEMBERS,
  GET_USER_PASSPORT
} from '../../../../../graphql/server/query';
import {
  CommunityInterface,
  PassportInterface
} from '../../../../../graphql/types';
import ENVIRONMENT_VARIABLES from '../../../../../config';
import { CommunityMembersRequestInterface } from '../../../../../graphql/types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';
import { tagScreenName } from '../../../../../utils/uxcamHelper';

// DEFINE SCREEN PROP TYPES
interface MemberSlideProp extends NavigationInterface {
  route: { communityDetails: CommunityInterface };
}

export default function MemberSlide(props: MemberSlideProp) {
  const { communityDetails } = props.route;

  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('TribeMembersScreen');
  }, []);

  const { data } = useQuery<CommunityMembersRequestInterface>(
    GET_COMMUNITY_MEMBERS,
    {
      variables: { id: communityDetails.id },
      fetchPolicy: 'cache-and-network',
      pollInterval: 500
    }
  );

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userId = userDetails?.id;

  const participants = data?.communityMembers;

  const filteredParticipants = participants?.filter((member) => {
    return member.id !== userId;
  });

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <MemberCard key={item.id} {...item} />
  );

  return (
    <Container>
      <AlgoliaSearch
        indexName={ENVIRONMENT_VARIABLES.ALGOLIA_COMMUNITY_MEMBERS_INDEX_NAME}
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
        data={filteredParticipants}
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
