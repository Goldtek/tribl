import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation, useNavigationState } from '@react-navigation/core';
import EmptyMessageIcon from '../../../assets/icons/emptyMessageIcon';
import { logEvent } from '../../utils/uxcamHelper';
import ENVIRONMENT_VARIABLES, { Mixpanel } from '../../config';

import { Text, NewMessageText, NewChatButton, EmptyContainer } from './styles';

export default function EmptyMessageState() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { routeNames, index } = useNavigationState((state) => state);
  const activeTab = routeNames[index];

  const showSearchScreen = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'CommunityAlgoliaScreen',
      params: { indexName: ENVIRONMENT_VARIABLES.ALGOLIA_COMMUNITY_INDEX_NAME }
    });

    Mixpanel.track('User Taps Chat Button', {
      info: `User taps chat icon on channel message tab`,
      'Activity Screen': 'Inbox Screen'
    });
    logEvent('tap chat icon', { from: 'chat' });
  };

  const handleNavigation = () => {
    navigation.navigate('DrawerScreen', { screen: 'NewMessageScreen' });
    Mixpanel.track('User Taps Chat Button', {
      info: `User taps chat icon on direct message tab`,
      'Activity Screen': 'Inbox Screen'
    });
    logEvent('tap chat icon', { from: 'chat' });
  };

  return (
    <EmptyContainer>
      <EmptyMessageIcon style={{ marginLeft: 10 }} />
      <Text>
        {t(
          `community.chat.${
            activeTab === 'DirectMessageTab' ? 'emptyMessage' : 'emptyChannel'
          }`
        )}
      </Text>
      <NewChatButton
        onPress={
          activeTab === 'DirectMessageTab' ? handleNavigation : showSearchScreen
        }
      >
        <NewMessageText>
          {t(
            `community.chat.${
              activeTab === 'DirectMessageTab' ? 'newMessage' : 'startChannel'
            }`
          )}
        </NewMessageText>
      </NewChatButton>
    </EmptyContainer>
  );
}
