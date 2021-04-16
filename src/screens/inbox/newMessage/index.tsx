import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Divider,
  Text,
  TouchableRipple,
  ActivityIndicator,
  Title
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, Octicons, FontAwesome, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/react-hooks';
import { useThemeContext } from '../../../theme';
import MemberCard from '../../../components/connectionCard';
import hexToRGB from '../../../utils/hexToRGB';
import {
  GET_ALL_MEMBERS,
  GET_USER_PASSPORT
} from '../../../graphql/server/query';
import Skeleton from './widgets/newMessageSkeleton';
import ENVIRONMENT_VARIABLES from '../../../config';
import {
  AllMembersRequestInterface,
  PassportInterface
} from '../../../graphql/types';
import { NavigationInterface } from '../../types';
import { tagScreenName, hideSensitiveView } from '../../../utils/uxcamHelper';
import { PAGINATION_DEFAULT } from '../../../constants';
import removeDuplicateMembers from '../../../utils/removeDuplicatePassports';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Container,
  FilterContainer,
  HeaderContainer,
  NameContainer,
  SearchInput,
  IconContainer,
  HeaderTitle,
  SearchInputContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

export default function ChatScreen(props: ScreenProp) {
  const { navigation } = props;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  useEffect(() => {
    tagScreenName('NewMessageScreen');
  }, []);

  const [callOnScrollEnd, setCallOnScrollEnd] = useState(false);

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const blockedUsers = userData?.myPassport?.privacy?.blocked;

  const { data, loading, fetchMore } = useQuery<AllMembersRequestInterface>(
    GET_ALL_MEMBERS,
    {
      variables: { input: { skip: 0, limit: PAGINATION_DEFAULT } }
    }
  );

  const allMembers = data?.Passport;
  const filteredMembers = removeDuplicateMembers(allMembers?.data.slice());
  const filteredUsers = filteredMembers?.filter(function (users) {
    return !blockedUsers?.some(function (userTwo: any) {
      return users.id == userTwo.id;
    });
  });

  const handleMessageNavigation = () => {
    navigation.navigate('SelectGroupParticipantsScreen');
  };

  const handleEndReach = () => {
    if (!callOnScrollEnd) return;

    fetchMore({
      variables: {
        input: { skip: filteredUsers?.length, limit: PAGINATION_DEFAULT }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setCallOnScrollEnd(false);

        if (!fetchMoreResult) return prev;

        return Object.assign({}, prev, {
          Passport: {
            ...prev.Passport,
            data: [...prev.Passport.data, ...fetchMoreResult.Passport.data]
          }
        });
      }
    });
  };

  const onEndReachedScroll = () => {
    if (allMembers && allMembers.metadata.totalCount > allMembers.data.length) {
      setCallOnScrollEnd(true);
    }
  };

  const showSearchScreen = () => {
    navigation.navigate('CommunityAlgoliaScreen', {
      indexName: ENVIRONMENT_VARIABLES.ALGOLIA_PASSPORT_INDEX_NAME
    });
    return true;
  };

  const _renderItem = ({ item }: { item: PassportInterface }) => (
    <MemberCard key={item.id} {...item} />
  );

  const _renderFooter = useCallback(
    () => (callOnScrollEnd ? <ActivityIndicator /> : null),
    [callOnScrollEnd]
  );

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
          <HeaderTitle> {t(`community.chat.newChat`)}</HeaderTitle>
        </HeaderContainer>

        <FilterContainer>
          <SearchInputContainer>
            <SearchInput onStartShouldSetResponder={showSearchScreen}>
              <Octicons name="search" color={colors.PRIMARY_TEXT} size={20} />
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  paddingHorizontal: RFValue(18)
                }}
              >
                {t(`community.chat.search`)}
              </Text>
            </SearchInput>
          </SearchInputContainer>
          <TouchableRipple
            ref={hideSensitiveView}
            style={{
              height: RFValue(70),
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15
            }}
            rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
            onPress={handleMessageNavigation}
          >
            <Fragment>
              <IconContainer>
                <FontAwesome name="users" size={30} color={colors.PRIMARY} />
              </IconContainer>

              <NameContainer ref={hideSensitiveView}>
                <Title
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    textTransform: 'capitalize'
                  }}
                >
                  {t(`community.chat.newGroup`)}
                </Title>
              </NameContainer>
            </Fragment>
          </TouchableRipple>
          <TouchableRipple
            ref={hideSensitiveView}
            style={{
              height: RFValue(70),
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15
            }}
            rippleColor={hexToRGB(colors.PRIMARY, 0.1)}
            onPress={() => navigation.navigate('CreateChannelTribeScreen')}
          >
            <Fragment>
              <IconContainer>
                <Feather name="hash" size={30} color={colors.PRIMARY} />
              </IconContainer>

              <NameContainer ref={hideSensitiveView}>
                <Title
                  style={{
                    color: colors.PRIMARY_TEXT,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    fontSize: RFValue(fonts.LARGE_SIZE - 2),
                    textTransform: 'capitalize'
                  }}
                >
                  {t(`community.chat.newChannel`)}
                </Title>
              </NameContainer>
            </Fragment>
          </TouchableRipple>
        </FilterContainer>

        {!loading ? (
          <FlatList
            bounces={false}
            data={filteredUsers}
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
                There are no members at this time
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
