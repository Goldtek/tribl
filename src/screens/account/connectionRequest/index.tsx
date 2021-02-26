import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, TouchableHighlight } from 'react-native';
import { NavigationInterface } from '../../types';
import { useThemeContext } from '../../../theme';
import Header from '../../../components/header';
import ConnectionRequest from './widget';
import { StatusBar } from 'expo-status-bar';
import { GET_SIDE_MENU } from '../../../graphql/cache/query';
import { GET_CONNECTION_REQUEST } from '../../../graphql/server/query';
import hexToRGB from '../../../utils/hexToRGB';
import Skeleton from './widget/connectionRequestSkeleton';
import { PassportInterface } from '../../../graphql/types';
import {
  CHANGE_CONNECTION_NOTIFICATION_BADGE,
  TOGGLE_SIDE_MENU
} from '../../../graphql/cache/mutations';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import {
  ConnectionRequestsInterface,
  ShowSideMenu
} from '../../../graphql/types';
import { PAGINATION_DEFAULT } from '../../../constants';
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, MenuBadgeWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface ConnectionRequestScreenProp extends NavigationInterface {}

export default function ConnectionRequestScreen(
  props: ConnectionRequestScreenProp
) {
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data, refetch, fetchMore } = useQuery<ConnectionRequestsInterface>(
    GET_CONNECTION_REQUEST,
    { variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } } }
  );

  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const [refreshing, setRefreshing] = useState(false);
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);

  const toggleMenu = () => {
    toggleSideMenu({ variables: { showSideMenu: !drawerData?.showSideMenu } });
  };

  useEffect(() => {
    tagScreenName('ConnectionRequestScreen');
  }, []);

  const connectionRequests = data?.connectionRequests;

  const filterConnectionRequests = removeDuplicateMembers(
    connectionRequests?.data?.slice()
  );

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

  const handleEndReach = () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: {
          skip: filterConnectionRequests?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          connectionRequests: {
            ...prev.connectionRequests,
            data: [
              ...prev.connectionRequests.data,
              ...fetchMoreResult.connectionRequests.data
            ]
          }
        });
      }
    });
  };

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <ConnectionRequest key={item.id} item={item} refetch={refetch} />
  );

  useFocusEffect(
    useCallback(() => {
      filterConnectionRequests?.length
        ? changeConnectionNotification({
            variables: { showConnectionNotificationBadge: true }
          })
        : changeConnectionNotification({
            variables: { showConnectionNotificationBadge: false }
          }).then(refetch);
    }, [filterConnectionRequests?.length])
  );

  return (
    <Fragment>
      <StatusBar translucent animated style="dark" />
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
            {t(`community.sideNav.request`)}
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
              {filterConnectionRequests?.length ? <MenuBadgeWrapper /> : null}
            </Fragment>
          </TouchableHighlight>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        {filterConnectionRequests?.length ? (
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
            {t(`community.sideNav.request`)}
          </Title>
        ) : null}

        {filterConnectionRequests ? (
          <FlatList
            refreshing={refreshing}
            data={filterConnectionRequests}
            onRefresh={handleRefresh}
            ListFooterComponent={_renderFooter}
            contentContainerStyle={{
              flexGrow: 1,
              marginTop: RFValue(10),
              paddingBottom: RFValue(120)
            }}
            renderItem={_renderItem}
            ListEmptyComponent={
              <Text
                style={{
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  margin: RFValue(20),
                  textAlign: 'center'
                }}
              >
                You don't have any connection request.
              </Text>
            }
            onEndReachedThreshold={0.5}
            onMomentumScrollEnd={handleEndReach}
            onEndReached={() => {
              if (
                connectionRequests &&
                connectionRequests?.metadata.totalCount >
                  filterConnectionRequests.length
              ) {
                setCallOnScrollEnd(true);
              }
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Skeleton />
        )}
      </Container>
    </Fragment>
  );
}
