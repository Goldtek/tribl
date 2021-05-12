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
import ConnectedTribeCard from '../../../../../components/connectedTribes';
import {
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
import MyChannel from '../../../memberPassport/widget/channelCard';
import removeDuplicateMembers from '../../../../../utils/removeDuplicatePassports';

import {
  Tags,
  TagText,
  Container,
  CardContainer,
  TextContainer,
  TagContainer
} from './styles';

interface singleCommunityScreenProp extends NavigationInterface {
  route: {
    communityDetails: CommunityInterface;
    communityRefetch: () => Promise<void>;
  };
}

export default function SingleCommunity(props: singleCommunityScreenProp) {
  const { communityDetails, communityRefetch } = props.route;

  const {
    id,
    tags,
    name,
    avatar,
    isMember,
    isPrivate,
    description,
    isRequested,
    membersCount,
    uniqueInterests
  } = communityDetails;

  const { t } = useTranslation();
  const { colors, fonts } = useThemeContext();

  const [state, setState] = useState({
    showJoinCommunityModal: false,
    tagModal: false
  });

  const [buttonLabel, setButtonLabel] = useState(
    t(`community.recommended.join`)
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMember) {
      setButtonLabel(t(`community.recommended.leave`));
    } else if (isRequested) {
      setButtonLabel(t(`community.tabPanel.request`));
    } else {
      setButtonLabel(t(`community.recommended.join`));
    }
  }, [isMember, isRequested]);

  const clearTagModal = () => storage.removeTagModal(id);

  const getTagModal = async () => {
    // @ts-ignore
    const TagInfo = await storage.getTagModal();
    const info = JSON.parse(TagInfo!);
    const filteredTag = info?.community?.filter((tag: any) => tag == id);
    if (filteredTag.length && uniqueInterests.length > 0) {
      setState({ ...state, tagModal: true });
    }
  };

  useEffect(() => {
    getTagModal();
    tagScreenName('TribeHighlightScreen');
  }, []);

  const displayTagModal = (childData: boolean) => {
    setState({ ...state, tagModal: childData });
    clearTagModal();
  };

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
  const blockedUsers = userDetails?.privacy?.blocked;
  const communityChannels = channelData?.Channel?.data;
  const participants = communityMembers?.communityMembers?.data;
  const communityNearbyMembers = communityMembersData?.nearbyMembers?.data;
  const nearbyMembersData = NearbyMembers?.nearbyMembers?.data;

  const filterNearbyMebers = removeDuplicateMembers(nearbyMembersData?.slice());

  const filterUnblockedNearbyMebers = filterNearbyMebers?.filter(function (
    users
  ) {
    return !blockedUsers?.some(function (userTwo: any) {
      return users.id == userTwo.id;
    });
  });

  const filterCommunityNearbyMembers = removeDuplicateMembers(
    communityNearbyMembers?.slice()
  );

  const filterUnblockedCommunityNearbyMembers = filterCommunityNearbyMembers?.filter(
    function (users) {
      return !blockedUsers?.some(function (userTwo: any) {
        return users.id == userTwo.id;
      });
    }
  );

  const filterParticiant = removeDuplicateMembers(participants?.slice());

  const filterUnblockedParticiant = filterParticiant?.filter(function (users) {
    return !blockedUsers?.some(function (userTwo: any) {
      return users.id == userTwo.id;
    });
  });

  const filteredParticipants = participants?.filter(
    (member) => member.id !== userId
  );

  const nearbyMembers = filterUnblockedCommunityNearbyMembers?.length
    ? filterUnblockedCommunityNearbyMembers
    : [];
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
      <MyChannel key={item.id} {...item} />
    ),
    []
  );

  const [joinCommunity] = useMutation(JOIN_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const [joinPrivateCommunity] = useMutation(JOIN_PRIVATE_COMMUNITY, {
    variables: { payload: { communityId: id } }
  });

  const [leaveCommunity] = useMutation(LEAVE_COMMUNITY, {
    variables: { payload: { communityId: id, receipientIds: [userId] } }
  });

  const handleJoin = async () => {
    logEvent('join community', { from: 'community' });
    try {
      Mixpanel.track('User Joins Tribe', {
        info: `User Joins ${name} Tribe`,
        'Activity Screen': 'Recommended Community Card'
      });

      setLoading(true);
      await joinCommunity();
      communityRefetch().then(() => setLoading(false));
      if (uniqueInterests.length) {
        setState({ ...state, tagModal: true });
      }
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
    }
  };

  const handleJoinPrivateTribe = async () => {
    logEvent('request to join private community', { from: 'community' });
    try {
      Mixpanel.track('User Requests To Join Tribe', {
        info: `User Request To Join ${name} Tribe`,
        'Activity Screen': 'HignlightScreen'
      });

      setLoading(true);
      await joinPrivateCommunity();
      communityRefetch().then(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(error);
    }
  };

  const handleLeave = async () => {
    logEvent('leave community', { from: 'community' });
    try {
      setLoading(true);
      await leaveCommunity();
      communityRefetch().then(() => setLoading(false));
      clearTagModal();
      setState({ ...state, tagModal: false });
    } catch (error) {
      setLoading(false);
      crashlytics.recordError(new Error(error));
      crashlytics.log(`ERROR MESSAGE, ${error.toString()}`);
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
                    uri: avatar,
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
                  {isPrivate ? 'Private' : 'Public'}
                </Text>
              </Card.Content>
            </Card>
            <Card style={{ marginTop: RFValue(5) }}>
              <CardContainer>
                <FastImage
                  resizeMode={FastImage.resizeMode.stretch}
                  source={{
                    uri: avatar,
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
                    {name}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      lineHeight: RFValue(10),
                      color: colors.SECONDARY_TEXT
                    }}
                  >
                    {membersCount <= 1
                      ? `${membersCount} ${t('community.tabPanel.member')}`
                      : `${membersCount} ${t('community.tabPanel.member')}s`}
                  </Paragraph>
                  {description ? (
                    <Paragraph
                      style={{
                        fontSize: RFValue(fonts.MEDIUM_SIZE - 1),
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        lineHeight: 18,
                        color: colors.PRIMARY_TEXT
                      }}
                    >
                      {description}
                    </Paragraph>
                  ) : null}
                </TextContainer>
                <Button
                  mode="contained"
                  disabled={isRequested ? true : false}
                  loading={loading}
                  onPress={
                    isMember
                      ? handleLeave
                      : isPrivate
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
                    color: isRequested ? colors.PRIMARY_TEXT : colors.WHITE,
                    textTransform: 'capitalize'
                  }}
                >
                  {buttonLabel}
                </Button>
              </CardContainer>

              {tags?.length ? (
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
                    {tags.map((identity: any) => (
                      <TagText key={identity.id}>{identity.name}</TagText>
                    ))}
                  </Tags>
                </TagContainer>
              ) : null}
            </Card>
          </Fragment>
          <Card style={{ marginTop: RFValue(5) }}>
            <Card.Content style={{ paddingLeft: 0 }}>
              {nearbyMembers?.length ? (
                <Fragment>
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
                      marginTop: 5,
                      paddingHorizontal: 15
                    }}
                  />
                </Fragment>
              ) : null}
              {!isPrivate ? (
                <Fragment>
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
                    horizontal={true}
                    data={communityChannels}
                    renderItem={_renderChannel}
                    ListEmptyComponent={<ChannelSkeleton skeletonSize={4} />}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      marginTop: 5,
                      paddingHorizontal: 15
                    }}
                  />
                </Fragment>
              ) : null}

              <Title
                style={{
                  fontFamily: fonts.WORK_SANS_BOLD,
                  fontSize: RFValue(fonts.LARGE_SIZE),
                  color: colors.PRIMARY_TEXT,
                  textTransform: 'capitalize',
                  marginTop: 20,
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
                contentContainerStyle={{ marginTop: 5, paddingHorizontal: 15 }}
              />
            </Card.Content>
          </Card>
        </Container>
      </ScrollView>

      {state.tagModal ? (
        <TagModal
          onPress={closeModal}
          data={uniqueInterests}
          displayTagModal={displayTagModal}
        />
      ) : null}

      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}
