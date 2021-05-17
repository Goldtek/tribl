import React, { useState, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Divider,
  Text,
  TouchableRipple,
  ActivityIndicator
} from 'react-native-paper';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import TribeCard from './widgets';
import hexToRGB from '../../../utils/hexToRGB';
import { GET_MY_COMMUNITIES } from '../../../graphql/server/query';
import Skeleton from './widgets/newMessageSkeleton';
import ENVIRONMENT_VARIABLES from '../../../config';
import {
  MyCommunitiesRequestInterface,
  CommunityInterface
} from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  FilterContainer,
  HeaderContainer,
  HeaderTitle
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function CreateChannelTribeScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('CreateChannelTribeScreen');
  }, []);

  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const { data, loading, fetchMore } = useQuery<MyCommunitiesRequestInterface>(
    GET_MY_COMMUNITIES,
    { variables: { input: { skip: 0, limit: PAGINATION_DEFAULT / 2 } } }
  );

  const myCommunities = data?.myCommunities;
  const filteredCommunities = myCommunities?.data;

  const [search, setSearch] = useState({ searchTerm: '' });

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const keysToFilter = ['name'];

  const filteredWords =
    filteredCommunities &&
    filteredCommunities?.filter(createFilter(search.searchTerm, keysToFilter));

  const handleEndReach = () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: {
          skip: filteredCommunities?.length,
          limit: PAGINATION_DEFAULT
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          myCommunities: {
            ...prev.myCommunities,
            data: [
              ...prev.myCommunities.data,
              ...fetchMoreResult.myCommunities.data
            ]
          }
        });
      }
    });
  };

  const onEndReachedScroll = () => {
    if (
      myCommunities &&
      myCommunities.metadata.totalCount > myCommunities.data.length
    ) {
      setCallOnScrollEnd(true);
    }
  };

  const _renderItem = ({ item }: { item: CommunityInterface }) => (
    <TribeCard key={item.id} {...item} />
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

  const _renderSeparator = () => {
    return (
      <Divider
        style={{
          height: 1.5,
          marginHorizontal: RFValue(20),
          backgroundColor: hexToRGB(colors.INACTIVE, 0.5)
        }}
      />
    );
  };

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
          <HeaderTitle> {t(`community.chat.selectTribe`)}</HeaderTitle>
        </HeaderContainer>

        <FilterContainer>
          <SearchInput
            onChangeText={searchUpdated}
            placeholder="Search"
            placeholderTextColor={colors.PRIMARY_TEXT}
            style={{
              height: RFValue(45),
              color: colors.PRIMARY_TEXT,
              alignItems: 'center',
              elevation: 0,
              borderWidth: 1,
              borderColor: colors.INACTIVE,
              borderRadius: 4,
              paddingHorizontal: 15,
              marginHorizontal: 15
            }}
          />
        </FilterContainer>

        {!loading ? (
          <FlatList
            bounces={false}
            data={filteredWords}
            ref={hideSensitiveView}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={_renderSeparator}
            ListEmptyComponent={
              <Text
                style={{
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  fontFamily: fonts.WORK_SANS_BOLD,
                  margin: RFValue(20),
                  textAlign: 'center'
                }}
              >
                {filteredCommunities?.length
                  ? `${search.searchTerm} is not found`
                  : 'You have to join a tribe for you to be able to create a channel.'}
              </Text>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: RFValue(10),
              paddingBottom: RFValue(20)
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
