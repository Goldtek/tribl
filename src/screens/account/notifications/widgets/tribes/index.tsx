import React, { useState, useMemo, Fragment } from 'react';
import { Title, Text, Divider, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@apollo/react-hooks';
import { NavigationInterface } from '../../../../types';
import { useThemeContext } from '../../../../../theme';
import NotificationCard from './widget';
import CommunityCreationRequestCard from './widget/tribeCreationRequest';
import {
  GET_TRIBE_INVITES,
  GET_COMMUNITY_CREATION_REQUEST,
  GET_USER_PASSPORT
} from '../../../../../graphql/server/query';
import hexToRGB from '../../../../../utils/hexToRGB';
import { PAGINATION_DEFAULT } from '../../../../../constants';

import { Container, ModalCover } from './styles';
import GradientButton from '../../../../../components/gradientButton';

interface tribeScreenProp extends NavigationInterface {}

export default function TribeScreen(props: tribeScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [search, setSearch] = useState({ searchTerm: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [tribeData, setTribeData] = useState(
    t(`community.notification.general`)
  );

  const showModal = () => {
    setModalVisible(!modalVisible);
  };

  const { data: inviteData, refetch } = useQuery(GET_TRIBE_INVITES);

  const { data: requestData, refetch: requestRefetch } = useQuery(
    GET_COMMUNITY_CREATION_REQUEST,
    {
      variables: {
        input: { limit: PAGINATION_DEFAULT }
      }
    }
  );

  const { data: userData } = useQuery(GET_USER_PASSPORT);

  const tribeInvites = inviteData?.communityInvites?.data;
  const tribeRequest = requestData?.communityCreationRequests?.data;
  const userDetails = userData?.myPassport;
  const tribe = userDetails?.participantOf;
  const moderator = tribe.filter((item: any) => item.isModerator);

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = [
    'sender.firstName',
    'sender.lastName',
    'community.name'
  ];

  const communityKeysToFilter = [
    'name',
    'moderators.firstName',
    'moderators.lastName'
  ];
  const filteredCommunityWords =
    tribeRequest &&
    tribeRequest?.filter(
      createFilter(search.searchTerm, communityKeysToFilter)
    );

  const filteredWords =
    tribeInvites &&
    tribeInvites?.filter(createFilter(search.searchTerm, KeysToFilter));

  const _renderNotification = useMemo(
    () => ({ item }: { item: any }) => (
      <NotificationCard
        key={item.id}
        id={item.id}
        name={item.community.name}
        firstName={item.sender.firstName}
        lastName={item.sender.lastName}
        avatar={item.sender.avatar}
        refetch={refetch}
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
      <CommunityCreationRequestCard
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

  return (
    <Fragment>
      <Container>
        {moderator?.length ? (
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
              {tribeData}
            </Text>
            <FontAwesome
              name="sliders"
              size={20}
              color={colors.PRIMARY_TEXT}
              style={{ marginLeft: 'auto', marginRight: RFValue(15) }}
            />
          </TouchableOpacity>
        ) : null}
        <FlatList
          data={userDetails?.isAdmin ? filteredCommunityWords : filteredWords}
          renderItem={
            userDetails?.isAdmin
              ? _renderCommunityCreationCard
              : _renderNotification
          }
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 1.5,
                backgroundColor: hexToRGB(colors.INACTIVE, 0.5),
                marginVertical: RFValue(20)
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
              {t(`community.notification.empty`)}
            </Text>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 20,
            paddingHorizontal: 15,
            backgroundColor: colors.WHITE
          }}
        />
        <Modal isVisible={modalVisible}>
          <ModalCover>
            <GradientButton
              onPress={() => {
                setTribeData(t(`community.notification.general`));
                setModalVisible(false);
              }}
              style={{ width: '100%' }}
              gradientContainerstyle={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
            >
              {t(`community.notification.general`)}
            </GradientButton>
            <GradientButton
              onPress={() => {
                setTribeData(t(`community.notification.adminTribe`));
                setModalVisible(false);
              }}
              style={{ width: '100%' }}
              gradientContainerstyle={{
                width: '100%',
                height: RFValue(45),
                marginTop: RFValue(5)
              }}
            >
              {t(`community.notification.adminTribe`)}
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
