import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Modal,
  Alert,
  FlatList,
  TouchableWithoutFeedback
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Title,
  Divider,
  TouchableRipple,
  ActivityIndicator
} from 'react-native-paper';
import {
  Configure,
  InstantSearch,
  connectSearchBox
} from 'react-instantsearch-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../../../theme';
import hexToRGB from '../../../utils/hexToRGB';
import ENVIRONMENT_VARIABLES, { searchClient } from '../../../config';
import { PassportInterface } from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import GroupMemberCard from '../../../components/groupMember';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT, USER_DEFAULT_AVATAR } from '../../../constants';
import { useKeyboardContext } from 'stream-chat-react-native-core';
import AlgoliaList from '../../../components/algoliaList';
import { useStreamContext } from '../../../stream';
import { crashlytics } from '../../../firebase/config';
import { chatClient } from '../../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Overlay,
  Container,
  CloseIcon,
  HeaderTitle,
  HeaderAction,
  LoaderMessage,
  ContentWrapper,
  HeaderContainer,
  HeaderActionText,
  ModalContentWrapper,
  SelectedMemberWrapper,
  SearchInputWrapper
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function AddGroupParticipantsScreen(props: ScreenProp) {
  const { navigation } = props;
  const { t } = useTranslation();
  const { channel, setChannel } = useStreamContext();
  const selecteduserRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const { colors, fonts } = useThemeContext();
  const { dismissKeyboard } = useKeyboardContext();
  const [state, setState] = useState({ search: {} });
  const [group, setGroup] = useState<{ [key: string]: PassportInterface }>({});

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
    tagScreenName('AddMembersToGroupScreen');
  }, [group]);

  const onSearchStateChange = (search: string) => {
    setState({ ...state, search });
  };

  const participants = Object.values(group);

  const indexName = ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME;

  const handleGroupNavigation = () => {
    if (!participants.length) return;

    const members = [
      ...participants.map(({ id }) => id),
      ...Object.values(channel.state.members)
    ];

    if (members.length > 30) {
      return Alert.alert(
        'Group warning',
        `A group cannot have more than 30 members`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel'
          },
          {
            text: 'Ok',
            onPress: () => {}
          }
        ]
      );
    }

    Alert.alert(
      'Add member to group',
      `Are you sure you want to add the selected ${
        participants.length === 1 ? 'member' : 'members'
      } this group`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: `Add ${participants.length === 1 ? 'user' : 'users'}`,
          onPress: async () => {
            try {
              setLoading(true);
              await channel.addMembers([...participants.map(({ id }) => id)]);
              setChannel(channel);

              const channelMessages = participants.map(
                ({ firstName, lastName, avatar, id }) =>
                  channel.sendMessage({
                    text: `${firstName} was added by ${
                      chatClient.user?.name?.split(' ')[0]
                    }`,
                    group_system: true,
                    receiver: {
                      id,
                      image: avatar,
                      name: `${firstName} ${lastName}`
                    }
                  })
              );

              await Promise.all(channelMessages);
              setLoading(false);
              navigation.navigate('ChannelChatScreen', {
                title: channel.data?.name,
                channelId: channel.id
              });
            } catch (error) {
              setLoading(false);
              crashlytics.recordError(new Error(error));
              crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
            }
          }
        }
      ]
    );
  };

  const _renderItem = ({ item }: any) => {
    if (channel.state?.members[item.id]) {
      return null;
    }

    return (
      <GroupMemberCard
        {...item}
        attribute="id"
        key={item.id}
        handleSelect={handleSelect}
        selected={Boolean(group[item.id])}
      />
    );
  };

  const _renderSelectedItem = ({ item }: { item: PassportInterface }) => (
    <TouchableWithoutFeedback onPress={() => {}}>
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
          {item.firstName} {item.lastName}
        </Title>
      </SelectedMemberWrapper>
    </TouchableWithoutFeedback>
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
            <HeaderTitle>{t(`community.chat.inviteToGroup`)}</HeaderTitle>
            <ContentWrapper style={{ flex: 1, paddingHorizontal: 0 }}>
              <HeaderAction
                onPress={handleGroupNavigation}
                disabled={!Boolean(participants.length)}
              >
                <HeaderActionText
                  selectedParticipants={Boolean(participants.length)}
                >
                  {t(`community.recommended.add`)}
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

            <SearchInputWrapper>
              <AlgoliaSearchBox />
              <FlatList
                ref={selecteduserRef}
                onContentSizeChange={() =>
                  selecteduserRef.current.scrollToEnd({ animated: true })
                }
                onLayout={() =>
                  selecteduserRef.current.scrollToEnd({ animated: true })
                }
                bounces={false}
                horizontal={true}
                scrollEnabled={true}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                data={Object.values(group)}
                renderItem={_renderSelectedItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 10
                }}
                style={{ marginRight: 15, paddingRight: 5 }}
              />
            </SearchInputWrapper>

            <AlgoliaList
              //@ts-ignore
              _separator={_renderSeparator}
              //@ts-ignore
              _renderItem={_renderItem}
            />
          </InstantSearch>
        </Container>
      </TouchableWithoutFeedback>
      <Modal
        animationType="fade"
        onRequestClose={() => setLoading(false)}
        visible={loading}
        transparent
      >
        <Overlay>
          <ModalContentWrapper>
            <ActivityIndicator size="small" color={colors.BLACK} />
            <LoaderMessage>
              {t(`community.chat.addingMembers`)}...
            </LoaderMessage>
          </ModalContentWrapper>
        </Overlay>
      </Modal>
    </SafeAreaView>
  );
}
