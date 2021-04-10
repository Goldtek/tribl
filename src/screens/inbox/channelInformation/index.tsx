import React, { Fragment, useEffect, useState } from 'react';
import { NavigationInterface } from '../../types';
import {
  Text,
  TouchableRipple,
  Paragraph,
  Divider,
  ActivityIndicator
} from 'react-native-paper';
import { Switch, Alert, ScrollView, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { AntDesign, Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { LEAVE_COMMUNITY_CHANNEL } from '../../../graphql/server/mutations';
import { useThemeContext } from '../../../theme';
import { useMutation } from '@apollo/react-hooks';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { useStreamContext } from '../../../stream';
import { crashlytics } from '../../../firebase/config';
import { Mixpanel } from '../../../config';
import { chatClient } from '../../../stream/types';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Overlay,
  LeftCover,
  Container,
  RightCover,
  OptionWrapper,
  LoaderMessage,
  HeaderContainer,
  ModalContentWrapper,
  HeaderTitleContainer,
  ChannelInformationContainer
} from './styles';

// DEFINE SCREEN PROP TYPES
interface MyChannelInformationProp extends NavigationInterface {}

export default function ChannelInformation(props: MyChannelInformationProp) {
  const { navigation } = props;

  const { t } = useTranslation();
  const { channel } = useStreamContext();
  const { colors, fonts } = useThemeContext();
  const [loading, setLoading] = useState(false);

  const [leaveChannel] = useMutation(LEAVE_COMMUNITY_CHANNEL);

  useEffect(() => {
    tagScreenName('ChannelInformationScreen');
    Mixpanel.track('Channel Information', {
      info: `User views channel information`,
      'Activity Screen': 'Channel Information Screen'
    });
  }, []);

  const getMuteStatus = channel.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);

  const channelCreationDate = new Date(
    channel.data?.created_at as string
  ).toDateString();

  const toggleMute = async () => {
    try {
      if (muted) {
        await channel.unmute();
        setMuted(false);
      } else {
        await channel.mute();
        setMuted(true);
      }
    } catch {
      setMuted(getMuteStatus);
    }
  };

  const handleLeaveChannel = async () => {
    Alert.alert('Leave group', `Are you sure you want to leave this group`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Leave',
        onPress: async () => {
          try {
            setLoading(true);
            await channel.removeMembers([`${chatClient.user?.id}`]);
            setLoading(false);
            navigation.navigate('InboxScreen');
            leaveChannel({
              variables: { payload: { channelId: channel.id } }
            });
          } catch (error) {
            setLoading(false);
            crashlytics.recordError(new Error(error));
          }
        }
      }
    ]);
  };

  const handleReportChannel = async () => {
    // await leaveChannel({ variables: { payload: { channelId: channel.id } } });
    // navigation.goBack();
  };

  return (
    <Container>
      <HeaderContainer>
        <TouchableRipple
          onPress={navigation.goBack}
          style={{
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 40 / 2,
            marginRight: 10
          }}
        >
          <Ionicons name="md-arrow-back" size={24} color={colors.PRIMARY} />
        </TouchableRipple>

        <HeaderTitleContainer>
          <Paragraph
            style={{
              fontSize: fonts.MEDIUM_SIZE + 2,
              fontFamily: fonts.WORK_SANS_BOLD,
              marginHorizontal: 5,
              textTransform: 'capitalize'
            }}
          >
            {t(`community.chat.channelInformation`)}
          </Paragraph>
        </HeaderTitleContainer>
      </HeaderContainer>

      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingVertical: 70 }}
        showsVerticalScrollIndicator={false}
      >
        <FastImage
          source={{
            uri: channel.data?.image || channel.data?.community.avatar,
            priority: FastImage.priority.high
          }}
          style={{ width: '100%', height: RFValue(220) }}
          resizeMode={FastImage.resizeMode.stretch}
        />

        <ChannelInformationContainer>
          <Text
            style={{
              fontFamily: fonts.WORK_SANS_SEMI_BOLD,
              fontSize: RFValue(fonts.LARGE_SIZE + 1),
              color: colors.PRIMARY,
              textTransform: 'capitalize'
            }}
          >
            {`#${channel.data?.name}`}
          </Text>
          <Paragraph
            style={{
              fontSize: fonts.MEDIUM_SIZE + 2,
              fontFamily: fonts.WORK_SANS_MEDIUM
            }}
          >
            {t(`community.chat.createdBy`)} {channelCreationDate}
          </Paragraph>
        </ChannelInformationContainer>

        <Divider style={{ backgroundColor: colors.INPUT, height: 10 }} />
        <OptionWrapper onPress={toggleMute}>
          <Fragment>
            <LeftCover>
              <Ionicons
                name="ios-notifications-outline"
                size={25}
                color={colors.PRIMARY}
                style={{ paddingRight: RFValue(10) }}
              />
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: fonts.LARGE_SIZE,
                  color: colors.PRIMARY_TEXT
                }}
              >
                {t(`community.chat.muteNotifications`)}
              </Text>
            </LeftCover>
            <RightCover>
              <Switch
                trackColor={{ false: colors.DISABLED, true: colors.PRIMARY }}
                thumbColor={colors.WHITE}
                ios_backgroundColor={colors.DISABLED}
                onValueChange={toggleMute}
                value={muted}
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
              />
            </RightCover>
          </Fragment>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />

        <OptionWrapper
          onPress={() => navigation.navigate('ChannelMembersScreen')}
        >
          <Fragment>
            <LeftCover>
              <Feather
                name="users"
                size={20}
                color={colors.PRIMARY}
                style={{ paddingRight: RFValue(10) }}
              />
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: fonts.LARGE_SIZE,
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize'
                }}
              >
                {t(`community.chat.members`)}
              </Text>
            </LeftCover>
            <RightCover>
              <Text
                style={{
                  fontFamily: fonts.WORK_SANS_REGULAR,
                  fontSize: fonts.LARGE_SIZE,
                  color: colors.PRIMARY_TEXT,
                  paddingRight: RFValue(10)
                }}
              >
                {`${channel.data?.member_count}`}
              </Text>
              <AntDesign name="right" size={20} color={colors.PRIMARY_TEXT} />
            </RightCover>
          </Fragment>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />

        <OptionWrapper
          onPress={() => navigation.navigate('InvitationToChannelScreen')}
        >
          <LeftCover>
            <AntDesign
              name="addusergroup"
              size={20}
              color={colors.PRIMARY}
              style={{ paddingRight: RFValue(10) }}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT
              }}
            >
              {t(`community.chat.inviteToChannel`)}
            </Text>
          </LeftCover>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />

        <OptionWrapper onPress={handleLeaveChannel}>
          <LeftCover>
            <Entypo
              name="log-out"
              size={20}
              color={colors.RED}
              style={{ paddingRight: RFValue(10) }}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT
              }}
            >
              {t(`community.chat.leaveChannel`)}
            </Text>
          </LeftCover>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />

        <OptionWrapper onPress={handleReportChannel}>
          <LeftCover>
            <Entypo
              name="thumbs-down"
              size={20}
              color={colors.RED}
              style={{ paddingRight: RFValue(10) }}
            />
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_REGULAR,
                fontSize: fonts.LARGE_SIZE,
                color: colors.PRIMARY_TEXT
              }}
            >
              {t(`community.chat.reportChannel`)}
            </Text>
          </LeftCover>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />
      </ScrollView>

      <Modal animationType="fade" visible={loading} transparent>
        <Overlay>
          <ModalContentWrapper>
            <ActivityIndicator size="small" color={colors.BLACK} />
            <LoaderMessage>Leaving channel...</LoaderMessage>
          </ModalContentWrapper>
        </Overlay>
      </Modal>
    </Container>
  );
}
