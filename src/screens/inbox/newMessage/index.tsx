import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Divider,
  Button,
  Text,
  TouchableRipple,
  ActivityIndicator
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import MemberCard from './widgets/connectionCard';
import hexToRGB from '../../../utils/hexToRGB';
import {
  GET_NEARBY_MEMBERS,
  GET_MY_CONNECTIONS,
  GET_ALL_MEMBERS,
  GET_MY_CONNECTIONS_NEARBY,
} from '../../../graphql/server/query';
import Skeleton from './widgets/newMessageSkeleton';
import ENVIRONMENT_VARIABLES from '../../../config';
import {
  MyConnectionNearbyRequestInterface,
  NearbyMembersRequestInterface,
  AllMembersRequestInterface,
  MyConnectionsInterface,
  PassportInterface
} from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';
import { fireAuth } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  FilterContainer,
  HeaderContainer,
  SearchInput
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { navigation } = props;
  const userId = fireAuth.currentUser?.uid;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('NewMessageScreen');
  }, []);

  const [pagination, setPagination] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });

  const [refreshing, setRefreshing] = useState(false);
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const [state, setState] = useState({
    all: true,
    connections: false,
    nearby: false
  });

  const [listData, setListData] = useState<PassportInterface[]>([]);

  const { data: myConnectionNearbyData } = useQuery<
    MyConnectionNearbyRequestInterface
  >(GET_MY_CONNECTIONS_NEARBY, {
    variables: { input: { filter: { id: userId }, skip: 0 } }
  });

  const { data: nearbyData } = useQuery<NearbyMembersRequestInterface>(
    GET_NEARBY_MEMBERS,
    { variables: { input: { skip: 0 } }}
  );

  const { data: connectionData } = useQuery<MyConnectionsInterface>(
    GET_MY_CONNECTIONS
  );

  const {
    data: allMembersData,
    loading: allMembersLoading,
    fetchMore: fetchMoreAllMembers
  } = useQuery<AllMembersRequestInterface>(GET_ALL_MEMBERS, {
    variables: { offset: 0, first: PAGINATION_DEFAULT }
  });

  const allMembers = allMembersData?.Passport?.data;
  const nearbyMembers = nearbyData?.nearbyMembers?.data;
  const myConnection = connectionData?.myConnections?.data;
  const nearbyConnections = myConnectionNearbyData?.nearbyConnections?.data;

  // const sortName = (a: PassportInterface, b: PassportInterface) => {
  //   if (a.firstName < b.firstName) return -1;
  //   if (a.firstName > b.firstName) return 1;
  //   return 0;
  // };

  const removeDuplicateMembers = (members?: PassportInterface[]) => {
    if (!members) return;

    const uniqueMembers: PassportInterface[] = [];
    const hashMap: { [key: string]: string } = {};
    let index = 0;

    for (index; index < members.length; index++) {
      const member = members[index];
      if (!hashMap[member.id]) {
        hashMap[member.id] = member.id;
        if (member.id !== userId && member.verified) {
          uniqueMembers.push(member);
        }
      }
    }

    return uniqueMembers;
  };

  const filterAll = removeDuplicateMembers(allMembers?.slice());

  const filterNearby = removeDuplicateMembers(nearbyMembers?.slice());

  const filterConnection = removeDuplicateMembers(myConnection?.slice());

  const filterConnectionsNearby = removeDuplicateMembers(
    nearbyConnections?.slice()
  );

  const handleOptionClick = (type: string) => () => {
    const { all, connections, nearby } = state;

    if (type === 'all' && all && !connections && !nearby) return;

    if (type === 'connections' && connections && !all && !nearby) return;

    if (type === 'nearby' && nearby && !all && !connections) return;

    let option = {};

    if (state.all && (type === 'connections' || 'nearby')) {
      //@ts-ignore
      option = { ...option, ...state, all: false, [type]: !state[type] };
    } else {
      //@ts-ignore
      option = { ...option, ...state, [type]: !state[type] };
    }

    if (type === 'all') {
      option = {
        ...option,
        ...state,
        nearby: false,
        connections: false,
        [type]: !state[type]
      };
    }

    setState({ ...state, ...option });
  };

  useEffect(() => {
    switch (true) {
      case state.all:
        setListData(filterAll ? filterAll : []);
        break;
      case state.connections && state.nearby:
        setListData(filterConnectionsNearby ? filterConnectionsNearby : []);
        break;
      case state.connections:
        setListData(filterConnection ? filterConnection : []);
        break;
      case state.nearby:
        setListData(filterNearby ? filterNearby : []);
        break;
      default:
        break;
    }
  }, [state, allMembersLoading, allMembersData?.Passport]);

  const handleEndReach = () => {
    if (!callOnScrollEnd) return;

    fetchMoreAllMembers({
      variables: {
        offset: filterAll?.length,
        first: PAGINATION_DEFAULT
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          Passport: [...prev.Passport.data, ...fetchMoreResult.Passport.data]
        });
      }
    });
  };

  const handleRefresh = () => {};

  const showSearchScreen = () => {
    navigation.navigate('CommunityAlgoliaScreen', {
      indexName: ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME
    });
    return true;
  };

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <MemberCard key={item.id} {...item} />
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
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
        </HeaderContainer>
        <FilterContainer>
          <ScrollView
            horizontal
            contentContainerStyle={{
              height: RFValue(45),
              paddingHorizontal: RFValue(15)
            }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Button
              mode="contained"
              onPress={handleOptionClick('all')}
              labelStyle={{
                color: state.all ? colors.WHITE : colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                textTransform: 'capitalize'
              }}
              contentStyle={{ height: '100%' }}
              style={{
                borderRadius: 4,
                marginRight: 15,
                marginBottom: 5,
                borderWidth: 1,
                borderColor: state.all ? colors.PRIMARY : colors.DISABLED,
                backgroundColor: state.all ? colors.PRIMARY : colors.WHITE
              }}
            >
              {t(`community.chat.all`)}
            </Button>

            <Button
              mode="contained"
              onPress={handleOptionClick('connections')}
              labelStyle={{
                color: state.connections ? colors.WHITE : colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                textTransform: 'capitalize'
              }}
              contentStyle={{ height: '100%' }}
              style={{
                borderRadius: 4,
                marginRight: 15,
                marginBottom: 5,
                borderWidth: 1,
                borderColor: state.connections
                  ? colors.PRIMARY
                  : colors.DISABLED,
                backgroundColor: state.connections
                  ? colors.PRIMARY
                  : colors.WHITE
              }}
            >
              {t(`community.chat.connection`)}
            </Button>
            <Button
              mode="contained"
              onPress={handleOptionClick('nearby')}
              labelStyle={{
                color: state.nearby ? colors.WHITE : colors.PRIMARY_TEXT,
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                textTransform: 'capitalize'
              }}
              contentStyle={{ height: '100%' }}
              style={{
                borderRadius: 4,
                marginBottom: 5,
                borderWidth: 1,
                borderColor: state.nearby ? colors.PRIMARY : colors.DISABLED,
                backgroundColor: state.nearby ? colors.PRIMARY : colors.WHITE
              }}
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

        {!allMembersLoading ? (
          <FlatList
            ref={hideSensitiveView}
            data={listData}
            bounces={false}
            refreshing={refreshing}
            renderItem={_renderItem}
            onRefresh={handleRefresh}
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
            ListEmptyComponent={
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
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 20,
              paddingVertical: RFValue(20)
            }}
            onEndReachedThreshold={1}
            // ListFooterComponent={_renderFooter}
            onMomentumScrollEnd={handleEndReach}
            onEndReached={() => setCallOnScrollEnd(true)}
          />
        ) : (
          <Skeleton />
        )}
      </Container>
    </SafeAreaView>
  );
}
