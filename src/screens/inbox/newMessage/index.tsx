import React, { useMemo, useState } from 'react';
import { SafeAreaView, TouchableHighlight } from 'react-native';
import { FlatList } from 'react-native';
import { Divider, Button, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import MemberCard from './widgets/connectionCard';
import AlgoliaSearch from '../../../components/algoliaSearch';
import AlgoliaList from '../../../components/algoliaInboxList';
import hexToRGB from '../../../utils/hexToRGB';
import {
  GET_NEARBY_MEMBERS,
  GET_MY_CONNECTIONS,
  GET_ALL_MEMBERS
} from '../../../graphql/server/query';
import Skeleton from './widgets/newMessageSkeleton';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';
import { MyPassportInterface } from '../../../graphql/types';
import ENVIRONMENT_VARIABLES from '../../../config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, FilterContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {
  selectedName: string;
  selected: boolean;
}

export default function ChatScreen(props: ScreenProp) {
  const { selected, selectedName } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { loading: nearbyLoading, data: nearbyData } = useQuery(
    GET_NEARBY_MEMBERS
  );

  const { loading: connectionLoading, data: connectionData } = useQuery(
    GET_MY_CONNECTIONS
  );

  const { loading: allMembersLoading, data: allMembersData } = useQuery(
    GET_ALL_MEMBERS
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const nearbyMembers = nearbyData?.nearbyMembers;
  const myConnection = connectionData?.myConnections;
  const allMembers = allMembersData?.Passport;
  const userDetails = userData?.myPassport?.id;

  const filteredMembers = allMembers?.filter((member: any) => {
    return member.id !== userDetails && member.verified == true;
  });

  const [filter, setFilter] = useState(t(`community.chat.all`) as string);
  const [state, setState] = useState({
    all: true,
    connections: false,
    nearby: false
  });

  const { all, connections, nearby } = state;

  const filterAll = filteredMembers?.slice().sort(function (a: any, b: any) {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

    return 0;
  });

  const filterConncetion = myConnection
    ?.slice()
    .sort(function (a: any, b: any) {
      if (a.firstName < b.firstName) return -1;

      if (a.firstName > b.firstName) return 1;

      return 0;
    });

  const filterNearby = nearbyMembers?.slice().sort(function (a: any, b: any) {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

    return 0;
  });

  const data = all
    ? filterAll
    : connections && nearby
    ? filterConncetion && filterNearby
    : connections
    ? filterConncetion
    : filterNearby;

  const handleConnectionClick = () => {
    setState({
      ...state,
      connections: !connections,
      all: false
    });
  };

  const handleNearbyClick = () => {
    setState({
      ...state,
      nearby: !nearby,
      all: false
    });
  };

  const handleAllMembersClick = () => {
    setState({
      ...state,
      all: !all,
      nearby: false,
      connections: false
    });
  };

  const _separator = () =>
    useMemo(
      () => (
        <Divider
          style={{
            height: 1.5,
            backgroundColor: hexToRGB(colors.INACTIVE, 0.5),
            marginHorizontal: RFValue(20)
          }}
        />
      ),
      []
    );

  const _renderItem = ({ item }: any) => <MemberCard key={item.id} {...item} />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginTop: RFValue(5),
        backgroundColor: colors.WHITE
      }}
    >
      <Container>
        <AlgoliaSearch
          indexName={ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME}
        >
          <AlgoliaList />
        </AlgoliaSearch>
        <FilterContainer>
          <Button
            mode="contained"
            onPress={handleAllMembersClick}
            labelStyle={{
              color: all ? colors.WHITE : colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              textTransform: 'capitalize'
            }}
            contentStyle={{
              paddingVertical: 7,
              paddingHorizontal: 5,
              backgroundColor: all ? colors.PRIMARY : colors.WHITE
            }}
            style={{ borderRadius: 4 }}
          >
            {t(`community.chat.all`)}
          </Button>

          <Button
            mode="contained"
            onPress={handleConnectionClick}
            labelStyle={{
              color: connections ? colors.WHITE : colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              textTransform: 'capitalize'
            }}
            contentStyle={{
              paddingVertical: 7,
              paddingHorizontal: 5,
              backgroundColor: connections ? colors.PRIMARY : colors.WHITE
            }}
            style={{ borderRadius: 4, marginLeft: 15 }}
          >
            {t(`community.chat.connection`)}
          </Button>
          <Button
            mode="contained"
            onPress={handleNearbyClick}
            labelStyle={{
              color: nearby ? colors.WHITE : colors.PRIMARY_TEXT,
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              textTransform: 'capitalize'
            }}
            contentStyle={{
              paddingVertical: 7,
              paddingHorizontal: 5,
              backgroundColor: nearby ? colors.PRIMARY : colors.WHITE
            }}
            style={{
              marginHorizontal: 15,
              borderRadius: 4
            }}
          >
            {t(`community.chat.nearby`)}
          </Button>
        </FilterContainer>

        {/* <TouchableRipple
          style={{
            backgroundColor: colors.WHITE,
            paddingHorizontal: RFValue(20),
            paddingBottom: RFValue(5)
          }}
          rippleColor={hexToRGB(colors.PRIMARY, 0.3)}
          onPress={() => {}}
        >
          <Fragment>
            <GroupContainer>
              <GroupWrapper>
                <FontAwesome name="group" size={30} color={colors.PRIMARY} />
              </GroupWrapper>
              <Text
                style={{
                  color: colors.PRIMARY_TEXT,
                  fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  paddingLeft: RFValue(15),
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.chat.new`)}
              </Text>
            </GroupContainer>
            <Divider />
          </Fragment>
        </TouchableRipple> */}
        {allMembersLoading || connectionLoading || nearbyLoading ? (
          <Skeleton />
        ) : data?.length ? (
          <FlatList
            data={data}
            bounces={false}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={_separator}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            style={{ backgroundColor: colors.WHITE, paddingTop: 10 }}
          />
        ) : (
          <Text
            style={{
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              margin: RFValue(20),
              textAlign: 'center'
            }}
          >
            There are no members at this time
          </Text>
        )}
      </Container>
    </SafeAreaView>
  );
}
