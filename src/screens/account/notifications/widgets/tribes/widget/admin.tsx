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
              payment={props?.activity?.payment}
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
