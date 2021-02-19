import React, { useState, useMemo } from 'react';
import { NavigationInterface } from '../../types';
import { Title, Text, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import TribeRequestCard from './widget';
import { GET_TRIBE_REQUESTS } from '../../../graphql/server/query';
import hexToRGB from '../../../utils/hexToRGB';

import { Container, TitleCover } from './styles';

interface tribeRequestScreenProp extends NavigationInterface {}

export default function TribeRequestScreen(props: tribeRequestScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const communityId = props.route?.params?.communityId;

  const [search, setSearch] = useState({ searchTerm: '' });

  const { data: requestData, refetch } = useQuery(GET_TRIBE_REQUESTS, {
    variables: {
      input: {
        filter: {
          communityId
        }
      }
    }
  });

  const tribeRequest = requestData?.communityRequests?.data;

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = [
    'sender.firstName',
    'sender.lastName',
    'community.name'
  ];

  const filteredWords =
    tribeRequest &&
    tribeRequest?.filter(createFilter(search.searchTerm, KeysToFilter));

  const _renderRequestTribe = useMemo(
    () => ({ item }: { item: any }) => (
      <TribeRequestCard
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

  return (
    <Container>
      <SearchInput
        onChangeText={searchUpdated}
        placeholder={t(`community.notification.placeholder`)}
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
          {t(`community.notification.tribe`)}
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
          ({tribeRequest?.length ? tribeRequest?.length : '0'})
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
            {t(`community.invitation.empty`)}
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
