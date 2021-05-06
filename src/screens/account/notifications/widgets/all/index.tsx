import React, { useEffect } from 'react';
//@ts-ignore
import { FlatFeed, Activity } from 'expo-activity-feed';
import { NavigationInterface } from '../../../../types';
import { tagScreenName } from '../../../../../utils/uxcamHelper';
import { chatClient } from '../../../../../stream/types';
import ActivityCard from '../activityCard';

// IMPORT FOR ALL CUSTOM STYLES
import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface GeneralSlideProp extends NavigationInterface {}

export default function GeneralSlide(props: GeneralSlideProp) {
  useEffect(() => {
    tagScreenName('NotificationScreen');
  }, []);

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
