import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';

import { chatClient, StreamContext, ChannelType, ThreadType } from './types';

const StreamProvider: FunctionComponent = ({ children }) => {
  const [channel, setChannel] = useState<ChannelType>({} as ChannelType);
  const [thread, setThread] = useState<ThreadType>({} as ThreadType);

  useEffect(() => {
    const user = {
      id: 'vishal',
      name: 'Vishal Narkhede',
      image: 'https://ca.slack-edge.com/T02RM6X6B-UHGDQJ8A0-31658896398c-512',
      value: 'vishal'
    };

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidmlzaGFsIn0.LpDqH6U8V8Qg9sqGjz0bMQvOfWrWKAjPKqeODYM0Elk`;

    // Initializes Stream's chat client.
    // Documentation: https://getstream.io/chat/docs/init_and_users/?language=js
    const initChat = async () => {
      const r = await chatClient.connectUser(user, token);
      console.log(r);

      // We are going to store chatClient in following ChatClientService, so that it can be
      // accessed in other places. Ideally one would store client in a context provider, so that
      // component can re-render if client is updated. But in our case, client only gets updated
      // when chat user is switched - and which case we re-render the entire chat application.
      // So we don't need to worry about re-rendering every component on updating client.
    };

    initChat();

    return () => {
      chatClient.disconnect();
    };
  }, []);

  return (
    <StreamContext.Provider value={{ channel, thread, setChannel, setThread }}>
      {children}
    </StreamContext.Provider>
  );
};

export const useStreamContext = () => useContext(StreamContext);

export default StreamProvider;
