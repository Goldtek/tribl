import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_USER_PASSPORT } from '../graphql/server/query';
import { GENERATE_STREAMS_TOKEN } from '../graphql/server/mutations';
import {
  GenerateStreamsTokenRequestInterface,
  MyPassportInterface
} from '../graphql/types';
import { crashlytics } from '../firebase/config';

import { chatClient, StreamContext, ChannelType, ThreadType } from './types';

const StreamProvider: FunctionComponent = ({ children }) => {
  const [channel, setChannel] = useState<ChannelType>({} as ChannelType);
  const [thread, setThread] = useState<ThreadType>({} as ThreadType);

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const [authenticateStream] = useMutation<
    GenerateStreamsTokenRequestInterface
  >(GENERATE_STREAMS_TOKEN);

  useEffect(() => {
    if (userData?.myPassport) {
      const user = {
        id: `${userData?.myPassport.id}`,
        image: `${userData?.myPassport.avatar}`,
        name: `${userData?.myPassport.firstName} ${userData?.myPassport.firstName}`,
        value: `${userData?.myPassport.firstName} ${userData?.myPassport.firstName}`
      };

      // Initializes Stream's chat client.
      // Documentation: https://getstream.io/chat/docs/init_and_users/?language=js
      const initChat = async () => {
        try {
          await chatClient.connectUser(
            user,
            //@ts-ignore
            async () => {
              const { data } = await authenticateStream();
              return data?.generateStreamsToken.streams_token;
            }
          );
        } catch (error) {
          crashlytics.recordError(Error(error.message));
        }
      };

      initChat();
    }

    return () => {
      chatClient.disconnect();
    };
  }, [userData?.myPassport]);

  return (
    <StreamContext.Provider value={{ channel, thread, setChannel, setThread }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStreamContext = () => useContext(StreamContext);

export default StreamProvider;
