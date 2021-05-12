import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text, Title } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery } from '@apollo/react-hooks';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../../../theme';
import Connection from './widget';
import { GET_MY_CONNECTIONS } from '../../../../../graphql/server/query';
import Skeleton from './widget/myConnectionSkeleton';
import {
  MyConnectionsInterface,
  PassportInterface
} from '../../../../../graphql/types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../../../constants';
import GradientButton from '../../../../../components/gradientButton';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface addAdminScreenProp extends NavigationInterface {}

export default function AddAdmin(props: addAdminScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;

  const [admin, setAdmin] = useState({
    selectedAdmin: new Map()
  });

  const handleSelect = (selected: string) => {
    if (!admin.selectedAdmin.has(selected)) {
      return setAdmin({
        ...admin,
        selectedAdmin: new Map(admin.selectedAdmin.set(selected, selected))
      });
    }

    admin.selectedAdmin.delete(selected);
    setAdmin({
      ...admin,
      selectedAdmin: new Map(admin.selectedAdmin)
    });
  };

  const selectedAdmins = [...Array.from(admin.selectedAdmin.values())];

  useEffect(() => {
    tagScreenName('AddAdminScreen');
  }, []);

  const { data, refetch, fetchMore } = useQuery<MyConnectionsInterface>(
    GET_MY_CONNECTIONS,
    { variables: { input: { limit: PAGINATION_DEFAULT, skip: 0 } } }
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
    <Connection
      key={item.id}
      {...item}
      id={item.id}
      selected={admin.selectedAdmin.get(item.id)}
      handleSelect={handleSelect}
      admin={item.firstName}
    />
  );

  const handleNavigation = () => {
    navigation.navigate('TribeDetailScreen', {
      details: props.route.params,
      admins: selectedAdmins
    });
  };

  return (
    <Container>
      <Title
        style={{
          fontSize: RFValue(fonts.LARGE_SIZE + 5),
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          color: colors.PRIMARY_TEXT,
          textTransform: 'capitalize',
          paddingHorizontal: RFValue(15)
        }}
      >
        {t(`community.createTribe.addAdmin`)}
      </Title>
      <Text
        style={{
          fontSize: RFValue(fonts.MEDIUM_SIZE),
          fontFamily: fonts.WORK_SANS_REGULAR,
          color: colors.SECONDARY_TEXT,
          paddingHorizontal: RFValue(15)
        }}
      >
        {t(`community.createTribe.adminText`)}
      </Text>
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
          marginHorizontal: 15,
          marginVertical: 15
        }}
      />
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
      <GradientButton
        onPress={handleNavigation}
        style={{ height: RFValue(45) }}
        contentStyle={{ height: RFValue(45) }}
        gradientContainerstyle={{
          height: RFValue(45),
          marginTop: RFValue(70),
          marginHorizontal: RFValue(15),
          marginBottom: RFValue(15)
        }}
      >
        {selectedAdmins?.length
          ? t(`community.createTribe.selectAdmin`)
          : t(`community.createTribe.skip`)}
      </GradientButton>
    </Container>
  );
}
