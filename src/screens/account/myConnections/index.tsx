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
import { GET_MY_CONNECTIONS } from '../../../graphql/server/query';
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
import {
  GET_CONNECTION_NOTIFICATION_BADGE,
  GET_SIDE_MENU
} from '../../../graphql/cache/query';
import { PAGINATION_DEFAULT } from '../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, MenuBadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface MyConnectionScreenProp extends NavigationInterface {}

export default function ProfileScreen(props: MyConnectionScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('MyConnectionScreen');
  }, []);

  const { data, refetch, fetchMore } = useQuery<MyConnectionsInterface>(
    GET_MY_CONNECTIONS,
    { variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } } }
  );

  const { data: notificationData } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const [search, setSearch] = useState({ searchTerm: '' });
  const [state, setState] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });

  const myConnection = data?.myConnections?.data;

  const filterConnections = myConnection?.slice().sort(function (a, b) {
    if (a.firstName < b.firstName) return -1;

    if (a.firstName > b.firstName) return 1;

    return 0;
  });

  const _renderFooter = useCallback(
    () => (state.callOnScrollEnd ? <ActivityIndicator /> : null),
    [state.callOnScrollEnd]
  );

  const onRefresh = async () => {
    try {
      setState({ ...state, refreshing: true });
      await refetch();
      setState({ ...state, refreshing: false });
    } catch (error) {
      setState({ ...state, refreshing: false });
    }
  };

  // const handleEndReach = async () => {
  //   if (!state.callOnScrollEnd) return;

  //   fetchMore({
  //     variables: {
  //       offset: data?.myConnections?.data?.length,
  //       first: PAGINATION_DEFAULT
  //     },
  //     updateQuery: (prev, { fetchMoreResult }) => {
  //       setState({ ...state, callOnScrollEnd: false });

  //       if (!fetchMoreResult) return prev;

  //       return Object.assign({}, prev, {
  //         myConnections: [...fetchMoreResult.myConnections]
  //       });
  //     }
  //   });
  // };

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = ['firstName', 'lastName'];

  const filteredWords =
    filterConnections &&
    filterConnections?.filter(createFilter(search.searchTerm, KeysToFilter));

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

        {myConnection?.length ? (
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

        {myConnection ? (
          <FlatList
            data={filteredWords}
            refreshing={state.refreshing}
            onRefresh={onRefresh}
            ListFooterComponent={_renderFooter}
            // onEndReachedThreshold={0.5}
            // onEndReached={() => setState({ ...state, callOnScrollEnd: true })}
            // onMomentumScrollEnd={handleEndReach}
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
