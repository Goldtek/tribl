import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Divider,
  Text,
  TouchableRipple,
  ActivityIndicator,
  Title
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, Octicons, FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import MemberCard from '../../../components/connectionCard';
import hexToRGB from '../../../utils/hexToRGB';
import {
  GET_NEARBY_MEMBERS,
  GET_MY_CONNECTIONS,
  GET_ALL_MEMBERS,
  GET_MY_CONNECTIONS_NEARBY
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
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  FilterContainer,
  HeaderContainer,
  NameContainer,
  SearchInput,
  IconContainer,
  HeaderTitle,
  SearchInputContainer,
  HeaderAction
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

  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const [state, setState] = useState({
    all: true,
    connections: false,
    nearby: false
  });

  const [listData, setListData] = useState<PassportInterface[]>([]);

  const {
    data: myConnectionNearbyData,
    fetchMore: fetchMoreMyConnectionNearbyData
  } = useQuery<MyConnectionNearbyRequestInterface>(GET_MY_CONNECTIONS_NEARBY, {
    variables: {
      input: { filter: { id: userId }, skip: 0, limit: PAGINATION_DEFAULT }
    }
  });

  const { data: nearbyData, fetchMore: fetchMoreNearbyData } = useQuery<
    NearbyMembersRequestInterface
  >(GET_NEARBY_MEMBERS, {
    variables: { input: { skip: 0, limit: PAGINATION_DEFAULT } }
  });

  const { data: connectionData, fetchMore: fetchMoreConnectionData } = useQuery<
    MyConnectionsInterface
  >(GET_MY_CONNECTIONS, {
    variables: { input: { skip: 0, limit: PAGINATION_DEFAULT } }
  });

  const {
    data: allMembersData,
    loading: allMembersLoading,
    fetchMore: fetchMoreAllMembers
  } = useQuery<AllMembersRequestInterface>(GET_ALL_MEMBERS, {
    variables: { input: { skip: 0, limit: PAGINATION_DEFAULT } }
  });

  const allMembers = allMembersData?.Passport;
  const nearbyMembers = nearbyData?.nearbyMembers;
  const myConnection = connectionData?.myConnections;
  const nearbyConnections = myConnectionNearbyData?.nearbyConnections;

  const filterAll = removeDuplicateMembers(allMembers?.data?.slice());

  const filterNearby = removeDuplicateMembers(nearbyMembers?.data?.slice());

  const filterConnection = removeDuplicateMembers(myConnection?.data?.slice());

  const filterConnectionsNearby = removeDuplicateMembers(
    nearbyConnections?.data?.slice()
  );

  const handleMessageNavigation = () => {
    navigation.navigate('InboxScreen', {
      screen: 'GroupMessage',
      params: {}
    });
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

    switch (true) {
      case state.connections && state.nearby:
        fetchMoreMyConnectionNearbyData({
          variables: {
            input: {
              skip: filterConnectionsNearby?.length,
              limit: PAGINATION_DEFAULT
            }
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            setCallOnScrollEnd(false);

            if (!fetchMoreResult) return prev;

            return Object.assign({}, prev, {
              nearbyConnections: {
                ...prev.nearbyConnections,
                data: [
                  ...prev.nearbyConnections.data,
                  ...fetchMoreResult.nearbyConnections.data
                ]
              }
            });
          }
        });
        break;

      case state.all:
        fetchMoreAllMembers({
          variables: {
            input: { skip: filterAll?.length, limit: PAGINATION_DEFAULT }
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            setCallOnScrollEnd(false);

            if (!fetchMoreResult) return prev;

            return Object.assign({}, prev, {
              Passport: {
                ...prev.Passport,
                data: [...prev.Passport.data, ...fetchMoreResult.Passport.data]
              }
            });
          }
        });
        break;

      case state.connections:
        fetchMoreConnectionData({
          variables: {
            input: { skip: filterConnection?.length, limit: PAGINATION_DEFAULT }
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            setCallOnScrollEnd(false);

            if (!fetchMoreResult) return prev;

            return Object.assign({}, prev, {
              myConnections: {
                ...prev.myConnections,
                data: [
                  ...prev.myConnections.data,
                  ...fetchMoreResult.myConnections.data
                ]
              }
            });
          }
        });
        break;

      case state.nearby:
        fetchMoreNearbyData({
          variables: {
            input: { skip: filterNearby?.length, limit: PAGINATION_DEFAULT }
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            setCallOnScrollEnd(false);

            if (!fetchMoreResult) return prev;

            return Object.assign({}, prev, {
              nearbyMembers: {
                ...prev.nearbyMembers,
                data: [
                  ...prev.nearbyMembers.data,
                  ...fetchMoreResult.nearbyMembers.data
                ]
              }
            });
          }
        });
        break;

      default:
        break;
    }
  };

  const onEndReachedScroll = () => {
    switch (true) {
      case state.connections &&
        state.nearby &&
        nearbyConnections &&
        nearbyConnections?.metadata.totalCount > listData.length:
        setCallOnScrollEnd(true);
        break;

      case state.all &&
        allMembers &&
        allMembers?.metadata.totalCount > listData.length:
        setCallOnScrollEnd(true);
        break;

      case state.nearby &&
        nearbyMembers &&
        nearbyMembers?.metadata.totalCount > listData.length:
        setCallOnScrollEnd(true);
        break;

      case state.connections &&
        myConnection &&
        myConnection?.metadata.totalCount > listData.length:
        setCallOnScrollEnd(true);
        break;

      default:
        break;
    }
  };

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
          <HeaderTitle>New Chat</HeaderTitle>
          <HeaderAction></HeaderAction>
        </HeaderContainer>

        <FilterContainer>
          <SearchInputContainer>
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
          </SearchInputContainer>
          <TouchableRipple
            ref={hideSensitiveView}
            style={{
              height: RFValue(80),
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: RFValue(20)
            }}
            rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
            onPress={handleMessageNavigation}
          >
            <Fragment>
              <IconContainer>
                <FontAwesome name="users" size={30} color={colors.PRIMARY} />
              </IconContainer>

              <NameContainer ref={hideSensitiveView}>
                <Title
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    textTransform: 'capitalize'
                  }}
                >
                  New Group
                </Title>
              </NameContainer>
            </Fragment>
          </TouchableRipple>
        </FilterContainer>

        {!allMembersLoading ? (
          <FlatList
            ref={hideSensitiveView}
            data={listData}
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
            ListFooterComponent={_renderFooter}
            onMomentumScrollEnd={handleEndReach}
            onEndReached={onEndReachedScroll}
          />
        ) : (
          <Skeleton />
        )}
      </Container>
    </SafeAreaView>
  );
}
