import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text, Title, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { FlatList, Image } from 'react-native';
import { NavigationInterface } from '../../types';
import SearchInput, { createFilter } from 'react-native-search-filter';
import { useThemeContext } from '../../../theme';
import Tribe from './widget';
import { GET_MY_COMMUNITIES } from '../../../graphql/server/query';
import { INVITE_TO_TRIBE } from '../../../graphql/server/mutations';

import Skeleton from './widget/myConnectionSkeleton';
import {
  MyCommunitiesRequestInterface,
  CommunityInterface
} from '../../../graphql/types';
import { tagScreenName, logEvent } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';
import GradientButton from '../../../components/gradientButton';
import { Toast } from '../../../components/rootToaster';
import { Mixpanel } from '../../../config';
import { crashlytics } from '../../../firebase/config';

// IMPORT FOR ALL CUSTOM STYLES
import { Container, ButtonCover } from './styles';

// DEFINE SCREEN PROP TYPES
interface inviteToTribeProp extends NavigationInterface {}

export default function InviteToTribe(props: inviteToTribeProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const { navigation } = props;
  const memberId = [props.route?.params?.memberId];

  const [tribe, setTribe] = useState({
    selectedTribe: new Map()
  });

  const selectedTribe = [...Array.from(tribe.selectedTribe.values())];
  const communityId = selectedTribe.toString();

  const handleSelect = (selected: string) => {
    if (!tribe.selectedTribe.has(selected) && selectedTribe?.length === 0) {
      return setTribe({
        ...tribe,
        selectedTribe: new Map(tribe.selectedTribe.set(selected, selected))
      });
    }
    if (!tribe.selectedTribe.has(selected) && selectedTribe?.length === 1) {
      const tribeSelected = [...Array.from(tribe.selectedTribe.values())].pop();
      tribe.selectedTribe.delete(tribeSelected);
      return setTribe({
        ...tribe,
        selectedTribe: new Map(tribe.selectedTribe.set(selected, selected))
      });
    }
    tribe.selectedTribe.delete(selected);
    setTribe({
      ...tribe,
      selectedTribe: new Map(tribe.selectedTribe)
    });
  };

  const handleInputError = (error: string) => {
    Toast.show(t(`community.invitation.${error}`));
  };

  const [inviteToTribe, { loading }] = useMutation(INVITE_TO_TRIBE, {
    variables: {
      payload: {
        communityId: communityId,
        receipientIds: memberId
      }
    }
  });

  const sendTribeInvite = async () => {
    if (selectedTribe?.length !== 1) {
      return handleInputError('tribeInviteError');
    }
    logEvent('send tribe invite', { from: 'user profile' });
    try {
      Mixpanel.track('Send Tribe Invite', {
        info: `Invite friends to ${communityId}`,
        'Activity Screen': 'Invite to tribe from profile screen'
      });
      await inviteToTribe();
      navigation.goBack();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  useEffect(() => {
    tagScreenName('InviteToTribeFromProfileScreen');
  }, []);

  const { data, refetch, fetchMore } = useQuery<MyCommunitiesRequestInterface>(
    GET_MY_COMMUNITIES,
    { variables: { input: { limit: PAGINATION_DEFAULT * 5, skip: 0 } } }
  );

  const [search, setSearch] = useState({ searchTerm: '' });
  const [state, setState] = useState({
    refreshing: false,
    callOnScrollEnd: false
  });

  const myTribe = data?.myCommunities?.data;

  const filterConnections = myTribe?.slice().sort(function (a, b) {
    if (a.name < b.name) return -1;

    if (a.name > b.name) return 1;

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
  //       offset: data?.myTribe?.data?.length,
  //       first: PAGINATION_DEFAULT
  //     },
  //     updateQuery: (prev, { fetchMoreResult }) => {
  //       setState({ ...state, callOnScrollEnd: false });

  //       if (!fetchMoreResult) return prev;

  //       return Object.assign({}, prev, {
  //         myTribe: [...fetchMoreResult.myConnections]
  //       });
  //     }
  //   });
  // };

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = ['name'];

  const filteredWords =
    filterConnections &&
    filterConnections?.filter(createFilter(search.searchTerm, KeysToFilter));

  const _renderItem = ({ item }: { item: CommunityInterface }) => (
    <Tribe
      key={item.id}
      {...item}
      id={item.id}
      selected={tribe.selectedTribe?.get(item.id)}
      handleSelect={handleSelect}
      tribe={item.name}
    />
  );

  return (
    <Container>
      <Image
        source={require('../../../../assets/images/icon.png')}
        style={{
          resizeMode: 'contain',
          width: RFValue(80),
          height: RFValue(80),
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 0
        }}
      />
      <Title
        style={{
          fontFamily: fonts.WORK_SANS_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          color: colors.PRIMARY_TEXT,
          lineHeight: RFValue(30),
          textAlign: 'center',
          marginTop: 20
        }}
      >
        {t(`community.invitation.title`)}
      </Title>
      <Text
        style={{
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
          color: colors.PRIMARY_TEXT,
          textAlign: 'center'
        }}
      >
        {t(`community.invitation.text2`)}
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
          marginVertical: 15
        }}
      />
      {myTribe ? (
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
            paddingBottom: RFValue(20)
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
              You are not a member of any tribe
            </Text>
          }
          showsVerticalScrollIndicator={false}
          renderItem={_renderItem}
          keyExtractor={({ id }) => id}
        />
      ) : (
        <Skeleton />
      )}
      <ButtonCover>
        <GradientButton
          onPress={sendTribeInvite}
          loading={loading}
          style={{ height: RFValue(45) }}
          contentStyle={{ height: RFValue(45) }}
          gradientContainerstyle={{
            height: RFValue(45),
            marginTop: RFValue(40),
            marginHorizontal: RFValue(15),
            marginBottom: RFValue(15)
          }}
        >
          {t(`community.invitation.invite`)}
        </GradientButton>
        <Button
          labelStyle={{
            color: colors.PRIMARY_TEXT,
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            fontSize: RFValue(fonts.LARGE_SIZE),
            textTransform: 'capitalize'
          }}
          onPress={() => navigation.goBack()}
        >
          {t(`community.invitation.cancel`)}
        </Button>
      </ButtonCover>
    </Container>
  );
}
