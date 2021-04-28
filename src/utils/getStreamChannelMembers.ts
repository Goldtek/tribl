import { ChannelType } from '../stream/types';

export default function getStreamChannelMembers(channel: ChannelType) {
  if (!channel.state) return;

  const members = Object?.values(channel?.state?.members.asMutable());

  return members.map((member) => ({
    avatar: member.user?.image,
    ...member.user
  }));
}
