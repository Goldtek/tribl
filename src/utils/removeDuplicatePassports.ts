import { PassportInterface } from '../graphql/types';
import { chatClient } from '../stream/types';

const removeDuplicateMembers = (members?: PassportInterface[]) => {
  if (!members) return;

  const userId = chatClient.user?.id;

  const uniqueMembers: PassportInterface[] = [];
  const hashMap: { [key: string]: string } = {};
  let index = 0;

  for (index; index < members.length; index++) {
    const member = members[index];
    if (!hashMap[member.id]) {
      hashMap[member.id] = member.id;
      if (member.id !== userId && member.verified) {
        uniqueMembers.push(member);
      }
    }
  }

  return uniqueMembers;
};

export default removeDuplicateMembers;
