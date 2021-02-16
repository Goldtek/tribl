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
    { variables: { input: { limit: PAGINATION_DEFAULT * 2, skip: 0 } } }
  );
  const [changeConnectionNotification] = useMutation(
    CHANGE_CONNECTION_NOTIFICATION_BADGE
  );

  const [state, setState] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);

  const toggleMenu = () => {
    toggleSideMenu({ variables: { showSideMenu: !drawerData?.showSideMenu } });
  };

  useEffect(() => {
    tagScreenName('ConnectionRequestScreen');
  }, []);

  const connectionRequest = data?.connectionRequests?.data;

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

  // const handleEndReach = () => {
  //   if (!state.callOnScrollEnd) return;

  //   fetchMore({
  //     variables: { offset: data?.connectionRequests?.data?.length },
  //     updateQuery: (prev, { fetchMoreResult }) => {
  //       setState({ ...state, callOnScrollEnd: false });

  //       if (!fetchMoreResult) return prev;

  //       return Object.assign({}, prev, {
  //         myConnections: [...fetchMoreResult.connectionRequests]
  //       });
  //     }
  //   });
  // };

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <ConnectionRequest key={item.id} item={item} refetch={refetch} />
  );

  useFocusEffect(
    useCallback(() => {
      data?.connectionRequests?.data?.length
        ? changeConnectionNotification({
            variables: { showConnectionNotificationBadge: true }
          })
        : changeConnectionNotification({
            variables: { showConnectionNotificationBadge: false }
          }).then(refetch);
    }, [data?.connectionRequests?.data?.length])
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
              {data?.connectionRequests?.data?.length ? (
                <MenuBadgeWrapper />
              ) : null}
            </Fragment>
          </TouchableHighlight>
        )}
        style={{ paddingTop: top }}
      />
      <Container>
        {connectionRequest?.length ? (
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

        {connectionRequest ? (
          <FlatList
            data={connectionRequest}
            refreshing={state.refreshing}
            onRefresh={onRefresh}
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
            // onEndReachedThreshold={0.5}
            // onEndReached={() => setState({ ...state, callOnScrollEnd: true })}
            // onMomentumScrollEnd={handleEndReach}
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
