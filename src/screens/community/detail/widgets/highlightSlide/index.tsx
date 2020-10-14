import React, { useState, Fragment, useMemo, useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import { NavigationInterface } from '../../../../types';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { ScrollView, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useThemeContext } from '../../../../../theme';
import MembersCard from '../../../../../components/recommendedUser';
import {
  GET_NEARBY_MEMBERS,
  GET_SINGLE_COMMUNITY
} from '../../../../../graphql/server/query';
import RecommendedUserSkeleton from '../../../../../components/recommendedUserSkeleton';
import JoinCommunity from '../../../../../components/joinCommunity';
import Skeleton from './widget';
import { JOIN_COMMUNITY } from '../../../../../graphql/server/mutations';

import {
  Container,
  CardContainer,
  TextContainer,
  TagContainer,
  Tags,
  TagText
} from './styles';

interface SingleCommunityScreenProp extends NavigationInterface {}

export default function SingleCommunity(props: SingleCommunityScreenProp) {
  const detail = props.route;
  const { communityDetails } = detail;
  const {
    id,
    avatar,
    name,
    isMember,
    interests,
    description,
    membersCount
  } = communityDetails;
  const { colors, fonts } = useThemeContext();
  const { t } = useTranslation();
  const [state, setState] = useState({ showJoinCommunityModal: false });

  const { data: nearbyData } = useQuery(GET_NEARBY_MEMBERS);

  const { loading, data: communityData } = useQuery(GET_SINGLE_COMMUNITY, {
    variables: { id }
  });

  const nearbyMembers = nearbyData?.nearbyMembers;
  const SingleCommunity = communityData?.Community[0];

  const [data, setData] = useState({
    name: name,
    avatar: avatar,
    isMember: isMember,
    interests: interests,
    description: description,
    membersCount: membersCount
  });

  useEffect(() => {
    setData({
      ...data,
      name: SingleCommunity?.name,
      avatar: SingleCommunity?.avatar,
      isMember: SingleCommunity?.isMember,
      interests: SingleCommunity?.interests,
      description: SingleCommunity?.description,
      membersCount: SingleCommunity?.membersCount
    });
  }, [SingleCommunity?.id]);

  const resizeAvatar = data.avatar?.split('upload/');

  const banner = resizeAvatar?.length
    ? resizeAvatar[0] +
      'upload/c_fill,g_auto,h_350,w_970/b_rgb:000000,y_-0.60/c_scale,co_rgb:ffffff,fl_relative,w_0.9,y_1/' +
      resizeAvatar[1]
    : SingleCommunity?.avatar;

  const handleJoinCommunity = () => {
    setState({
      ...state,
      showJoinCommunityModal: !state.showJoinCommunityModal
    });
  };

  const _renderRecommendedMember = useMemo(
    () => ({ item, index }: any) => (
      <MembersCard
        key={item.id}
        {...item}
        index={index}
        lastChild={nearbyMembers?.length - 1}
      />
    ),
    []
  );

  const [member, setMember] = useState(false);

  const [joinCommunity, { loading: joinLoading }] = useMutation(
    JOIN_COMMUNITY,
    {
      variables: {
        payload: {
          communityId: SingleCommunity?.id
        }
      }
    }
  );

  const handleJoin = async () => {
    try {
      const { data } = await joinCommunity();
      if (data) {
        setMember(true);
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return (
    <Fragment>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <Container>
          <Fragment>
            <Card style={{ marginTop: RFValue(5), height: RFValue(230) }}>
              <Card.Content>
                <FastImage
                  resizeMode={FastImage.resizeMode.cover}
                  source={{
                    uri: banner,
                    priority: FastImage.priority.high
                  }}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />
              </Card.Content>
            </Card>
            <Card style={{ marginTop: RFValue(5) }}>
              <CardContainer>
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: data.avatar,
                    priority: FastImage.priority.high
                  }}
                  style={{ width: RFValue(50), height: '100%' }}
                />
                <TextContainer>
                  <Title
                    style={{
                      color: colors.PRIMARY_TEXT,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      fontSize: fonts.LARGE_SIZE,
                      textTransform: 'capitalize',
                      lineHeight: RFValue(19)
                    }}
                  >
                    {data.name}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: fonts.MEDIUM_SIZE - 1,
                      fontFamily: fonts.WORK_SANS_REGULAR,
                      lineHeight: RFValue(10),
                      color: colors.SECONDARY_TEXT
                    }}
                  >
                    {data.membersCount} {t(`community.tabPanel.member`)}
                  </Paragraph>
                  {data.description ? (
                    <Paragraph
                      style={{
                        fontSize: fonts.MEDIUM_SIZE - 1,
                        fontFamily: fonts.WORK_SANS_REGULAR,
                        lineHeight: RFValue(13),
                        color: colors.PRIMARY_TEXT
                      }}
                    >
                      {data?.description}
                    </Paragraph>
                  ) : null}
                </TextContainer>
                {data.isMember || member ? (
                  <Button
                    mode="contained"
                    style={{
                      width: '22%',
                      height: RFValue(40),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 4
                    }}
                    labelStyle={{
                      fontSize: fonts.LARGE_SIZE,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      color: colors.WHITE,
                      textTransform: 'capitalize'
                    }}
                  >
                    {t(`community.tabPanel.leave`)}
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    loading={joinLoading}
                    style={{
                      width: '20%',
                      height: RFValue(40),
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 4
                    }}
                    labelStyle={{
                      fontSize: fonts.LARGE_SIZE,
                      fontFamily: fonts.WORK_SANS_SEMI_BOLD,
                      color: colors.WHITE,
                      textTransform: 'capitalize'
                    }}
                    onPress={handleJoin}
                  >
                    {t(`community.tabPanel.join`)}
                  </Button>
                )}
              </CardContainer>

              {data.interests?.length ? (
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
                    {data?.interests.map((identity: any) => (
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
            </Card.Content>
          </Card>
        </Container>
      </ScrollView>
      {state.showJoinCommunityModal ? (
        <JoinCommunity onPress={handleJoinCommunity} />
      ) : null}
    </Fragment>
  );
}
