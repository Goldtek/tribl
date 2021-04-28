import React, { useEffect, useState } from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import SearchInput, { createFilter } from 'react-native-search-filter';
//@ts-ignore
import { FlatFeed } from 'expo-activity-feed';
import { useThemeContext } from '../../../../../theme';
import { NavigationInterface } from '../../../../types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import { chatClient } from '../../../../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface GeneralSlideProp extends NavigationInterface {}

export default function GeneralSlide(props: GeneralSlideProp) {
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();

  const [search, setSearch] = useState({ searchTerm: '' });

  useEffect(() => {
    tagScreenName('NotificationScreen');
  }, []);

  const searchUpdated = (text: string) => setSearch({ searchTerm: text });

  const KeysToFilter = [
    'sender.firstName',
    'sender.lastName',
    'community.name'
  ];

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
      <Title
        style={{
          color: colors.PRIMARY_TEXT,
          fontFamily: fonts.WORK_SANS_SEMI_BOLD,
          fontSize: RFValue(fonts.LARGE_SIZE),
          marginTop: RFValue(20),
          marginLeft: RFValue(10),
          textTransform: 'capitalize'
        }}
      >
        General Notification
      </Title>
      <FlatFeed
        feedGroup="activities_notification"
        userId={chatClient.user?.id}
      />
    </Container>
  );
}
