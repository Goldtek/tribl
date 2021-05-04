import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchInput, { createFilter } from 'react-native-search-filter';
//@ts-ignore
import { FlatFeed, Activity } from 'expo-activity-feed';
import { useThemeContext } from '../../../../../theme';
import { NavigationInterface } from '../../../../types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import { chatClient } from '../../../../../stream/types';
import ActivityCard from '../activityCard';

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

  const CustomActivity = (props: any) => {
    return (
      <Activity
        {...props}
        Header={null}
        Content={
          <ActivityCard
            message={props.activity.message}
            timeStamp={props.activity.time}
            activityType={props?.activity?.activityType}
            userAvatar={props?.activity?.passport?.avatar}
            tribeAvatar={props?.activity?.community?.avatar}
          />
        }
      />
    );
  };

  return (
    <Container>
      {/* <SearchInput
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
      /> */}
      <FlatFeed
        feedGroup="timeline"
        userId={chatClient.user?.id}
        Activity={CustomActivity}
      />
    </Container>
  );
}
