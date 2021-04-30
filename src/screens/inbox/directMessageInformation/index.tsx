//@ts-nocheck
import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { NavigationInterface } from '../../types';
import {
  Text,
  Divider,
  IconButton,
  ActivityIndicator
} from 'react-native-paper';
import { Switch, View, Modal, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons, Entypo, Octicons, AntDesign } from '@expo/vector-icons';
import { ImageHeaderScrollView } from 'react-native-image-header-scroll-view';
import { crashlytics } from '../../../firebase/config';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { useStreamContext } from '../../../stream';
import { chatClient } from '../../../stream/types';
import { Mixpanel } from '../../../config';
import ReportModal from '../../../components/reportModal';

// IMPORT FOR ALL CUSTOM STYLES
import {
  Overlay,
  LeftCover,
  Container,
  RightCover,
  OptionWrapper,
  LoaderMessage,
  HeaderContainer,
  ModalContentWrapper
} from './styles';

// DEFINE SCREEN PROP TYPES
interface GroupInformationProp extends NavigationInterface {}

const H_MAX_HEIGHT = 300;
const H_MIN_HEIGHT = 70;

export default function DirectMessageInformation(props: GroupInformationProp) {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { channel } = useStreamContext();
  const { colors, fonts } = useThemeContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    tagScreenName('DirectMessageInformation');
    Mixpanel.track('Direct Message Information', {
      info: `User views direct message information`,
      'Activity Screen': 'Direct Message Information Screen'
    });
  }, []);

  const getMuteStatus = channel?.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);

  const user = Object?.values(channel?.state?.members).find(
    ({ user }) => user?.id !== chatClient.user?.id
  );

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

  const handleLeaveDM = () => {
    Alert.alert(
      'Delete conversation',
      `Are you sure you want to delete this conversation`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              setLoading(true);
              await channel.removeMembers([`${chatClient.user?.id}`]);
              setLoading(false);
              navigation.navigate('InboxScreen');
            } catch (error) {
              setLoading(false);
              crashlytics.recordError(new Error(error));
              crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
            }
          }
        }
      ]
    );
  };

  const inviteTribeNavigation = () => {
    navigation.navigate('InviteToTribeFromProfileScreen', {
      memberId: chatClient.user?.id
    });
  };

  const inviteChannelNavigation = () => {
    navigation.navigate('InviteToChannelFromProfileScreen', {
      memberId: chatClient.user?.id
    });
  };

  const [reportModalVisible, setReportModalVisible] = useState(false);

  const showReportModal = useCallback(
    (visible: boolean) => () => {
      setReportModalVisible(visible);
      return true;
    },
    []
  );

  return (
    <Container>
      <ImageHeaderScrollView
        maxHeight={H_MAX_HEIGHT}
        minHeight={H_MIN_HEIGHT}
        headerImage={{ uri: user?.user?.image }}
        maxOverlayOpacity={0.6}
        minOverlayOpacity={0.3}
        fadeOutForeground
        renderHeader={() => (
          <FastImage
            source={{
              uri: user?.user?.image,
              priority: FastImage.priority.high
            }}
            resizeMode={FastImage.resizeMode.stretch}
            style={{ width: '100%', height: '100%' }}
          />
        )}
        renderForeground={() => (
          <HeaderContainer>
            <IconButton
              icon={(iconProps) => (
                <Ionicons
                  {...iconProps}
                  name="md-arrow-back"
                  color={colors.WHITE}
                />
              )}
              borderless
              onPress={navigation.goBack}
            />
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.WORK_SANS_BOLD,
                fontSize: fonts.LARGE_SIZE + 5,
                color: colors.WHITE,
                marginHorizontal: 10,
                textTransform: 'capitalize'
              }}
            >
              {user?.user?.name}
            </Text>
          </HeaderContainer>
        )}
      >
        <View>
          <Divider style={{ backgroundColor: colors.INPUT, height: 5 }} />
          <OptionWrapper onPress={inviteTribeNavigation}>
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
                {t(`community.invitation.inviteTribe`)}
              </Text>
            </LeftCover>
          </OptionWrapper>
          <Divider style={{ backgroundColor: colors.INPUT }} />
          <OptionWrapper onPress={inviteChannelNavigation}>
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
                {t(`community.invitation.inviteChannel`)}
              </Text>
            </LeftCover>
          </OptionWrapper>
          <Divider style={{ backgroundColor: colors.INPUT }} />
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

          <OptionWrapper onPress={handleLeaveDM}>
            <LeftCover>
              <Octicons
                name="sign-out"
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
                {t(`community.chat.leaveDm`)}
              </Text>
            </LeftCover>
          </OptionWrapper>
          <Divider style={{ backgroundColor: colors.INPUT }} />

          {/* <OptionWrapper onPress={handleLeaveGroup}>
            <LeftCover>
              <Entypo
                name="block"
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
                {t(`community.chat.blockDm`)}
              </Text>
            </LeftCover>
          </OptionWrapper> */}

          <Divider style={{ backgroundColor: colors.INPUT }} />
          <OptionWrapper onPress={showReportModal(true)}>
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
                {t(`community.chat.reportDM`)}
              </Text>
            </LeftCover>
          </OptionWrapper>
          <Divider style={{ backgroundColor: colors.INPUT }} />
        </View>
      </ImageHeaderScrollView>
      <Modal animationType="fade" visible={loading} transparent>
        <Overlay>
          <ModalContentWrapper>
            <ActivityIndicator size="small" color={colors.BLACK} />
            <LoaderMessage>Leaving conversation...</LoaderMessage>
          </ModalContentWrapper>
        </Overlay>
      </Modal>
      <ReportModal
        data={route?.params}
        closeReportModal={showReportModal(false)}
        isVisible={reportModalVisible}
      />
    </Container>
  );
}
