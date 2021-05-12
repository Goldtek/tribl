import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ChannelList, Chat, DefaultCommandType } from 'stream-chat-expo';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import { ChannelSort } from 'stream-chat';
import { useTranslation } from 'react-i18next';
import CustomChannelPreview from './widget';
import { NavigationInterface } from '../../../types';
import { tagScreenName } from '../../../../utils/uxcamHelper';
import EmptyMessageState from '../../../../components/emptyMessageState';
import LoadingIndicatorState from '../../../../components/loadingIndicatorState';
import LoadingErrorIndicator from '../../../../components/loadingErrorIndicatorState';
import {
  LocalAttachmentType,
  LocalChannelType,
  LocalEventType,
  LocalMessageType,
  LocalReactionType,
  LocalUserType,
  chatClient
} from '../../../../stream/types';
import GradientButton from '../../../../components/gradientButton';
import { useThemeContext } from '../../../../theme';

import { Container, ButtonWrapper } from './styles';

// DEFINE SCREEN PROP TYPES
interface ScreenProp extends NavigationInterface {}

function DirectMessageTab(props: ScreenProp) {
  const { navigation } = props;
  const { fonts, colors } = useThemeContext();
  const { t } = useTranslation();

  const filters = {
    members: { $in: [chatClient.user?.id] },
    $or: [{ isDm: true }, { isGroup: true }],
    last_message_at: { $gt: new Date(2021, 1, 1) },
    type: 'team'
  };

  const sort: ChannelSort<LocalChannelType> = { last_message_at: -1 };

  const options = { presence: true, state: true, watch: true };

  useEffect(() => {
    tagScreenName('DirectMessageTab');
  }, []);

  const navigateToCreateNewGroupScreen = () => {
    navigation.navigate('DrawerScreen', {
      screen: 'SelectGroupParticipantsScreen'
    });
  };

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
          sort={sort}
          // @ts-ignore
          filters={filters}
          options={options}
          Preview={CustomChannelPreview}
          EmptyStateIndicator={EmptyMessageState}
          LoadingIndicator={LoadingIndicatorState}
          LoadingErrorIndicator={LoadingErrorIndicator}
          additionalFlatListProps={{ showsVerticalScrollIndicator: false }}
        />
      </Container>
      <ButtonWrapper>
        <GradientButton
          onPress={navigateToCreateNewGroupScreen}
          labelStyle={{
            fontSize: RFValue(fonts.MEDIUM_SIZE),
            fontFamily: fonts.WORK_SANS_SEMI_BOLD,
            textTransform: 'capitalize',
            color: colors.WHITE
          }}
          gradientContainerstyle={{
            height: RFValue(30),
            width: RFPercentage(35),
            borderRadius: RFValue(15)
          }}
          contentStyle={{
            width: '100%',
            height: '100%',
            borderRadius: RFValue(15)
          }}
          style={{
            height: RFValue(30),
            borderRadius: RFValue(15)
          }}
        >
          {t(`community.chat.createNewGroup`)}
        </GradientButton>
      </ButtonWrapper>
    </Chat>
  );
}

export default React.memo(DirectMessageTab);
