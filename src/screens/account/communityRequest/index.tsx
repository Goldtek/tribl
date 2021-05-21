import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Fragment
} from 'react';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FlatList,
  TouchableOpacity,
  StatusBar,
  TouchableHighlight
} from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FontAwesome, Feather } from '@expo/vector-icons';
import {
  GET_TRIBE_INVITES,
  GET_COMMUNITY_CREATION_REQUEST,
  GET_USER_PASSPORT,
  GET_ALL_CHANNEL_CREATION_REQUEST
} from '../../../graphql/server/query';
import { PAGINATION_DEFAULT } from '../../../constants';
import {
  GET_SIDE_MENU,
  GET_CONNECTION_NOTIFICATION_BADGE
} from '../../../graphql/cache/query';
import {
  ShowSideMenu,
  ShowConnectionNotificationBadge,
  CommunityInviteInterface,
  CommunityCreationRequestInterface,
  AllChannelCreationRequestInterface,
  MyPassportInterface
} from '../../../graphql/types';
import {
  CHANGE_TRIBE_REQUEST_NOTIFICATION_BADGE,
  TOGGLE_SIDE_MENU
} from '../../../graphql/cache/mutations';
import { useThemeContext } from '../../../theme';
import { NavigationInterface } from '../../types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import hexToRGB from '../../../utils/hexToRGB';
import Header from '../../../components/header';
import TribeCreationRequestCard from './widget/tribeCreationRequest';
import TribeInviteCard from './widget/tribeInvite';
import ChannelCreationRequestCard from './widget/channelCreationRequest';
import GradientButton from '../../../components/gradientButton';
import Skeleton from './widget/tribeRequestSkeleton';

import { Container, ModalCover, MenuBadgeWrapper } from './styles';
import { useFocusEffect } from '@react-navigation/core';

// DEFINE SCREEN PROP TYPES
interface TribeRequestScreenProp extends NavigationInterface {}

