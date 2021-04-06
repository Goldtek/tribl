import React, { useState, useEffect, useMemo } from 'react';
import { FlatList, TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Searchbar } from 'react-native-paper';
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
import GroupMemberCard from '../../../components/groupMember';
import hexToRGB from '../../../utils/hexToRGB';
import ENVIRONMENT_VARIABLES, { searchClient } from '../../../config';
import { PassportInterface } from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT, USER_DEFAULT_AVATAR } from '../../../constants';
import { useKeyboardContext } from 'stream-chat-react-native-core';
import AlgoliaList from '../../../components/algoliaList';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  CloseIcon,
  HeaderTitle,
  HeaderAction,
  ContentWrapper,
  HeaderContainer,
  HeaderActionText,
  SelectedMemberWrapper
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function SelectGroupParticipantsScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const { dismissKeyboard } = useKeyboardContext();

  const [group, setGroup] = useState<{ [key: string]: PassportInterface }>({});
  const [state, setState] = useState({ search: {} });

  const handleSelect = (user: PassportInterface) => {
    dismissKeyboard();
    const { firstName, lastName, id, avatar } = user;

    const payload = {
      id,
      avatar,
      lastName,
      firstName
    } as PassportInterface;

    if (!group[id]) {
      return setGroup({ ...group, [id]: payload });
    }

    const { [id]: _, ...restUsers } = { ...group };
    setGroup(restUsers);
  };

  useEffect(() => {
    tagScreenName('NewMessageScreen');
  }, [group]);

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const participants = Object.values(group);

  const indexName = ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME;

  const handleGroupNavigation = () => {
    navigation.navigate('CreateGroupScreen', { participants });
  };

  const _renderItem = ({ item }: any) => (
    <GroupMemberCard
      {...item}
      attribute="id"
      key={item.id}
      handleSelect={handleSelect}
      selected={Boolean(group[item.id])}
    />
  );

  const _renderSelectedItem = ({ item }: { item: PassportInterface }) => (
    <SelectedMemberWrapper ref={hideSensitiveView}>
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

  const _renderSeparator = ({ leadingItem }: any) => {
    const user = leadingItem as PassportInterface;

    if (
      (!user.verified ||
        user.lastName == null ||
        user.firstName == null ||
        user.currentLocation?.city == null,
      user.currentLocation?.state == null)
    ) {
      return null;
    }

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
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
            <ContentWrapper style={{ flex: 1, paddingHorizontal: 0 }}>
              <HeaderAction
                onPress={handleGroupNavigation}
                disabled={!Boolean(participants.length)}
              >
                <HeaderActionText
                  selectedParticipants={Boolean(participants.length)}
                >
                  Create
                </HeaderActionText>
              </HeaderAction>
            </ContentWrapper>
          </HeaderContainer>
          <InstantSearch
            indexName={indexName}
            searchState={state.search}
            searchClient={searchClient}
            onSearchStateChange={onSearchStateChange}
          >
            <Configure hitsPerPage={PAGINATION_DEFAULT} distinct />
            <AlgoliaSearchBox />

            <View>
              <FlatList
                bounces={false}
                horizontal={true}
                scrollEnabled={true}
                onEndReachedThreshold={0.5}
                ref={hideSensitiveView}
                data={Object.values(group)}
                renderItem={_renderSelectedItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
              />
            </View>

            <AlgoliaList
              //@ts-ignore
              _separator={_renderSeparator}
              //@ts-ignore
              _renderItem={_renderItem}
            />
          </InstantSearch>
        </Container>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
