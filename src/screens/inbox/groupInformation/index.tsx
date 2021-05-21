import React, { Fragment, useEffect, useRef, useState } from 'react';
import { NavigationInterface } from '../../types';
import {
  Text,
  TouchableRipple,
  Paragraph,
  Divider,
  ActivityIndicator,
  Surface
} from 'react-native-paper';
import { Switch, ScrollView, Alert, Modal, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { AntDesign, Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { crashlytics } from '../../../firebase/config';
import { useThemeContext } from '../../../theme';
import { tagScreenName } from '../../../utils/uxcamHelper';
import { useStreamContext } from '../../../stream';
import { chatClient, LocalUserType } from '../../../stream/types';
import { Mixpanel } from '../../../config';
import { USER_DEFAULT_AVATAR } from '../../../constants';
import BrickList from 'react-native-masonry-brick-list';

// IMPORT FOR ALL CUSTOM STYLES
import {
  LeftCover,
  Overlay,
  Container,
  RightCover,
  OptionWrapper,
  LoaderMessage,
  HeaderContainer,
  ModalContentWrapper,
  HeaderImageContainer,
  HeaderTitleContainer,
  ChannelInformationContainer,
  CoverImageOverlay,
  InfoWrapper
} from './styles';
import EditGroupName from './widgets';
import { Modalize } from 'react-native-modalize';
import { useNavigation } from '@react-navigation/native';

// DEFINE SCREEN PROP TYPES
// interface GroupInformationProp extends NavigationInterface {}

interface GroupInformationProp extends LocalUserType {}

export default function GroupInformation(props: GroupInformationProp) {
  const user = props;

  const { t } = useTranslation();
  const navigation = useNavigation();
  const { channel } = useStreamContext();
  const { colors, fonts } = useThemeContext();
  const [loading, setLoading] = useState(false);
  const modalizeRef = useRef<Modalize>(null);
  const openModal = () => modalizeRef.current?.open();

  const groupAdmin = channel.data?.created_by;

  const isAdmin = groupAdmin?.id === chatClient.user?.id ? true : false;
  const displayEdit = user?.id !== chatClient.user?.id ? true : false;

  useEffect(() => {
    tagScreenName('GroupInformationScreen');
    Mixpanel.track('Group Information', {
      info: `User views group information`,
      'Activity Screen': 'Group Information Screen'
    });
  }, []);

  const getMuteStatus = channel?.muteStatus().muted;
  const [muted, setMuted] = useState(getMuteStatus);

  const channelMembers = Object.values(channel?.state?.members || {});

  const [images] = useState([
    {
      id: '1',
      name: channelMembers[0]?.user?.image,
      color: '#f44336',
      span: 1
    },
    {
      id: '2',
      name: channelMembers[channelMembers?.length - 2]?.user?.image,
      color: '#E91E63',
      span: 2
    },
    {
      id: '3',
      name: channelMembers[channelMembers?.length - 1]?.user?.image,
      color: '#9C27B0',
      span: 3
    },
    {
      id: '4',
      name: channelMembers[0]?.user?.image,
      color: '#673AB7',
      span: 1
    },
    {
      id: '5',
      name: channelMembers[channelMembers?.length - 2]?.user?.image,
      color: '#3F51B5',
      span: 1
    },
    {
      id: '6',
      name: channelMembers[channelMembers?.length - 1]?.user?.image,
      color: '#2196F3',
      span: 1
    },
    {
      id: '7',
      name: channelMembers[0]?.user?.image,
      color: '#03A9F4',
      span: 3
    },
    {
      id: '8',
      name: channelMembers[channelMembers?.length - 2]?.user?.image,
      color: '#00BCD4',
      span: 2
    },
    {
      id: '9',
      name: channelMembers[channelMembers?.length - 1]?.user?.image,
      color: '#009688',
      span: 1
    },
    {
      id: '10',
      name: channelMembers[0]?.user?.image,
      color: '#4CAF50',
      span: 1
    },
    {
      id: '11',
      name: channelMembers[channelMembers?.length - 2]?.user?.image,
      color: '#8BC34A',
      span: 2
    },
    {
      id: '12',
      name: channelMembers[channelMembers?.length - 2]?.user?.image,
      color: '#CDDC39',
      span: 3
    },
    {
      id: '13',
      name: channelMembers[0]?.user?.image,
      color: '#FFEB3B',
      span: 2
    },
    {
      id: '14',
      name: channelMembers[channelMembers?.length - 2]?.user?.image,
      color: '#FFC107',
      span: 1
    },
    {
      id: '15',
      name: channelMembers[channelMembers?.length - 1]?.user?.image,
      color: '#FF5722',
      span: 3
    }
  ]);

  const BrickImages = (prop: any) => {
    return (
      <Surface
        key={prop.id}
        style={{
          flex: 1,
          elevation: 10,
          borderRadius: 4
        }}
      >
        <FastImage
          resizeMode={FastImage.resizeMode.cover}
          source={{
            uri: prop.name || USER_DEFAULT_AVATAR,
            priority: FastImage.priority.high
          }}
          style={{
            flex: 1,
            width: undefined,
            height: undefined,
            borderRadius: 4
          }}
        />
        <CoverImageOverlay color={prop.color} />
      </Surface>
    );
  };

  const groupCreationDate = new Date(
    channel.data?.created_at as string
  ).toDateString();

  const toggleMute = async () => {
    Alert.alert('Mute group', `Are you sure you want to mute this group`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: 'Mute',
        onPress: async () => {
          try {
            if (muted) {
              await channel.unmute();
              setMuted(false);
            } else {
              await channel.mute();
              setMuted(true);
            }
          } catch (error) {
            setMuted(getMuteStatus);
            crashlytics.recordError(new Error(error));
            crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
          }
        }
      }
    ]);
  };

  const handleLeaveGroup = async () => {
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
            navigation.navigate('CommunityScreen', { screen: 'InboxScreen' });
          } catch (error) {
            setLoading(false);
            crashlytics.recordError(new Error(error));
            crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
          }
        }
      }
    ]);
  };

  const handleReportGroup = async () => {
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
            {t(`community.chat.groupInformation`)}
          </Paragraph>
        </HeaderTitleContainer>
      </HeaderContainer>

      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingVertical: RFValue(40) }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderImageContainer>
          <BrickList
            data={images}
            renderItem={(prop: any) => BrickImages(prop)}
            columns={6}
          />
        </HeaderImageContainer>

        <ChannelInformationContainer>
          <InfoWrapper>
            <Text
              style={{
                fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                fontSize: RFValue(fonts.LARGE_SIZE + 1),
                color: colors.PRIMARY,
                textTransform: 'capitalize'
              }}
            >
              {`${channel.data?.name}`}
            </Text>

            <Paragraph
              style={{
                fontSize: fonts.MEDIUM_SIZE,
                fontFamily: fonts.WORK_SANS_MEDIUM
              }}
            >
              {t(`community.chat.groupCreatedBy`)}{' '}
              {channel.data?.created_by.name}
              {`, ${groupCreationDate}`}
            </Paragraph>
          </InfoWrapper>
          {displayEdit && isAdmin && (
            <TouchableRipple onPress={openModal}>
              <Entypo name="edit" size={25} color={colors.PRIMARY} />
            </TouchableRipple>
          )}
        </ChannelInformationContainer>

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
        <OptionWrapper
          onPress={() => navigation.navigate('GroupMembersScreen')}
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
                {(channel?.data?.member_count as unknown) as string}
              </Text>
              <AntDesign name="right" size={20} color={colors.PRIMARY_TEXT} />
            </RightCover>
          </Fragment>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />
        <OptionWrapper
          onPress={() => navigation.navigate('AddMembersToGroupScreen')}
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
              {t(`community.chat.inviteToGroup`)}
            </Text>
          </LeftCover>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />
        <OptionWrapper onPress={handleLeaveGroup}>
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
              {t(`community.chat.leaveGroup`)}
            </Text>
          </LeftCover>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />
        <OptionWrapper onPress={handleReportGroup}>
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
              {t(`community.chat.reportGroup`)}
            </Text>
          </LeftCover>
        </OptionWrapper>
        <Divider style={{ backgroundColor: colors.INPUT }} />
      </ScrollView>
      <Modal animationType="fade" visible={loading} transparent>
        <Overlay>
          <ModalContentWrapper>
            <ActivityIndicator size="small" color={colors.BLACK} />
            <LoaderMessage>Leaving group...</LoaderMessage>
          </ModalContentWrapper>
        </Overlay>
      </Modal>
      <EditGroupName
        modalizeRef={modalizeRef}
        channel={channel}
        isAdmin={isAdmin}
        displayEdit={displayEdit}
        user={user}
      />
    </Container>
  );
}