export default function TribeRequestScreen(props: TribeRequestScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState('invite');
  const [refreshing, setRefreshing] = useState(false);
  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);
  const [requestRefreshing, setRequestRefreshing] = useState(false);
  const [channelRequestRefreshing, setChannelRequestRefreshing] = useState(
    false
  );
  const [requestCallOnScrollEnd, setRequestCallOnScrollEnd] = useState(false);
  const [
    channelRequestCallOnScrollEnd,
    setChannelRequestCallOnScrollEnd
  ] = useState(false);

  const { data: drawerData } = useQuery<ShowSideMenu>(GET_SIDE_MENU);

  const [toggleSideMenu] = useMutation(TOGGLE_SIDE_MENU);

  const [changeTribeRequestNotification] = useMutation(
    CHANGE_TRIBE_REQUEST_NOTIFICATION_BADGE
  );

  const toggleMenu = () => {
    toggleSideMenu({
      variables: { showSideMenu: !drawerData?.showSideMenu }
    });
  };

  const { data: notificationData } = useQuery<ShowConnectionNotificationBadge>(
    GET_CONNECTION_NOTIFICATION_BADGE
  );

  const showModal = () => {
    setModalVisible(!modalVisible);
  };

  const {
    data: inviteData,
    refetch: inviteRefetch,
    fetchMore: inviteFetchMore
  } = useQuery<CommunityInviteInterface>(GET_TRIBE_INVITES, {
    variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
  });

  const {
    data: requestData,
    refetch: requestRefetch,
    fetchMore: requestFetchMore
  } = useQuery<CommunityCreationRequestInterface>(
    GET_COMMUNITY_CREATION_REQUEST,
    {
      variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
    }
  );

  const {
    data: channelRequestData,
    refetch: channelRequestRefetch,
    fetchMore: channelRequestFetchMore
  } = useQuery<AllChannelCreationRequestInterface>(
    GET_ALL_CHANNEL_CREATION_REQUEST,
    {
      variables: { input: { limit: PAGINATION_DEFAULT / 2, skip: 0 } }
    }
  );

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const tribeInvites = inviteData?.communityInvites;
  const tribeRequest = requestData?.communityCreationRequests;
  const channelRequest = channelRequestData?.myChannelCreationRequests;

  const userDetails = userData?.myPassport;
  const blockedUsers = userDetails?.privacy?.blocked;
  const moderator = userDetails?.isAdmin;

  const filteredInvite = tribeInvites?.data?.filter(
    (users) => !blockedUsers?.some((userTwo) => users?.sender?.id == userTwo.id)
  );

  const filteredRequest = tribeRequest?.data;
  const filteredChannelRequest = channelRequest?.data;

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  useFocusEffect(
    useCallback(() => {
      if (
        tribeInvites?.data.length ||
        tribeRequest?.data.length ||
        channelRequest?.data.length
      ) {
        changeTribeRequestNotification({
          variables: { showTribeRequestNotificationBadge: true }
        }).then(() => {
          inviteRefetch();
          requestRefetch();
          channelRequestRefetch();
        });
      } else {
        changeTribeRequestNotification({
          variables: { showTribeRequestNotificationBadge: false }
        }).then(() => {
          inviteRefetch();
          requestRefetch();
          channelRequestRefetch();
        });
      }
    }, [
      tribeInvites?.data.length,
      tribeRequest?.data.length,
      channelRequest?.data.length
    ])
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await inviteRefetch();
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const handleChannelRequestRefresh = async () => {
    try {
      setChannelRequestRefreshing(true);
      await channelRequestRefetch();
      setChannelRequestRefreshing(false);
    } catch (error) {
      setChannelRequestRefreshing(false);
    }
  };

  const handleRequestRefresh = async () => {
    try {
      setRequestRefreshing(true);
      await requestRefetch();
      setRequestRefreshing(false);
    } catch (error) {
      setRequestRefreshing(false);
    }
  };

  const handleInviteEndReach = async () => {
    if (!callOnScrollEnd) return;

    inviteFetchMore({
      variables: {
        input: {
          skip: filteredInvite?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          communityInvites: {
            ...prev?.communityInvites,
            data: [
              ...prev?.communityInvites.data,
              ...fetchMoreResult?.communityInvites.data
            ]
          }
        });
      }
    });
  };

  const handleRequestEndReach = async () => {
    if (!requestCallOnScrollEnd) return;

    requestFetchMore({
      variables: {
        input: {
          skip: filteredRequest?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setRequestCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          communityCreationRequests: {
            ...prev?.communityCreationRequests,
            data: [
              ...prev?.communityCreationRequests.data,
              ...fetchMoreResult?.communityCreationRequests.data
            ]
          }
        });
      }
    });
  };

  const handleChannelRequestEndReach = async () => {
    if (!channelRequestCallOnScrollEnd) return;

    channelRequestFetchMore({
      variables: {
        input: {
          skip: filteredChannelRequest?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setChannelRequestCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          myChannelCreationRequests: {
            ...prev?.myChannelCreationRequests,
            data: [
              ...prev?.myChannelCreationRequests.data,
              ...fetchMoreResult?.myChannelCreationRequests.data
            ]
          }
        });
      }
    });
  };

  const _renderCommunityInviteCard = useMemo(
    () => ({ item }: { item: any }) => (
      <TribeInviteCard
        key={item.id}
        id={item.id}
        name={item.community.name}
        firstName={item.sender.firstName}
        lastName={item.sender.lastName}
        avatar={item.sender.avatar}
        refetch={inviteRefetch}
        userId={item.sender.id}
        tribeId={item.community.id}
        createdAt={item.createdAt}
        {...item}
      />
    ),
    []
  );

  const _renderCommunityCreationCard = useMemo(
    () => ({ item }: { item: any }) => (
      <TribeCreationRequestCard
        key={item.id}
        id={item.id}
        name={item.name}
        avatar={item.avatar}
        moderators={item.moderators}
        refetch={requestRefetch}
        {...item}
      />
    ),
    []
  );

  const _renderRequestTribe = useMemo(
    () => ({ item }: { item: any }) => (
      <ChannelCreationRequestCard
        key={item.id}
        id={item.id}
        name={item.name}
        firstName={item.moderators[0]?.firstName}
        lastName={item.moderators[0]?.lastName}
        avatar={item.community.avatar}
        refetch={channelRequestRefetch}
        userId={item.creator?.id}
        {...item}
      />
    ),
    []
  );

  useEffect(() => {
    tagScreenName('TribeRequestScreen');
  }, []);

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
            {t(`community.sideNav.communityRequest`)}
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
        {moderator ? (
          <TouchableOpacity
            onPress={showModal}
            style={{
              backgroundColor: colors.SHADOW,
              height: RFValue(40),
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
                color: colors.PRIMARY_TEXT,
                textTransform: 'capitalize',
                textAlign: 'center',
                marginLeft: 'auto'
              }}
            >
              {isAdmin == 'tribe'
                ? t(`community.notification.communityRequest`)
                : isAdmin == 'channel'
                ? t(`community.notification.channelRequest`)
                : t(`community.notification.communityInvite`)}
            </Text>
            <FontAwesome
              name="sliders"
              size={20}
              color={colors.PRIMARY_TEXT}
              style={{
                marginLeft: 'auto',
                marginRight: RFValue(15)
              }}
            />
          </TouchableOpacity>
        ) : null}

        {isAdmin == 'tribe' ? (
          <Fragment>
            {filteredRequest ? (
              <FlatList
                data={filteredRequest}
                refreshing={requestRefreshing}
                onRefresh={handleRequestRefresh}
                ListFooterComponent={_renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (
                    tribeRequest &&
                    tribeRequest?.metadata?.totalCount > filteredRequest?.length
                  ) {
                    setRequestCallOnScrollEnd(true);
                  }
                }}
                onMomentumScrollEnd={handleRequestEndReach}
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
                    There is no new tribe request
                  </Text>
                }
                showsVerticalScrollIndicator={false}
                renderItem={_renderCommunityCreationCard}
                keyExtractor={({ id }) => id}
              />
            ) : (
              <Skeleton />
            )}
          </Fragment>
        ) : isAdmin == 'channel' ? (
          <Fragment>
            {filteredChannelRequest ? (
              <FlatList
                data={filteredChannelRequest}
                refreshing={channelRequestRefreshing}
                onRefresh={handleChannelRequestRefresh}
                ListFooterComponent={_renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (
                    channelRequest &&
                    channelRequest?.metadata?.totalCount >
                      filteredChannelRequest?.length
                  ) {
                    setChannelRequestCallOnScrollEnd(true);
                  }
                }}
                onMomentumScrollEnd={handleChannelRequestEndReach}
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
                    You currently don't have any channel request
                  </Text>
                }
                showsVerticalScrollIndicator={false}
                renderItem={_renderRequestTribe}
                keyExtractor={({ id }) => id}
              />
            ) : (
              <Skeleton />
            )}
          </Fragment>
        ) : (
          <Fragment>
            {filteredInvite ? (
              <FlatList
                data={filteredInvite}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListFooterComponent={_renderFooter}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (
                    tribeInvites &&
                    tribeInvites?.metadata?.totalCount > filteredInvite?.length
                  ) {
                    setCallOnScrollEnd(true);
                  }
                }}
                onMomentumScrollEnd={handleInviteEndReach}
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
                    You currently don't have any tribe invite
                  </Text>
                }
                showsVerticalScrollIndicator={false}
                renderItem={_renderCommunityInviteCard}
                keyExtractor={({ id }) => id}
              />
            ) : (
              <Skeleton />
            )}
          </Fragment>
        )}

        <Modal isVisible={modalVisible}>
          <ModalCover>
            <GradientButton
              onPress={() => {
                setIsAdmin('invite');
                setModalVisible(false);
              }}
              style={{ width: '100%' }}
              gradientContainerstyle={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
            >
              {t(`community.notification.communityInvite`)}
            </GradientButton>
            <GradientButton
              onPress={() => {
                setIsAdmin('tribe');
                setModalVisible(false);
              }}
              style={{ width: '100%' }}
              gradientContainerstyle={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
            >
              {t(`community.notification.communityRequest`)}
            </GradientButton>
            <GradientButton
              onPress={() => {
                setIsAdmin('channel');
                setModalVisible(false);
              }}
              style={{ width: '100%' }}
              gradientContainerstyle={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
            >
              {t(`community.notification.channelRequest`)}
            </GradientButton>
            <Button
              uppercase={false}
              mode="text"
              onPress={showModal}
              style={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
              contentStyle={{ backgroundColor: colors.WHITE }}
              labelStyle={{
                fontSize: RFValue(fonts.LARGE_SIZE),
                fontFamily: fonts.WORK_SANS_BOLD,
                color: colors.PRIMARY,
                margin: RFValue(20),
                textAlign: 'center',
                textTransform: 'capitalize'
              }}
            >
              {t(`community.notification.cancel`)}
            </Button>
          </ModalCover>
        </Modal>
      </Container>
    </Fragment>
  );
}
