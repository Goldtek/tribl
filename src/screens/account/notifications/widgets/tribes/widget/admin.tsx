import React from 'react';
//@ts-ignore
import { FlatFeed, Activity } from 'expo-activity-feed';
import ActivityCard from '../../activityCard';
import { chatClient } from '../../../../../../stream/types';

export default function Admin() {
  const AdminCustomActivity = (props: any) => {
    if (
      props?.activity?.isAdmin == true &&
      props?.activity?.tab === 'COMMUNITY'
    ) {
      return (
        <Activity
          {...props}
          Header={null}
          Content={
            <ActivityCard
              activityType={props?.activity?.activityType}
              userAvatar={props?.activity?.passport?.avatar}
              tribeAvatar={props?.activity?.community?.avatar}
              message={props.activity.message}
              timeStamp={props.activity.time}
            />
          }
        />
      );
    } else {
      return null;
    }
  };
  return (
    <FlatFeed
      feedGroup="timeline"
      userId={chatClient.user?.id}
      Activity={AdminCustomActivity}
    />
  );
}
