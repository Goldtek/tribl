import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Feather } from '@expo/vector-icons';
import { StatusBar, FlatList, TouchableHighlight } from 'react-native';
import { NavigationInterface } from '../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../theme';
import Header from '../../../components/header';
import Connection from './widget';
import {
  GET_MY_CONNECTIONS,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import { TOGGLE_SIDE_MENU } from '../../../graphql/cache/mutations';
import hexToRGB from '../../../utils/hexToRGB';
import Skeleton from './widget/myConnectionSkeleton';
import {
  MyConnectionsInterface,
  PassportInterface,
  ShowConnectionNotificationBadge,
  ShowSideMenu
} from '../../../graphql/types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import { useIsFocused } from '@react-navigation/core';
import {
  GET_CONNECTION_NOTIFICATION_BADGE,
  GET_SIDE_MENU
} from '../../../graphql/cache/query';
import { PAGINATION_DEFAULT } from '../../../constants';
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, MenuBadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('MyConnectionScreen');
  }, []);

  const { data, refetch, fetchMore } = useQuery<MyConnectionsInterface>(
    GET_MY_CONNECTIONS,
    { variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } } }
  );

  const { data: userData } = useQuery(GET_USER_PASSPORT);

  const { data: notificationData } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const [search, setSearch] = useState({ searchTerm: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const myConnection = data?.myConnections;

  const filterConnections = removeDuplicateMembers(myConnection?.data?.slice());

  const userDetails = userData?.myPassport;
  const blockedUsers = userDetails?.privacy?.blocked;

  const filteredUsers = filterConnections?.filter(function (users) {
    return !blockedUsers?.some(function (userTwo: any) {
      return users.id == userTwo.id;
    });
  });

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const handleEndReach = async () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: { skip: filteredUsers?.length, limit: PAGINATION_DEFAULT }
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
  };

  useEffect(() => {
    isFocused && handleRefresh();
  }, [isFocused]);

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const keysToFilter = ['firstName', 'lastName'];

  const filteredWords =
    filteredUsers &&
    filteredUsers?.filter(createFilter(search.searchTerm, keysToFilter));

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <Connection key={item.id} {...item} />
  );

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);

  const toggleMenu = () => {
    toggleSideMenu({ variables: { showSideMenu: !drawerData?.showSideMenu } });
  };

  return (
    <Fragment>
      <StatusBar translucent barStyle="dark-content" />
      <Header
        title={() => (
          <Text
            style={{
              color: colors.PRIMARY_TEXT,
              fontSize: RFValue(fonts.LARGE_SIZE),
              fontFamily: fonts.WORK_SANS_BOLD,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.sideNav.connection`)}
          </Text>
        )}
        headerLeft={() => (
          <TouchableHighlight
            {...props}
            onPress={() => {
              toggleMenu();
              logEvent('open drawer', { from: 'community' });
            }}
            underlayColor={hexToRGB(colors.PRIMARY, 0.1)}
            style={{
              height: RFValue(40),
              width: RFValue(40),
              borderRadius: RFValue(20),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Fragment>
              <Feather
                name="menu"
                size={RFValue(25)}
                color={colors.PRIMARY_TEXT}
              />
              {notificationData?.showConnectionNotificationBadge ? (
                <MenuBadgeWrapper />
              ) : null}
            </Fragment>
          </TouchableHighlight>
        )}
        style={{ paddingTop: top }}
      />

      <Container>
        <SearchInput
          onChangeText={searchUpdated}
          placeholder="Search"
          placeholderTextColor={colors.PRIMARY_TEXT}
          style={{
            height: RFValue(40),
            color: colors.PRIMARY_TEXT,
            alignItems: 'center',
            elevation: 0,
            borderWidth: 1,
            borderColor: colors.INACTIVE,
            borderRadius: 4,
            paddingHorizontal: 10,
            marginHorizontal: 15
          }}
        />

        {filteredUsers ? (
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
            {t(`community.sideNav.connection`)}
          </Title>
        ) : null}

        {filteredUsers ? (
          <FlatList
            data={filteredWords}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={_renderFooter}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (
                myConnection &&
                myConnection?.metadata.totalCount > filteredUsers.length
              ) {
                setCallOnScrollEnd(true);
              }
            }}
            onMomentumScrollEnd={handleEndReach}
            contentContainerStyle={{
              flexGrow: 1,
              marginTop: RFValue(10),
              paddingBottom: RFValue(60)
            }}
            ListEmptyComponent={
              <Text
                style={{
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  margin: RFValue(20),
                  textAlign: 'center'
                }}
              >
                You currently don't have any connection
              </Text>
            }
            showsVerticalScrollIndicator={false}
            renderItem={_renderItem}
            keyExtractor={({ id }) => id}
          />
        ) : (
          <Skeleton />
        )}
      </Container>
    </Fragment>
  );
}
