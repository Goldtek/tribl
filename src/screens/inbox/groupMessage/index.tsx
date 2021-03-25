import React, { useState, useEffect, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Searchbar } from 'react-native-paper';
import { connectInfiniteHits } from 'react-instantsearch-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, TouchableRipple, Title } from 'react-native-paper';
import {
  InstantSearch,
  connectSearchBox,
  Configure
} from 'react-instantsearch-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import MemberCard from './widgets/member';
import hexToRGB from '../../../utils/hexToRGB';
import ENVIRONMENT_VARIABLES, { searchClient } from '../../../config';
import { PassportInterface } from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT, USER_DEFAULT_AVATAR } from '../../../constants';
import { Results, AlgoliaListProps } from '../../../components/algoliaList';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  HeaderContainer,
  HeaderTitle,
  HeaderAction,
  HeaderActionText,
  SelectedMemberWrapper,
  SelectedMemberContainer,
  CloseIcon
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [group, setGroup] = useState<{ [key: string]: PassportInterface }>({});
  const [state, setState] = useState({ search: {} });

  const handleSelect = (user: PassportInterface) => {
    if (!group[user.id]) {
      return setGroup({ ...group, [user.id]: user });
    }

    const { [user.id]: _, ...restUsers } = { ...group };
    setGroup(restUsers);
  };

  useEffect(() => {
    tagScreenName('NewMessageScreen');
  }, []);

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const indexName = ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME;

  const _renderItem = ({ item }: any) => (
    <MemberCard
      {...item}
      attribute="id"
      key={item.id}
      handleSelect={handleSelect}
      selected={Boolean(group[item.id])}
    />
  );

  const _renderSelectedItem = ({ item }: { item: PassportInterface }) => (
    <SelectedMemberWrapper>
      <SelectedMemberContainer ref={hideSensitiveView}>
        <CloseIcon onPress={() => handleSelect(item)}>
          <Ionicons name="md-close" size={15} color={colors.GREY} />
        </CloseIcon>
        <FastImage
          resizeMode={FastImage.resizeMode.stretch}
          source={{
            uri: item.avatar || USER_DEFAULT_AVATAR,
            priority: FastImage.priority.high
          }}
          style={{
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: 4
          }}
        />
        <Title
          numberOfLines={1}
          style={{
            color: colors.BLACK,
            fontFamily: fonts.WORK_SANS_REGULAR,
            fontSize: RFValue(10)
          }}
        >
          {item.firstName} {item.lastName} {item.lastName}
        </Title>
      </SelectedMemberContainer>
    </SelectedMemberWrapper>
  );

  const _searchBox = ({ currentRefinement, refine }: any) => (
    <Searchbar
      value={currentRefinement}
      iconColor={colors.PRIMARY_TEXT}
      onChangeText={(value) => refine(value)}
      placeholder={t(`community.chat.search`)}
      style={{
        height: RFValue(50),
        fontFamily: fonts.WORK_SANS_REGULAR,
        fontSize: RFValue(fonts.LARGE_SIZE),
        color: colors.SECONDARY_TEXT,
        marginHorizontal: 15,
        marginVertical: 10,
        elevation: 0,
        borderColor: colors.INACTIVE,
        borderRadius: 4,
        borderWidth: 1
      }}
    />
  );

  const AlgoliaSearchBox = useMemo(() => connectSearchBox(_searchBox), [
    indexName
  ]);

  const AlgoliaList = connectInfiniteHits((props: AlgoliaListProps) => {
    const { hits, hasMore, refineNext } = props;

    return (
      <Results>
        <FlatList
          data={hits}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 1.5,
                backgroundColor: hexToRGB(colors.INACTIVE, 0.5),
                marginHorizontal: RFValue(20)
              }}
            />
          )}
          scrollEventThrottle={16}
          onEndReached={() => hasMore && refineNext()}
          contentContainerStyle={{
            paddingTop: RFValue(10),
            paddingBottom: RFValue(60)
          }}
        />
      </Results>
    );
  });

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
          <HeaderTitle>Add Participants</HeaderTitle>
          <HeaderAction>
            <HeaderActionText>Create</HeaderActionText>
          </HeaderAction>
        </HeaderContainer>
        <View>
          <InstantSearch
            indexName={indexName}
            searchState={state.search}
            searchClient={searchClient}
            onSearchStateChange={onSearchStateChange}
          >
            <Configure hitsPerPage={PAGINATION_DEFAULT} distinct />
            <AlgoliaSearchBox />
            <FlatList
              horizontal
              bounces={false}
              ref={hideSensitiveView}
              data={Object.values(group)}
              renderItem={_renderSelectedItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flex: 1 }}
            />
            <AlgoliaList />
          </InstantSearch>
        </View>
      </Container>
    </SafeAreaView>
  );
}
