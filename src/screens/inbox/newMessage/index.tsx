import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, Button, Text, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import MemberCard from './widgets/connectionCard';
import AlgoliaSearch from '../../../components/algoliaSearch';
import AlgoliaList from '../../../components/algoliaInboxList';
import hexToRGB from '../../../utils/hexToRGB';
import { Ionicons } from '@expo/vector-icons';
import {
  GET_NEARBY_MEMBERS,
  GET_MY_CONNECTIONS,
  GET_ALL_MEMBERS,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import Skeleton from './widgets/newMessageSkeleton';
import ENVIRONMENT_VARIABLES from '../../../config';
import {
  NearbyMembersRequestInterface,
  MyConnectionsInterface,
  AllMembersRequestInterface,
  PassportInterface
} from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, FilterContainer, HeaderContainer } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { loading: nearbyLoading, data: nearbyData } = useQuery<
    NearbyMembersRequestInterface
  >(GET_NEARBY_MEMBERS, {
    variables: { offset: 0, first: PAGINATION_DEFAULT }
  });

  const { loading: connectionLoading, data: connectionData } = useQuery<
    MyConnectionsInterface
  >(GET_MY_CONNECTIONS, {
    variables: { offset: 0, first: PAGINATION_DEFAULT }
  });

  const { loading: allMembersLoading, data: allMembersData } = useQuery<
    AllMembersRequestInterface
  >(GET_ALL_MEMBERS, {
    variables: { offset: 0, first: PAGINATION_DEFAULT }
  });

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;

  const nearbyMembers = nearbyData?.nearbyMembers;
  const myConnection = connectionData?.myConnections;
  const allMembers = allMembersData?.Passport;
  const userId = userDetails?.id;

  useEffect(() => {
    tagScreenName('NewMessageScreen');
  }, []);

  const filteredMembers = allMembers?.filter((member) => {
    return member.id !== userId && member.verified == true;
  });

  const [state, setState] = useState({
    all: true,
    connections: false,
    nearby: false
  });

  const { all, connections, nearby } = state;

  const sortName = (a: PassportInterface, b: PassportInterface) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    return 0;
  };

  const filterAll = filteredMembers?.slice().sort(sortName);
  const filterConnection = myConnection?.slice().sort(sortName);
  const filterNearby = nearbyMembers?.slice().sort(sortName);

  const data = all
    ? filterAll
    : connections && nearby
    ? filterConnection && filterNearby
    : connections
    ? filterConnection
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

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <MemberCard key={item.id} {...item} />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.WHITE }}>
      <Container>
        <HeaderContainer>
          <TouchableRipple
            onPress={navigation.goBack}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: RFValue(40 / 2)
            }}
          >
            <Ionicons
              name="md-arrow-back"
              size={RFValue(24)}
              color={colors.PRIMARY}
            />
          </TouchableRipple>
          <AlgoliaSearch
            style={{ width: 0, flexGrow: 1 }}
            indexName={ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME}
          >
            <AlgoliaList />
          </AlgoliaSearch>
        </HeaderContainer>
        <FilterContainer>
          <ScrollView
            horizontal
            contentContainerStyle={{
              height: RFValue(50),
              paddingHorizontal: RFValue(15)
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Button
              mode="contained"
              onPress={handleAllMembersClick}
              labelStyle={{
                color: all ? colors.WHITE : colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                textTransform: 'capitalize'
              }}
              contentStyle={{
                height: RFValue(45),
                backgroundColor: all ? colors.PRIMARY : colors.WHITE
              }}
              style={{ borderRadius: 4, height: RFValue(45), marginRight: 15 }}
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
                height: RFValue(45),
                backgroundColor: connections ? colors.PRIMARY : colors.WHITE
              }}
              style={{ borderRadius: 4, height: RFValue(45), marginRight: 15 }}
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
                height: RFValue(45),
                backgroundColor: nearby ? colors.PRIMARY : colors.WHITE
              }}
              style={{ borderRadius: 4, height: RFValue(45) }}
            >
              {t(`community.chat.nearby`)}
            </Button>
          </ScrollView>
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
            ref={hideSensitiveView}
            data={data}
            bounces={false}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <Divider
                style={{
                  height: 1.5,
                  backgroundColor: hexToRGB(colors.INACTIVE, 0.5),
                  marginHorizontal: RFValue(20)
                }}
              />
            )}
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
