// import React, { Fragment } from 'react';
// import { useTranslation } from 'react-i18next';
// import { RFValue } from 'react-native-responsive-fontsize';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { useThemeContext } from '../../../theme';
// import DirectMessageTab from './directMessageTab';
// import ChannelsTab from './channelsTab';
import { StatusBar } from 'expo-status-bar';
// import { GLOBAL_HEADER_STYLE } from '../../../constants';
// import { DEVICE_FULL_WIDTH } from '../../../utils/device';

// const Tab = createMaterialTopTabNavigator();

// export default function InboxScreen() {
//   const { colors, fonts } = useThemeContext();
//   const { t } = useTranslation();

//   return (
//     <Fragment>
//       <StatusBar translucent animated style="dark" />
//       <Tab.Navigator
//         tabBarOptions={{
//           scrollEnabled: true,
//           labelStyle: {
//             fontFamily: fonts.WORK_SANS_BOLD,
//             fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
//             color: colors.PRIMARY_TEXT,
//             textTransform: 'capitalize',
//             marginHorizontal: 0
//           },
//           indicatorStyle: {
//             backgroundColor: colors.PRIMARY,
//             height: RFValue(4)
//           },
//           tabStyle: { width: DEVICE_FULL_WIDTH / 2 },
//           style: { ...GLOBAL_HEADER_STYLE, paddingTop: RFValue(10) }
//         }}
//         sceneContainerStyle={{ flex: 1, backgroundColor: colors.WHITE }}
//         style={{ flex: 1, backgroundColor: colors.WHITE }}
//       >
//         <Tab.Screen
//           name="DirectMessageTab"
//           component={DirectMessageTab}
//           options={{ tabBarLabel: t('community.chat.message') }}
//         />
//         <Tab.Screen
//           name="ChannelsTab"
//           component={ChannelsTab}
//           options={{ tabBarLabel: t('community.chat.channels') }}
//         />
//       </Tab.Navigator>
//     </Fragment>
//   );
// }

import React, { useEffect } from 'react';
import CustomChannelPreview from './widget';
import { NavigationInterface } from '../../types';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { ChannelList, Chat, DefaultCommandType } from 'stream-chat-expo';
import { useQuery } from '@apollo/react-hooks';
import {
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType,
  chatClient
} from '../../../stream/types';
import { ChannelSort } from 'stream-chat';
import { useStreamContext } from '../../../stream';
import { MyPassportInterface } from '../../../graphql/types';
import { GET_USER_PASSPORT } from '../../../graphql/server/query';

import { Container } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function ChannelsTab(props: ScreenProp) {
  const { setChannel, setActivityScreen } = useStreamContext();

  const { data: userData } = useQuery<MyPassportInterface>(GET_USER_PASSPORT);

  const filters = {
    members: { $in: [userData?.myPassport.id] },
    type: 'team'
  };

  const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

  const options = { presence: true, state: true, watch: true };

  useEffect(() => {
    tagScreenName('ChannelsTab');
  }, []);

  return (
    <Chat
      // @ts-ignore
      client={chatClient}
    >
      <StatusBar translucent animated style="dark" />
      <Container>
        <ChannelList<
          LocalAttachmentType,
          LocalChannelType,
          DefaultCommandType,
          LocalEventType,
          LocalMessageType,
          LocalReactionType,
          LocalUserType
        >
          // @ts-ignore
          filters={filters}
          onSelect={(channel) => {
            setChannel(channel as any);
            setActivityScreen('channelScreen');
          }}
          sort={sort}
          options={options}
          Preview={CustomChannelPreview}
          additionalFlatListProps={{ showsVerticalScrollIndicator: false }}
        />
      </Container>
    </Chat>
  );
}

export default React.memo(ChannelsTab);
