import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { NavigationInterface } from '../../../../types';
import { Title, Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import { useThemeContext } from '../../../../../theme';
import MemberCard from './widget';
import FriendCard from './widget/friends';
import MembersData from '../../../../../libs/recommendedUsers/index.json';
import FriendsData from '../../../../../libs/friends/index.json';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface MemberScreenProp extends NavigationInterface {}

export default function MemberSlide(props: MemberScreenProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const onChangeSearch = (query: any) => setSearch(query);

  return (
    <Container>
      <Searchbar
        placeholder={t(`community.tabPanel.search`)}
        onChange={onChangeSearch}
        value={search}
        style={{
          marginLeft: RFValue(15),
          marginRight: RFValue(15),
          fontFamily: fonts.WORK_SANS_REGULAR,
          fontSize: RFValue(fonts.LARGE_SIZE),
          color: colors.SECONDARY_TEXT,
          elevation: 0,
          borderColor: colors.INACTIVE,
          borderRadius: 4,
          borderWidth: 1
        }}
        iconColor={colors.PRIMARY_TEXT}
      />
      <Title
        style={{
          color: colors.PRIMARY_TEXT,
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          marginTop: RFValue(20),
          marginBottom: RFValue(10),
          textTransform: 'capitalize'
        }}
      >
        {t(`community.tabPanel.memberTitle`)}
      </Title>
      {FriendsData.length ? (
        <FlatList
          renderItem={({ item, index }) => (
            <FriendCard
              {...item}
              {...props}
              key={index}
              name={item.name}
              lastSeen={item.lastSeen}
              avatar={item.avatar}
            />
          )}
          data={FriendsData}
          keyExtractor={(_item, index) => index.toString()}
        />
      ) : null}
      <FlatList
        renderItem={({ item, index }) => (
          <MemberCard
            {...item}
            {...props}
            key={index}
            name={item.name}
            lastSeen={item.lastSeen}
            avatar={item.avatar}
          />
        )}
        data={MembersData}
        keyExtractor={(_item, index) => index.toString()}
      />
    </Container>
  );
}
