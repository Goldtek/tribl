import React, { useState, useMemo } from 'react';
import { NavigationInterface } from '../../types';
import { Title, Text, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import ChannelRequestCard from './widget';
import { GET_CHANNEL_CREATION_REQUEST } from '../../../graphql/server/query';
import hexToRGB from '../../../utils/hexToRGB';

import { Container, TitleCover } from './styles';

interface channelRequestScreenProp extends NavigationInterface {}

export default function NewChannelRequestScreen(
  props: channelRequestScreenProp
) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const communityId = props.route?.params?.communityId;

  const [search, setSearch] = useState({ searchTerm: '' });

  const { data: requestData, refetch } = useQuery(
    GET_CHANNEL_CREATION_REQUEST,
    { variables: { input: { filter: { communityId } } } }
  );

  const channelRequest = requestData?.channelCreationRequests?.data;

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = [
    'creator.firstName',
    'creator.lastName',
    'name',
    'community.name'
  ];

  const filteredWords =
    channelRequest &&
    channelRequest?.filter(createFilter(search.searchTerm, KeysToFilter));

  const _renderRequestTribe = useMemo(
    () => ({ item }: { item: any }) => (
      <ChannelRequestCard
        key={item.id}
        id={item.id}
        name={item.name}
        firstName={item.creator?.firstName}
        lastName={item.creator?.lastName}
        avatar={item.community?.avatar}
        refetch={refetch}
        userId={item.creator?.id}
        {...item}
      />
    ),
    []
  );

  return (
    <Container>
      <SearchInput
        onChangeText={searchUpdated}
        placeholder={t(`community.notification.channelPlaceholder`)}
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
      <TitleCover>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_BOLD,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.PRIMARY_TEXT,
            textTransform: 'capitalize',
            marginTop: 0,
            marginBottom: 0,
            paddingLeft: 15
          }}
        >
          {t(`community.notification.channel`)}
        </Title>
        <Title
          style={{
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(fonts.MEDIUM_SIZE + 2),
            color: colors.ONLINE,
            textTransform: 'capitalize',
            marginTop: 0,
            marginBottom: 0,
            paddingLeft: 5
          }}
        >
          ({channelRequest?.length ? channelRequest?.length : '0'})
        </Title>
      </TitleCover>

      <FlatList
        data={filteredWords}
        renderItem={_renderRequestTribe}
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
            {t(`community.invitation.channelEmpty`)}
          </Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: 20,
          paddingHorizontal: 15,
          backgroundColor: colors.WHITE
        }}
      />
    </Container>
  );
}
