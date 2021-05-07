import React, { useEffect, useState } from 'react';
import { Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
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
interface ConnectionSlideProp extends NavigationInterface {}

export default function ConnectionSlide(props: ConnectionSlideProp) {
  useEffect(() => {
    tagScreenName('NotificationScreen');
  }, []);

  const CustomActivity = (props: any) => {
    if (props?.activity?.tab === 'CONNECTION') {
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
              messageType={props?.activity?.messageType}
              channelName={props?.activity?.channel?.name}
              tribeName={props?.activity?.community?.name}
              userName={props?.activity?.passport?.name}
              userID={props?.activity?.passport?.id}
              tribeID={props?.activity?.community?.id}
              count={props?.activity?.count}
              channelID={props?.activity?.channel?.id}
            />
          }
        />
      );
    } else {
      return null;
    }
  };

  return (
    <Container>
      <FlatFeed
        feedGroup="timeline"
        userId={chatClient.user?.id}
        Activity={CustomActivity}
      />
    </Container>
  );
}
