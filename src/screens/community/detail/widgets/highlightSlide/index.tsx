import React, { useState, Fragment, useMemo, useEffect } from 'react';
import { NavigationInterface } from '../../../../types';
import { Card, Title, Paragraph, Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ScrollView, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../theme';
import MembersCard from '../../../../../components/recommendedUser';
import ChannelCard from './widget/channelCard';
import ConnectedTribeCard from '../../../../../components/connectedTribes';
import {
  GET_SINGLE_COMMUNITY,
  GET_NEARBY_MEMBERS_OF_A_COMMUNITY,
  GET_COMMUNITY_MEMBERS,
  GET_USER_PASSPORT,
  GET_COMMUNITY_CHANNELS
} from '../../../../../graphql/server/query';
import RecommendedUserSkeleton from '../../../../../components/recommendedUserSkeleton';
import JoinCommunity from '../../../../../components/joinCommunity';
import {
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  JOIN_PRIVATE_COMMUNITY
} from '../../../../../graphql/server/mutations';
import {
  CommunityInterface,
  PassportInterface,
  CommunityMembersRequestInterface,
  CommunityChannelRequestInterface,
  ChannelInterface
} from '../../../../../graphql/types';
import { tagScreenName, logEvent } from '../../../../../utils/uxcamHelper';
import { Mixpanel } from '../../../../../config';
import TagModal from '../../../../../components/tagModal';
import storage from '../../../../../libs/storage';
import { crashlytics } from '../../../../../firebase/config';
import hexToRGB from '../../../../../utils/hexToRGB';
import ChannelSkeleton from '../../../../../components/channelSkeleton';
import { PAGINATION_DEFAULT } from '../../../../../constants';

import {
  Tags,
  TagText,
  Container,
  CardContainer,
  TextContainer,
  TagContainer
} from './styles';

interface singleCommunityScreenProp extends NavigationInterface {
  route: { communityDetails: CommunityInterface };
}

export default function singleCommunity(props: singleCommunityScreenProp) {
  const detail = props.route;
  const { communityDetails } = detail;
  const { id, name } = communityDetails;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({
    showJoinCommunityModal: false,
    tagModal: false
  });
  const [data, setData] = useState(communityDetails);
  const [member, setMember] = useState(false);
  const [request, setRequest] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(
    t(`community.recommended.join`)
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.isMember || member) {
      setButtonLabel(t(`community.recommended.leave`));
    } else if (request || data?.isRequested) {
      setButtonLabel(t(`community.tabPanel.request`));
    } else {
      setButtonLabel(t(`community.recommended.join`));
    }
  }, [data.isMember || member || request || data?.isRequested]);

  useEffect(() => {
    if (data.isMember || member) {
      setLoading(leaveLoading);
    } else if (data?.isPrivate) {
      setLoading(joinPrivateLoading);
    } else {
      setLoading(joinLoading);
    }
  }, [data.isMember || member || data?.isPrivate]);

  const clearTagModal = async () => {
    try {
      await storage.removeTagModal(id);
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const getTagModal = async () => {
    // @ts-ignore
    const TagInfo = await storage.checkTagModal();
    const filteredTag = TagInfo?.community.filter((tag: any) => tag == id);
    if (filteredTag.length && singleCommunity?.uniqueInterests.length > 0) {
      setState({ ...state, tagModal: true });
    }
  };

  useEffect(() => {
    tagScreenName('TribeHighlightScreen');
    getTagModal();
  }, []);

  const displayTagModal = (childData: boolean) => {
    setState({ ...state, tagModal: childData });
    clearTagModal();
  };

  const { data: communityData, refetch: communityRefetch } = useQuery(
    GET_SINGLE_COMMUNITY,
    {
      variables: { input: { filter: { id } } }
    }
  );

  const { data: channelData } = useQuery<CommunityChannelRequestInterface>(
    GET_COMMUNITY_CHANNELS,
    {
      variables: {
        input: {
          filter: { community: { id: id } },
          limit: PAGINATION_DEFAULT,
          skip: 0
        }
      }
    }
  );

  const { data: communityMembersData } = useQuery(
    GET_NEARBY_MEMBERS_OF_A_COMMUNITY,
    {
      variables: { input: { communityId: id } }
    }
  );

  const { data: NearbyMembers } = useQuery(GET_NEARBY_MEMBERS_OF_A_COMMUNITY);

  const { data: communityMembers } = useQuery<CommunityMembersRequestInterface>(
    GET_COMMUNITY_MEMBERS,
    { variables: { input: { filter: { communityId: id } } } }
  );

  const { data: userData } = useQuery(GET_USER_PASSPORT);
  const userDetails = userData?.myPassport;
  const userId = userDetails?.id;
  const myTribes = userDetails?.participantOf;

  const communityChannels = channelData?.Channel?.data;
  const singleCommunity = communityData?.Community?.data[0];
  const participants = communityMembers?.communityMembers?.data;
  const communityNearbyMembers = communityMembersData?.nearbyMembers?.data;
  const nearbyMembersData = NearbyMembers?.nearbyMembers?.data;
  const filteredParticipants = participants?.filter(
    (member) => member.id !== userId
  );

  const nearbyMembers = communityNearbyMembers?.length
    ? communityNearbyMembers
    : filteredParticipants?.length
    ? filteredParticipants
    : nearbyMembersData;

  useEffect(() => {
    if (!singleCommunity?.id) return;

    setData({ ...data, ...singleCommunity });
  }, [singleCommunity?.id]);

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  const _renderMyTribeItem = useMemo(
    () => ({ item }: { item: CommunityInterface }) => (
      <ConnectedTribeCard key={item.id} {...item} />
    ),
    []
  );

  const _renderRecommendedMember = useMemo(
    () => ({ item }: { item: PassportInterface }) => (
      <MembersCard key={item.id} {...item} />
    ),
    []
  );

  const _renderChannel = useMemo(
    () => ({ item }: { item: ChannelInterface }) => (
      <ChannelCard key={item.id} {...item} />
    ),
    []
  );

  const [joinCommunity, { loading: joinLoading }] = useMutation(
    JOIN_COMMUNITY,
    {
      variables: { payload: { communityId: id } }
    }
  );

  const [joinPrivateCommunity, { loading: joinPrivateLoading }] = useMutation(
    JOIN_PRIVATE_COMMUNITY,
    {
      variables: { payload: { communityId: id } }
    }
  );

  const [leaveCommunity, { loading: leaveLoading }] = useMutation(
    LEAVE_COMMUNITY,
    {
      variables: { payload: { communityId: id } }
    }
  );

  const handleJoin = async () => {
    logEvent('join community', { from: 'community' });
    try {
      Mixpanel.track('User Joins Tribe', {
        info: `User Joins ${name} Tribe`,
        'Activity Screen': 'Recommended Community Card'
      });
      await joinCommunity();

      if (data.uniqueInterests.length) {
        setState({ ...state, tagModal: true });
      }
      setMember(true);
      setData({ ...data, isMember: true });
      communityRefetch();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const handleJoinPrivateTribe = async () => {
    logEvent('request to join private community', { from: 'community' });
    try {
      Mixpanel.track('User Requests To Join Tribe', {
        info: `User Request To Join ${name} Tribe`,
        'Activity Screen': 'HignlightScreen'
      });
      await joinPrivateCommunity();
      setRequest(true);
      communityRefetch();
    } catch (error) {
      crashlytics.recordError(error);
    }
  };

  const handleLeave = async () => {
    logEvent('leave community', { from: 'community' });
    try {
      await leaveCommunity();
      setMember(false);
      clearTagModal();
      setData({ ...data, isMember: false });
      setState({ ...state, tagModal: false });
      communityRefetch();
    } catch (error) {
      crashlytics.recordError(new Error(error));
    }
  };

  const closeModal = () => {
    clearTagModal();
    setState({ ...state, tagModal: false });
  };

  return (
    <Fragment>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <Container>
          <Fragment>
            <Card style={{ height: RFValue(230) }}>
              <Card.Content
                style={{
                  paddingHorizontal: RFValue(5),
                  paddingVertical: RFValue(5)
                }}
              >
                <FastImage
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{
                    uri: singleCommunity?.avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{ width: '100%', height: '100%', borderRadius: 4 }}
                />
                <Text
                  style={{
                    fontSize: RFValue(fonts.LARGE_SIZE - 1),
                    fontFamily: fonts.WORK_SANS_REGULAR,
                    color: colors.BLACK,
                    backgroundColor: hexToRGB(colors.WHITE, 0.3),
                    position: 'absolute',
                    right: RFValue(15),
                    paddingHorizontal: RFValue(10),
                    paddingVertical: RFValue(5),
                    marginTop: RFValue(10),
                    textTransform: 'capitalize'
                  }}
                >
                  {singleCommunity?.isPrivate ? 'Private' : 'Public'}
                </Text>
              </Card.Content>
            </Card>
            <Card style={{ marginTop: RFValue(5) }}>
              <CardContainer>
                <FastImage
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{
                    uri: data.avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: RFValue(50),
                    height: RFValue(50),
                    borderRadius: 4
                  }}
                />
                <TextContainer>
                  <Title
                    style={{
                      color: colors.PRIMARY_TEXT,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE + 1),
                      lineHeight: RFValue(19)
                    }}
                  >
                    {data.name}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      lineHeight: RFValue(10),
                      color: colors.SECONDARY_TEXT
                    }}
                  >
                    {data.membersCount <= 1
                      ? `${data.membersCount} ${t(`community.tabPanel.member`)}`
                      : `${data.membersCount} ${t(
                          `community.tabPanel.member`
                        )}s`}
                  </Paragraph>
                  {data.description ? (
                    <Paragraph
                      style={{
                        fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        lineHeight: 18,
                        color: colors.PRIMARY_TEXT
                      }}
                    >
                      {data?.description}
                    </Paragraph>
                  ) : null}
                </TextContainer>
                <Button
                  mode="contained"
                  disabled={request || data?.isRequested ? true : false}
                  loading={loading}
                  onPress={
                    data.isMember || member
                      ? handleLeave
                      : data?.isPrivate
                      ? handleJoinPrivateTribe
                      : handleJoin
                  }
                  style={{
                    borderRadius: 4,
                    alignSelf: 'flex-start',
                    position: 'absolute',
                    right: RFValue(16),
                    top: RFValue(16)
                  }}
                  labelStyle={{
                    fontSize: fonts.MEDIUM_SIZE,
                    fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                    color:
                      request || data?.isRequested
                        ? colors.PRIMARY_TEXT
                        : colors.WHITE,
                    textTransform: 'capitalize'
                  }}
                >
                  {buttonLabel}
                </Button>
              </CardContainer>

              {data.tags?.length ? (
                <TagContainer>
                  <Title
                    style={{
                      fontFamily: fonts.WORK_SANS_BOLD,
                      fontSize: RFValue(fonts.MEDIUM_SIZE),
                      color: colors.PRIMARY_TEXT,
                      textTransform: 'uppercase'
                    }}
                  >
                    {t(`community.tabPanel.tag`)}
                  </Title>

                  <Tags>
                    {data?.tags.map((identity: any) => (
                      <TagText key={identity.id}>{identity.name}</TagText>
                    ))}
                  </Tags>
                </TagContainer>
              ) : null}
            </Card>
          </Fragment>
          <Card style={{ marginTop: RFValue(5) }}>
            <Card.Content style={{ paddingLeft: 0 }}>
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  marginTop: 0,
                  marginBottom: 0,
                  paddingLeft: 15
                }}
              >
                {t(`community.tabPanel.nearby`)}
              </Title>

              <FlatList
                data={nearbyMembers}
                horizontal={true}
                renderItem={_renderRecommendedMember}
                ListEmptyComponent={
                  <RecommendedUserSkeleton skeletonSize={4} />
                }
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 20,
                  paddingHorizontal: 15,
                  backgroundColor: colors.WHITE
                }}
              />
              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  marginTop: 0,
                  marginBottom: 0,
                  paddingLeft: 15
                }}
              >
                {t(`community.tabPanel.tribeChannels`)}
              </Title>

              <FlatList
                data={communityChannels}
                horizontal={true}
                renderItem={_renderChannel}
                ListEmptyComponent={<ChannelSkeleton skeletonSize={4} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 20,
                  paddingHorizontal: 15,
                  backgroundColor: colors.WHITE
                }}
              />

              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  marginTop: RFValue(20),
                  marginBottom: 0,
                  paddingLeft: 15
                }}
              >
                {t(`community.tabPanel.connectedTribes`)}
              </Title>

              <FlatList
                data={myTribes}
                horizontal={true}
                renderItem={_renderMyTribeItem}
                ListEmptyComponent={
                  <RecommendedUserSkeleton skeletonSize={4} />
                }
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  marginTop: 20,
                  paddingHorizontal: 15,
                  backgroundColor: colors.WHITE
                }}
              />
            </Card.Content>
          </Card>
        </Container>
      </ScrollView>

      {state.tagModal ? (
        <TagModal
          onPress={closeModal}
          data={data?.uniqueInterests}
          displayTagModal={displayTagModal}
        />
      ) : null}

      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}
